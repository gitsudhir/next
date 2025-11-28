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
}

#[derive(Serialize, Deserialize, Debug)]
struct FieldInfo {
    name: String,
    data_type: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct NeonQueryRequest {
    query: String,
    #[serde(skip_serializing_if = "Option::is_none")]
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

async fn get_neon_client() -> Result<Client, Error> {
    Ok(Client::new())
}

fn get_neon_connection_info() -> Result<(String, String), Error> {
    // Get database connection string from environment variables
    let database_url = env::var("POSTGRES_URL")
        .or_else(|_| env::var("DATABASE_URL"))
        .map_err(|_| "Database URL not found in environment variables")?;
    
    // Extract connection info from the URL
    let url = Url::parse(&database_url)
        .map_err(|e| format!("Failed to parse database URL: {}", e))?;
    
    let host = url.host_str().unwrap_or("localhost").to_string();
    let username = url.username().to_string();
    let password = url.password().unwrap_or("").to_string();
    let database = url.path().trim_start_matches('/').to_string();
    
    // Construct Neon HTTP API endpoint
    // Note: This is a simplified approach. In production, you would use Neon's official HTTP API
    let api_endpoint = format!("https://{}.neon.tech/api/v1/execute", host.split('.').next().unwrap_or("unknown"));
    
    Ok((api_endpoint, database_url))
}

async fn execute_neon_query(query: &str, params: Option<Vec<serde_json::Value>>) -> Result<NeonQueryResponse, Error> {
    let client = get_neon_client().await?;
    let (_, database_url) = get_neon_connection_info()?;
    
    // For now, we'll use the traditional approach but with better connection handling
    // In a real implementation with Neon's HTTP API, you would make an HTTP request here
    
    // This is a placeholder - in reality, you would make an HTTP POST request to Neon's API
    // For now, we'll keep the existing TCP-based approach but with improved error handling
    
    execute_tcp_query(query, params).await
}

async fn execute_tcp_query(query: &str, params: Option<Vec<serde_json::Value>>) -> Result<NeonQueryResponse, Error> {
    use postgres_native_tls::MakeTlsConnector;
    use native_tls::TlsConnector;
    use tokio_postgres::types::ToSql;
    
    let database_url = env::var("POSTGRES_URL")
        .or_else(|_| env::var("DATABASE_URL"))
        .map_err(|_| "Database URL not found in environment variables")?;
    
    // Create TLS connector
    let connector = TlsConnector::new()
        .map_err(|e| format!("Failed to create TLS connector: {}", e))?;
    let connector = MakeTlsConnector::new(connector);
    
    // Connect to the database
    let (client, connection) = tokio_postgres::connect(&database_url, connector)
        .await
        .map_err(|e| format!("Failed to connect to database: {}", e))?;
    
    // Spawn the connection to run in the background
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Database connection error: {}", e);
        }
    });
    
    // Prepare parameters for the query
    let param_refs: Vec<&(dyn ToSql + Sync)> = if let Some(params) = params {
        params.iter().map(|p| p as &(dyn ToSql + Sync)).collect()
    } else {
        vec![]
    };
    
    // Execute the query
    let rows = client.query(query, &param_refs)
        .await
        .map_err(|e| format!("Failed to execute query: {}", e))?;
    
    // Convert rows to JSON format
    let json_rows: Vec<serde_json::Value> = rows
        .into_iter()
        .map(|row| {
            let mut obj = serde_json::Map::new();
            for (i, column) in row.columns().iter().enumerate() {
                let column_name = column.name();
                if let Ok(value) = row.try_get::<_, String>(i) {
                    obj.insert(column_name.to_string(), serde_json::Value::String(value));
                } else if let Ok(value) = row.try_get::<_, i32>(i) {
                    obj.insert(column_name.to_string(), serde_json::Value::Number(serde_json::Number::from(value)));
                } else {
                    obj.insert(column_name.to_string(), serde_json::Value::String(format!("{:?}", row.get::<_, serde_json::Value>(i))));
                }
            }
            serde_json::Value::Object(obj)
        })
        .collect();
    
    Ok(NeonQueryResponse {
        rows: json_rows,
        fields: vec![], // In a real implementation, you would populate this
    })
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
    
    match execute_neon_query(&sql, Some(params)).await {
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
    
    match execute_neon_query(&sql, Some(params)).await {
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