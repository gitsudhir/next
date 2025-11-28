# Rust Serverless Functions for Vercel

This project includes Rust-based serverless functions that can be deployed to Vercel.

## Functions

1. `/api/hello.rs` - A simple "Hello World" Rust function
2. `/api/esp32_rust.rs` - An ESP32 data handler function
3. `/api/esp32_sensor.rs` - An enhanced ESP32 sensor data handler with validation
4. `/api/send_sensor_data.rs` - A function to send sensor data to an ESP32 device
5. `/api/cars.rs` - A REST API for managing cars in a PostgreSQL database

## Setup

1. Install Rust toolchain using [rustup](https://rustup.rs/)
2. Install [Vercel CLI](https://vercel.com/docs/cli#installing-vercel-cli)

## Local Development

```bash
vercel dev
```

## Deployment

Deploy by connecting a Git repository to Vercel, or using the `vercel` command directly.

## Endpoints

- `GET /api/hello` - Returns a simple JSON response
- `GET /api/esp32_rust?ip=192.168.1.23` - Returns mock ESP32 sensor data
- `GET /api/esp32_sensor?ip=192.168.1.23` - Returns validated mock ESP32 sensor data
- `POST /api/send_sensor_data?ip=192.168.1.23` - Sends sensor data to an ESP32 device
- `GET /api/cars` - Returns all cars from the database
- `GET /api/cars/{id}` - Returns a specific car by ID
- `POST /api/cars` - Creates a new car
- `PUT /api/cars/{id}` - Updates a specific car by ID
- `DELETE /api/cars/{id}` - Deletes a specific car by ID

## Dependencies

All Rust dependencies are defined in `Cargo.toml`.

## Testing

You can test the functions locally using curl:

```bash
# Test the hello function
curl http://localhost:3000/api/hello

# Test the ESP32 sensor function
curl "http://localhost:3000/api/esp32_sensor?ip=192.168.1.23"

# Test the send sensor data function
curl -X POST "http://localhost:3000/api/send_sensor_data?ip=192.168.1.23" \
  -H "Content-Type: application/json" \
  -d '{"temperature": 23.5, "humidity": 65.2}'

# Test the cars API
curl http://localhost:3000/api/cars
curl http://localhost:3000/api/cars/1
curl -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -d '{"brand": "Ford", "model": "Mustang", "year": 2023}'
```

## Deployment Notes

- The Rust functions will be automatically compiled and deployed by Vercel
- Make sure to use the correct runtime version in `vercel.json`
- The target directory is ignored in both `.gitignore` and `.vercelignore`
- For database operations, you'll need to implement actual database connections