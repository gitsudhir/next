use serde::{Deserialize, Serialize};
use serde_json::json;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};
use postgres_native_tls::MakeTlsConnector;
use native_tls::TlsConnector;
use std::env;

#[derive(Serialize, Deserialize, Debug)]
struct Car {
    brand: String,
    model: String,
    year: i32,
}

#[derive(Serialize, Deserialize, Debug)]
struct CarInput {
    brand: String,
    model: String,
    year: i32,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    let method = req.method().as_str().to_string();
    
    // For this specific endpoint, we're handling individual car operations
    if method == "GET" {
        return get_car_by_id(req).await;
    }
    
    if method == "PUT" {
        return update_car(req).await;
    }
    
    if method == "DELETE" {
        return delete_car(req).await;
    }
    
    // Default response for unmatched routes
    Ok(Response::builder()
        .status(StatusCode::METHOD_NOT_ALLOWED)
        .header("Content-Type", "application/json")
        .body(
            json!({
                "error": "Method not allowed"
            })
            .to_string()
            .into(),
        )?)
}

async fn get_database_client() -> Result<tokio_postgres::Client, Error> {
    // Get database connection string from environment variables
    let database_url = env::var("POSTGRES_URL")
        .or_else(|_| env::var("DATABASE_URL"))
        .map_err(|_| "Database URL not found in environment variables")?;
    
    // Create TLS connector
    let connector = TlsConnector::new()
        .map_err(|e| format!("Failed to create TLS connector: {}", e))?;
    let connector = MakeTlsConnector::new(connector);
    
    // Connect to the database
    match tokio_postgres::connect(&database_url, connector).await {
        Ok((client, connection)) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("Database connection error: {}", e);
                }
            });
            Ok(client)
        }
        Err(e) => {
            Err(format!("Failed to connect to database: {}", e).into())
        }
    }
}

async fn get_car_by_id(req: Request) -> Result<Response<Body>, Error> {
    // Extract ID from query parameters or path
    let uri = req.uri().to_string();
    let parts: Vec<&str> = uri.split('/').collect();
    let id_str = parts.last().unwrap_or(&"");
    
    match id_str.parse::<i32>() {
        Ok(car_id) => {
            match get_database_client().await {
                Ok(client) => {
                    match client.query_opt("SELECT * FROM CARS WHERE id = $1", &[&car_id]).await {
                        Ok(Some(row)) => {
                            let mut car_obj = serde_json::Map::new();
                            for (i, column) in row.columns().iter().enumerate() {
                                let column_name = column.name();
                                if let Ok(value) = row.try_get::<_, String>(i) {
                                    car_obj.insert(column_name.to_string(), serde_json::Value::String(value));
                                } else if let Ok(value) = row.try_get::<_, i32>(i) {
                                    car_obj.insert(column_name.to_string(), serde_json::Value::Number(serde_json::Number::from(value)));
                                } else {
                                    car_obj.insert(column_name.to_string(), serde_json::Value::String(format!("{:?}", row.get::<_, serde_json::Value>(i))));
                                }
                            }
                            
                            Ok(Response::builder()
                                .status(StatusCode::OK)
                                .header("Content-Type", "application/json")
                                .body(
                                    json!({
                                        "car": car_obj
                                    })
                                    .to_string()
                                    .into(),
                                )?)
                        }
                        Ok(None) => {
                            Ok(Response::builder()
                                .status(StatusCode::NOT_FOUND)
                                .header("Content-Type", "application/json")
                                .body(
                                    json!({
                                        "error": "Car not found"
                                    })
                                    .to_string()
                                    .into(),
                                )?)
                        }
                        Err(e) => {
                            Ok(Response::builder()
                                .status(StatusCode::INTERNAL_SERVER_ERROR)
                                .header("Content-Type", "application/json")
                                .body(
                                    json!({
                                        "error": format!("Failed to fetch car: {}", e)
                                    })
                                    .to_string()
                                    .into(),
                                )?)
                        }
                    }
                }
                Err(e) => {
                    Ok(Response::builder()
                        .status(StatusCode::INTERNAL_SERVER_ERROR)
                        .header("Content-Type", "application/json")
                        .body(
                            json!({
                                "error": format!("Database connection failed: {}", e)
                            })
                            .to_string()
                            .into(),
                        )?)
                }
            }
        }
        Err(_) => {
            Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("Content-Type", "application/json")
                .body(
                    json!({
                        "error": "Invalid car ID"
                    })
                    .to_string()
                    .into(),
                )?)
        }
    }
}

