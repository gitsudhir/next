use serde_json::json;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};
use std::collections::HashMap;
use std::time::Duration;

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(esp32_sensor_handler).await
}

pub async fn esp32_sensor_handler(req: Request) -> Result<Response<Body>, Error> {
    // Parse query parameters
    let query_params: HashMap<String, String> = req
        .uri()
        .query()
        .map(|v| {
            url::form_urlencoded::parse(v.as_bytes())
                .into_owned()
                .collect()
        })
        .unwrap_or_else(HashMap::new);

    let ip = query_params.get("ip").cloned().unwrap_or_else(|| "192.168.1.23".to_string());
    
    // Validate IP format
    if !is_valid_ip(&ip) {
        return Ok(Response::builder()
            .status(StatusCode::BAD_REQUEST)
            .header("Content-Type", "application/json")
            .body(
                json!({
                    "error": "Invalid IP address format"
                })
                .to_string()
                .into(),
            )?);
    }
    
    // In a real implementation, you would fetch data from the ESP32 device
    // For demonstration purposes, we'll simulate a request to the ESP32
    match fetch_esp32_data(&ip).await {
        Ok(sensor_data) => {
            Ok(Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", "application/json")
                .body(sensor_data.into())?)
        },
        Err(e) => {
            Ok(Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header("Content-Type", "application/json")
                .body(
                    json!({
                        "error": format!("Failed to fetch data from ESP32: {}", e)
                    })
                    .to_string()
                    .into(),
                )?)
        }
    }
}

fn is_valid_ip(ip: &str) -> bool {
    let ip_regex = regex::Regex::new(r"^(\d{1,3}\.){3}\d{1,3}$").unwrap();
    if !ip_regex.is_match(ip) {
        return false;
    }
    
    // Check that each octet is between 0 and 255
    let octets: Vec<&str> = ip.split('.').collect();
    for octet in octets {
        if let Ok(_num) = octet.parse::<u8>() {
            // This check is actually redundant since u8 is always 0-255
            // but we keep it for clarity
        } else {
            return false;
        }
    }
    
    true
}

async fn fetch_esp32_data(ip: &str) -> Result<String, Box<dyn std::error::Error>> {
    // This is a mock implementation. In a real scenario, you would make an HTTP request
    // to the ESP32 device. Since we're in a serverless environment, we can't make direct
    // network requests in this example without additional setup.
    
    // Simulate a delay to mimic network request
    tokio::time::sleep(Duration::from_millis(100)).await;
    
    let response_data = json!({
        "deviceId": format!("ESP32-{}", &ip[ip.len()-2..]),
        "ip": ip,
        "timestamp": std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs(),
        "temperature": 20.0 + (rand::random::<f64>() * 10.0),
        "humidity": 50.0 + (rand::random::<f64>() * 20.0),
        "lightLevel": rand::random::<u32>() % 1000,
        "status": "online",
        "uptime": format!("{} hours", rand::random::<u32>() % 24)
    });
    
    Ok(response_data.to_string())
}