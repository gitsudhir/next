use serde::{Deserialize, Serialize};
use serde_json::json;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};
use std::env;
use url::Url;
use reqwest::Client;

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

// Neon HTTP API response structure
#[derive(Serialize, Deserialize, Debug)]
struct NeonQueryResponse {
    rows: Vec<serde_json::Value>,
    fields: Vec<FieldInfo>,
    affected_rows: Option<u64>,
}

#[derive(Serialize, Deserialize, Debug)]
struct FieldInfo {
    name: String,
    data_type: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct NeonQueryRequest {
    query: String,
    params: Option<Vec<serde_json::Value>>,
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

async fn get_neon_http_client() -> Result<Client, Error> {
    Ok(Client::new())
}

fn get_neon_config() -> Result<(String, String), Error> {
    // Get database connection string from environment variables
    let database_url = env::var("POSTGRES_URL")
        .or_else(|_| env::var("DATABASE_URL"))
        .map_err(|_| "Database URL not found in environment variables")?;
    
    // Extract the project ID from the Neon URL
    // Format: postgres://username:password@project-id.region.provider.neon.tech/dbname
    let url = Url::parse(&database_url)
        .map_err(|e| format!("Failed to parse database URL: {}", e))?;
    
    let host = url.host_str().unwrap_or("localhost");
    let project_id = host.split('.').next().unwrap_or("unknown");
    
    // Construct Neon HTTP API endpoint
    let api_endpoint = format!("https://console.neon.tech/api/v1/projects/{}/query", project_id);
    
    // Get API key from environment
    let api_key = env::var("NEON_API_KEY")
        .map_err(|_| "NEON_API_KEY not found in environment variables")?;
    
    Ok((api_endpoint, api_key))
}

async fn execute_neon_http_query(query: &str, params: Option<Vec<serde_json::Value>>) -> Result<NeonQueryResponse, Error> {
    let client = get_neon_http_client().await?;
    let (api_endpoint, api_key) = get_neon_config()?;
    
    let query_request = NeonQueryRequest {
        query: query.to_string(),
        params: params.clone(),
    };
    
    // Make HTTP request to Neon API
    let response = client
        .post(&api_endpoint)
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&query_request)
        .send()
        .await
        .map_err(|e| format!("Failed to send request to Neon API: {}", e))?;
    
    // Check if the request was successful
    if !response.status().is_success() {
        let status = response.status();
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("Neon API request failed with status {}: {}", status, error_text).into());
    }
    
    // Parse the response
    let neon_response: NeonQueryResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse Neon API response: {}", e))?;
    
    Ok(neon_response)
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
    let mut params: Vec<serde_json::Value> = vec![];
    let mut param_index = 1;
    
    let mut where_clauses = vec![];
    
    if let Some(ref brand) = brand_filter {
        where_clauses.push(format!("brand = ${}", param_index));
        params.push(serde_json::Value::String(brand.clone()));
        param_index += 1;
    }
    
    if let Some(ref model) = model_filter {
        where_clauses.push(format!("model = ${}", param_index));
        params.push(serde_json::Value::String(model.clone()));
        param_index += 1;
    }
    
    if let Some(year) = year_filter {
        where_clauses.push(format!("year = ${}", param_index));
        params.push(serde_json::Value::Number(serde_json::Number::from(year)));
    }
    
    if !where_clauses.is_empty() {
        sql.push_str(&format!(" WHERE {}", where_clauses.join(" AND ")));
    }
    
    match execute_neon_http_query(&sql, Some(params)).await {
        Ok(result) => {
            Ok(Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", "application/json")
                .body(
                    json!({
                        "cars": result.rows,
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
            eprintln!("Database query error: {}", e);
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
    
    let sql = "INSERT INTO CARS (brand, model, year) VALUES ($1, $2, $3) RETURNING *";
    let params = vec![
        serde_json::Value::String(car_input.brand.clone()),
        serde_json::Value::String(car_input.model.clone()),
        serde_json::Value::Number(serde_json::Number::from(car_input.year)),
    ];
    
    match execute_neon_http_query(&sql, Some(params)).await {
        Ok(result) => {
            if let Some(first_row) = result.rows.first() {
                Ok(Response::builder()
                    .status(StatusCode::CREATED)
                    .header("Content-Type", "application/json")
                    .body(
                        json!({
                            "message": "Car created successfully",
                            "car": first_row
                        })
                        .to_string()
                        .into(),
                    )?)
            } else {
                Ok(Response::builder()
                    .status(StatusCode::INTERNAL_SERVER_ERROR)
                    .header("Content-Type", "application/json")
                    .body(
                        json!({
                            "error": "Failed to create car"
                        })
                        .to_string()
                        .into(),
                    )?)
            }
        }
        Err(e) => {
            eprintln!("Database query error: {}", e);
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