use serde::{Deserialize, Serialize};
use serde_json::json;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};

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

async fn get_all_cars() -> Result<Response<Body>, Error> {
    // This is a mock implementation since we can't directly connect to Vercel Postgres from Rust
    // In a real implementation, you would connect to the database here
    
    let cars = vec![
        Car {
            brand: "Toyota".to_string(),
            model: "Camry".to_string(),
            year: 2022,
        },
        Car {
            brand: "Honda".to_string(),
            model: "Civic".to_string(),
            year: 2021,
        },
    ];
    
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

async fn get_car_by_id(_id: &str) -> Result<Response<Body>, Error> {
    // This is a mock implementation
    // In a real implementation, you would query the database here
    
    // For demo purposes, we'll just return a mock car
    let car = Car {
        brand: "Toyota".to_string(),
        model: "Camry".to_string(),
        year: 2022,
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
    
    // This is a mock implementation
    // In a real implementation, you would insert into the database here
    
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

async fn update_car(req: Request, _id: &str) -> Result<Response<Body>, Error> {
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
    
    // This is a mock implementation
    // In a real implementation, you would update the database here
    
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
}

async fn delete_car(_id: &str) -> Result<Response<Body>, Error> {
    // This is a mock implementation
    // In a real implementation, you would delete from the database here
    
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
}