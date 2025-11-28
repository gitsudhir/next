use serde::{Deserialize, Serialize};
use serde_json::json;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};
use postgres_native_tls::MakeTlsConnector;
use native_tls::TlsConnector;
use std::env;
use url::Url;

// Define the Car struct to match the database table
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
    let path = req.uri().path().to_string();
    let query = req.uri().query().unwrap_or("");
    
    // Handle different endpoints
    if method == "GET" && path == "/api/cars" {
        return get_cars_with_filters(query).await;
    }
    
    if method == "POST" && path == "/api/cars" {
        return create_car(req).await;
    }
    
    // Default response for unmatched routes
    Ok(Response::builder()
        .status(StatusCode::NOT_FOUND)
        .header("Content-Type", "application/json")
        .body(
            json!({
                "error": "Endpoint not found"
            })
            .to_string()
            .into(),
        )?)
}

async fn get_database_client() -> Result<tokio_postgres::Client, Error> {
    // Get database connection string from environment variables
    // Vercel automatically sets these when you add a PostgreSQL database
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
            // Spawn the connection to run in the background
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("Database connection error: {}", e);
                }
            });
            Ok(client)
        }
        Err(e) => {
            eprintln!("Database connection error: {}", e);
            Err(format!("Failed to connect to database: {}", e).into())
        }
    }
}

async fn get_cars_with_filters(query: &str) -> Result<Response<Body>, Error> {
    // Parse query parameters
    let mut brand_filter: Option<String> = None;
    let mut model_filter: Option<String> = None;
    let mut year_filter: Option<i32> = None;
    
    // Parse query string manually
    for pair in query.split('&') {
        let parts: Vec<&str> = pair.split('=').collect();
        if parts.len() == 2 {
            let key = parts[0];
            let value = parts[1];
            
            match key {
                "brand" => brand_filter = Some(urlencoding::decode(value).unwrap_or_default().to_string()),
                "model" => model_filter = Some(urlencoding::decode(value).unwrap_or_default().to_string()),
                "year" => year_filter = value.parse::<i32>().ok(),
                _ => {} // Ignore unknown parameters
            }
        }
    }
    
    // Build SQL query dynamically based on filters
    let mut sql = "SELECT * FROM CARS".to_string();
    let mut params: Vec<Box<dyn postgres_types::ToSql + Sync>> = vec![];
    let mut param_index = 1;
    
    let mut where_clauses = vec![];
    
    if let Some(ref brand) = brand_filter {
        where_clauses.push(format!("brand = ${}", param_index));
        params.push(Box::new(brand.clone()));
        param_index += 1;
    }
    
    if let Some(ref model) = model_filter {
        where_clauses.push(format!("model = ${}", param_index));
        params.push(Box::new(model.clone()));
        param_index += 1;
    }
    
    if let Some(year) = year_filter {
        where_clauses.push(format!("year = ${}", param_index));
        params.push(Box::new(year));
    }
    
    if !where_clauses.is_empty() {
        sql.push_str(&format!(" WHERE {}", where_clauses.join(" AND ")));
    }
    
    match get_database_client().await {
        Ok(client) => {
            // Execute query with parameters
            let params_refs: Vec<&(dyn postgres_types::ToSql + Sync)> = params.iter().map(|p| p.as_ref()).collect();
            
            match client.query(&sql, &params_refs).await {
                Ok(rows) => {
                    // Convert rows to a simple JSON array
                    let cars: Vec<serde_json::Value> = rows
                        .into_iter()
                        .map(|row| {
                            // Create a generic object for each row
                            let mut obj = serde_json::Map::new();
                            for (i, column) in row.columns().iter().enumerate() {
                                let column_name = column.name();
                                // Try to get value as string first, then as integer
                                if let Ok(value) = row.try_get::<_, String>(i) {
                                    obj.insert(column_name.to_string(), serde_json::Value::String(value));
                                } else if let Ok(value) = row.try_get::<_, i32>(i) {
                                    obj.insert(column_name.to_string(), serde_json::Value::Number(serde_json::Number::from(value)));
                                } else {
                                    // Fallback to string representation
                                    obj.insert(column_name.to_string(), serde_json::Value::String(format!("{:?}", row.get::<_, serde_json::Value>(i))));
                                }
                            }
                            serde_json::Value::Object(obj)
                        })
                        .collect();
                    
                    Ok(Response::builder()
                        .status(StatusCode::OK)
                        .header("Content-Type", "application/json")
                        .body(
                            json!({
                                "cars": cars,
                                "filters": {
                                    "brand": brand_filter,
                                    "model": model_filter,
                                    "year": year_filter
                                }
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
                                "error": format!("Failed to fetch cars: {}", e)
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

async fn create_car(req: Request) -> Result<Response<Body>, Error> {
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
    
    match get_database_client().await {
        Ok(client) => {
            match client.execute(
                "INSERT INTO CARS (brand, model, year) VALUES ($1, $2, $3)",
                &[&car_input.brand, &car_input.model, &car_input.year]
            ).await {
                Ok(_) => {
                    let new_car = Car {
                        brand: car_input.brand,
                        model: car_input.model,
                        year: car_input.year,
                    };
                    
                    Ok(Response::builder()
                        .status(StatusCode::CREATED)
                        .header("Content-Type", "application/json")
                        .body(
                            json!({
                                "message": "Car created successfully",
                                "car": new_car
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
                                "error": format!("Failed to create car: {}", e)
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

async fn update_car(req: Request, id: &str) -> Result<Response<Body>, Error> {
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
    
    match id.parse::<i32>() {
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

async fn delete_car(id: &str) -> Result<Response<Body>, Error> {
    match id.parse::<i32>() {
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