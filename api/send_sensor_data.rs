use serde_json::json;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};
use std::collections::HashMap;

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(send_sensor_data_handler).await
}

pub async fn send_sensor_data_handler(req: Request) -> Result<Response<Body>, Error> {
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
    
    // Get the request body as a string
    let body_bytes = req.into_body().to_vec();
    let body_str = String::from_utf8(body_bytes)?;
    
    // In a real implementation, you would send this data to the ESP32 device
    // For demonstration purposes, we'll just log it and return a success message
    println!("Sending sensor data to ESP32 at {}: {}", ip, body_str);
    
    // Simulate sending data to ESP32
    match send_data_to_esp32(&ip, &body_str).await {
        Ok(_) => {
            Ok(Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", "application/json")
                .body(
                    json!({
                        "message": "Sensor data sent successfully to ESP32",
                        "ip": ip,
                        "data": serde_json::from_str::<serde_json::Value>(&body_str).unwrap_or(json!({}))
                    })
                    .to_string()
                    .into(),
                )?)
        },
        Err(e) => {
            Ok(Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header("Content-Type", "application/json")
                .body(
                    json!({
                        "error": format!("Failed to send data to ESP32: {}", e)
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

async fn send_data_to_esp32(_ip: &str, _data: &str) -> Result<(), Box<dyn std::error::Error>> {
    // This is a mock implementation. In a real scenario, you would make an HTTP POST request
    // to the ESP32 device. Since we're in a serverless environment, we can't make direct
    // network requests in this example without additional setup.
    
    // Simulate a delay to mimic network request
    tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
    
    // Simulate a 90% success rate
    if rand::random::<f64>() < 0.9 {
        Ok(())
    } else {
        Err("Network error".into())
    }
}