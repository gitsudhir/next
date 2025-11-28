use serde::{Deserialize, Serialize};
use serde_json::json;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};
use tokio_postgres::{Client, NoTls};
use std::env;

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

#[derive(Serialize, Deserialize, Debug)]
struct CarWithId {
    id: i32,
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
    
    // Handle different endpoints
    if method == "GET" && path == "/api/cars" {
        return get_all_cars().await;
    }
    
    if method == "GET" && path.starts_with("/api/cars/") {
        let id = path.trim_start_matches("/api/cars/");
        return get_car_by_id(id).await;
    }
    
    if method == "POST" && path == "/api/cars" {
        return create_car(req).await;
    }
    
    if method == "PUT" && path.starts_with("/api/cars/") {
        let id = path.trim_start_matches("/api/cars/");
        return update_car(req, id).await;
    }
    
    if method == "DELETE" && path.starts_with("/api/cars/") {
        let id = path.trim_start_matches("/api/cars/");
        return delete_car(id).await;
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

async fn get_database_client() -> Result<Client, Error> {
    // Get database connection string from environment variables
    // Vercel automatically sets these when you add a PostgreSQL database
    let database_url = env::var("POSTGRES_URL")
        .or_else(|_| env::var("DATABASE_URL"))
        .map_err(|_| "Database URL not found in environment variables")?;
    
    // For Vercel deployments, we can use a simpler approach
    // Let's try to connect with NoTls first, and if that fails, we'll handle it gracefully
    match tokio_postgres::connect(&database_url, NoTls).await {
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

async fn get_all_cars() -> Result<Response<Body>, Error> {
    match get_database_client().await {
        Ok(client) => {
            match client.query("SELECT id, brand, model, year FROM cars", &[]).await {
                Ok(rows) => {
                    let cars: Vec<CarWithId> = rows
                        .into_iter()
                        .map(|row| CarWithId {
                            id: row.get(0),
                            brand: row.get(1),
                            model: row.get(2),
                            year: row.get(3),
                        })
                        .collect();
                    
                    Ok(Response::builder()
                        .status(StatusCode::OK)
                        .header("Content-Type", "application/json")
                        .body(
                            json!({
                                "cars": cars
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

async fn get_car_by_id(id: &str) -> Result<Response<Body>, Error> {
    match id.parse::<i32>() {
        Ok(car_id) => {
            match get_database_client().await {
                Ok(client) => {
                    match client.query_opt("SELECT id, brand, model, year FROM cars WHERE id = $1", &[&car_id]).await {
                        Ok(Some(row)) => {
                            let car = CarWithId {
                                id: row.get(0),
                                brand: row.get(1),
                                model: row.get(2),
                                year: row.get(3),
                            };
                            
                            Ok(Response::builder()
                                .status(StatusCode::OK)
                                .header("Content-Type", "application/json")
                                .body(
                                    json!({
                                        "car": car
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
                "INSERT INTO cars (brand, model, year) VALUES ($1, $2, $3)",
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
                        "UPDATE cars SET brand = $1, model = $2, year = $3 WHERE id = $4",
                        &[&car_input.brand, &car_input.model, &car_input.year, &car_id]
                    ).await {
                        Ok(rows_affected) => {
                            if rows_affected > 0 {
                                let updated_car = CarWithId {
                                    id: car_id,
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
                    match client.execute("DELETE FROM cars WHERE id = $1", &[&car_id]).await {
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