async fn update_car(req: Request) -> Result<Response<Body>, Error> {
    // Extract ID from path
    let uri = req.uri().to_string();
    let parts: Vec<&str> = uri.split('/').collect();
    let id_str = parts.last().unwrap_or(&"");
    
    // Get the request body
    let body_bytes = req.into_body().to_vec();
    let body_str = String::from_utf8(body_bytes)?;
    
    // Parse the JSON
    let car_input: CarInput = match serde_json::from_str(&body_str) {
        Ok(car) => car,
        Err(_) => {
            return Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("Content-Type", "application/json")
                .body(
                    json!({
                        "error": "Invalid JSON"
                    })
                    .to_string()
                    .into(),
                )?);
        }
    };
    
    match id_str.parse::<i32>() {
        Ok(car_id) => {
            match get_database_client().await {
                Ok(client) => {
                    match client.execute(
                        "UPDATE CARS SET brand = $1, model = $2, year = $3 WHERE id = $4",
                        &[&car_input.brand, &car_input.model, &car_input.year, &car_id]
                    ).await {
                        Ok(rows_affected) => {
                            if rows_affected > 0 {
                                let updated_car = Car {
                                    brand: car_input.brand,
                                    model: car_input.model,
                                    year: car_input.year,
                                };
                                
                                Ok(Response::builder()
                                    .status(StatusCode::OK)
                                    .header("Content-Type", "application/json")
                                    .body(
                                        json!({
                                            "message": "Car updated successfully",
                                            "car": updated_car
                                        })
                                        .to_string()
                                        .into(),
                                    )?)
                            } else {
                                Ok(Response::builder()
                                    .status(StatusCode::NOT_FOUND)
                                    .header("Content-Type", "application/json")
                                    .body(
                                        json!({
                                            "error": "Car not found"
                                        })
                                        .to_string()
                                        .into(),
                                    )?)
                            }
                        }
                        Err(e) => {
                            Ok(Response::builder()
                                .status(StatusCode::INTERNAL_SERVER_ERROR)
                                .header("Content-Type", "application/json")
                                .body(
                                    json!({
                                        "error": format!("Failed to update car: {}", e)
                                    })
                                    .to_string()
                                    .into(),
                                )?)
                        }
                    }
                }
                Err(e) => {
                    Ok(Response::builder()
                        .status(StatusCode::INTERNAL_SERVER_ERROR)
                        .header("Content-Type", "application/json")
                        .body(
                            json!({
                                "error": format!("Database connection failed: {}", e)
                            })
                            .to_string()
                            .into(),
                        )?)
                }
            }
        }
        Err(_) => {
            Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("Content-Type", "application/json")
                .body(
                    json!({
                        "error": "Invalid car ID"
                    })
                    .to_string()
                    .into(),
                )?)
        }
    }
}

async fn delete_car(req: Request) -> Result<Response<Body>, Error> {
    // Extract ID from path
    let uri = req.uri().to_string();
    let parts: Vec<&str> = uri.split('/').collect();
    let id_str = parts.last().unwrap_or(&"");
    
    match id_str.parse::<i32>() {
        Ok(car_id) => {
            match get_database_client().await {
                Ok(client) => {
                    match client.execute("DELETE FROM CARS WHERE id = $1", &[&car_id]).await {
                        Ok(rows_affected) => {
                            if rows_affected > 0 {
                                Ok(Response::builder()
                                    .status(StatusCode::OK)
                                    .header("Content-Type", "application/json")
                                    .body(
                                        json!({
                                            "message": "Car deleted successfully"
                                        })
                                        .to_string()
                                        .into(),
                                    )?)
                            } else {
                                Ok(Response::builder()
                                    .status(StatusCode::NOT_FOUND)
                                    .header("Content-Type", "application/json")
                                    .body(
                                        json!({
                                            "error": "Car not found"
                                        })
                                        .to_string()
                                        .into(),
                                    )?)
                            }
                        }
                        Err(e) => {
                            Ok(Response::builder()
                                .status(StatusCode::INTERNAL_SERVER_ERROR)
                                .header("Content-Type", "application/json")
                                .body(
                                    json!({
                                        "error": format!("Failed to delete car: {}", e)
                                    })
                                    .to_string()
                                    .into(),
                                )?)
                        }
                    }
                }
                Err(e) => {
                    Ok(Response::builder()
                        .status(StatusCode::INTERNAL_SERVER_ERROR)
                        .header("Content-Type", "application/json")
                        .body(
                            json!({
                                "error": format!("Database connection failed: {}", e)
                            })
                            .to_string()
                            .into(),
                        )?)
                }
            }
        }
        Err(_) => {
            Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("Content-Type", "application/json")
                .body(
                    json!({
                        "error": "Invalid car ID"
                    })
                    .to_string()
                    .into(),
                )?)
        }
    }
}