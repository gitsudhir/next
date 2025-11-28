use serde_json::json;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};
use std::collections::HashMap;

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(esp32_handler).await
}

pub async fn esp32_handler(req: Request) -> Result<Response<Body>, Error> {
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
    
    // In a real implementation, you would fetch data from the ESP32 device
    // For now, we'll return mock data
    
    let response_data = json!({
        "deviceId": "ESP32-TEST-001",
        "ip": ip,
        "timestamp": std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs(),
        "temperature": 23.5,
        "humidity": 65.2,
        "lightLevel": 450,
        "status": "online"
    });

    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(response_data.to_string().into())?)
}