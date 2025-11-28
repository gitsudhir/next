use serde::{Deserialize, Serialize};
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};
use postgres_native_tls::MakeTlsConnector;
use native_tls::TlsConnector;
use std::env;
// TOON format for reduced token usage
use json2toon_rs::{encode, decode, EncoderOptions, DecoderOptions};

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
struct CarsResponse {
    cars: Vec<Car>,
    filters: Filters,
}

#[derive(Serialize, Deserialize, Debug)]
struct Filters {
    brand: Option<String>,
    model: Option<String>,
    year: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug)]
struct CarResponse {
    message: String,
    car: Car,
}

#[derive(Serialize, Deserialize, Debug)]
struct ErrorResponse {
    error: String,
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
    if method == "GET" && path == "/api/toon/cars" {
        return get_cars_with_filters(query).await;
    }
    
    if method == "POST" && path == "/api/toon/cars" {
        return create_car(req).await;
    }
    
    // Default response for unmatched routes
    let error_response = ErrorResponse {
        error: "Endpoint not found".to_string(),
    };
    let toon_response = encode(&serde_json::to_value(&error_response)?, &EncoderOptions::default());
    
    Ok(Response::builder()
        .status(StatusCode::NOT_FOUND)
        .header("Content-Type", "application/toon") // Custom MIME type for TOON
        .body(
            toon_response
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
    let mut params: Vec<String> = vec![];
    let mut int_params: Vec<i32> = vec![];
    let mut param_index = 1;
    
    let mut where_clauses = vec![];
    
    if let Some(ref brand) = brand_filter {
        where_clauses.push(format!("brand = ${}", param_index));
        params.push(brand.clone());
        param_index += 1;
    }
    
    if let Some(ref model) = model_filter {
        where_clauses.push(format!("model = ${}", param_index));
        params.push(model.clone());
        param_index += 1;
    }
    
    if let Some(year) = year_filter {
        where_clauses.push(format!("year = ${}", param_index));
        int_params.push(year);
    }
    
    if !where_clauses.is_empty() {
        sql.push_str(&format!(" WHERE {}", where_clauses.join(" AND ")));
    }
    
    match get_database_client().await {
        Ok(client) => {
            let rows = if !params.is_empty() || !int_params.is_empty() {
                // We have parameters, execute with them
                if params.len() == 1 && int_params.is_empty() {
                    client.query(&sql, &[&params[0]]).await
                } else if params.is_empty() && int_params.len() == 1 {
                    client.query(&sql, &[&int_params[0]]).await
                } else if params.len() == 1 && int_params.len() == 1 {
                    client.query(&sql, &[&params[0], &int_params[0]]).await
                } else if params.len() == 2 && int_params.is_empty() {
                    client.query(&sql, &[&params[0], &params[1]]).await
                } else {
                    // Fallback to no parameters for now
                    client.query(&sql, &[]).await
                }
            } else {
                // No parameters
                client.query(&sql, &[]).await
            };
            
            match rows {
                Ok(rows) => {
                    // Convert rows to Car structs
                    let cars: Vec<Car> = rows
                        .into_iter()
                        .filter_map(|row| {
                            match (row.try_get::<_, String>(0), row.try_get::<_, String>(1), row.try_get::<_, i32>(2)) {
                                (Ok(brand), Ok(model), Ok(year)) => {
                                    Some(Car { brand, model, year })
                                }
                                _ => None
                            }
                        })
                        .collect();
                    
                    let response = CarsResponse {
                        cars,
                        filters: Filters {
                            brand: brand_filter,
                            model: model_filter,
                            year: year_filter,
                        }
                    };
                    
                    let toon_response = encode(&serde_json::to_value(&response)?, &EncoderOptions::default());
                    
                    Ok(Response::builder()
                        .status(StatusCode::OK)
                        .header("Content-Type", "application/toon") // Custom MIME type for TOON
                        .body(
                            toon_response
                            .into(),
                        )?)
                }
                Err(e) => {
                    let error_response = ErrorResponse {
                        error: format!("Failed to fetch cars: {}", e),
                    };
                    let toon_response = encode(&serde_json::to_value(&error_response)?, &EncoderOptions::default());
                    
                    Ok(Response::builder()
                        .status(StatusCode::INTERNAL_SERVER_ERROR)
                        .header("Content-Type", "application/toon")
                        .body(
                            toon_response
                            .into(),
                        )?)
                }
            }
        }
        Err(e) => {
            let error_response = ErrorResponse {
                error: format!("Database connection failed: {}", e),
            };
            let toon_response = encode(&serde_json::to_value(&error_response)?, &EncoderOptions::default());
            
            Ok(Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header("Content-Type", "application/toon")
                .body(
                    toon_response
                    .into(),
                )?)
        }
    }
}

async fn create_car(req: Request) -> Result<Response<Body>, Error> {
    // Get the request body
    let body_bytes = req.into_body().to_vec();
    let body_str = String::from_utf8(body_bytes)?;
    
    // Parse the TOON data
    let json_value = decode(&body_str, &DecoderOptions::default())
        .map_err(|e| format!("Failed to decode TOON data: {}", e))?;
    
    let car_input: CarInput = serde_json::from_value(json_value)
        .map_err(|e| format!("Failed to parse TOON data: {}", e))?;
    
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
                    
                    let response = CarResponse {
                        message: "Car created successfully".to_string(),
                        car: new_car,
                    };
                    
                    let toon_response = encode(&serde_json::to_value(&response)?, &EncoderOptions::default());
                    
                    Ok(Response::builder()
                        .status(StatusCode::CREATED)
                        .header("Content-Type", "application/toon")
                        .body(
                            toon_response
                            .into(),
                        )?)
                }
                Err(e) => {
                    let error_response = ErrorResponse {
                        error: format!("Failed to create car: {}", e),
                    };
                    let toon_response = encode(&serde_json::to_value(&error_response)?, &EncoderOptions::default());
                    
                    Ok(Response::builder()
                        .status(StatusCode::INTERNAL_SERVER_ERROR)
                        .header("Content-Type", "application/toon")
                        .body(
                            toon_response
                            .into(),
                        )?)
                }
            }
        }
        Err(e) => {
            let error_response = ErrorResponse {
                error: format!("Database connection failed: {}", e),
            };
            let toon_response = encode(&serde_json::to_value(&error_response)?, &EncoderOptions::default());
            
            Ok(Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header("Content-Type", "application/toon")
                .body(
                    toon_response
                    .into(),
                )?)
        }
    }
}