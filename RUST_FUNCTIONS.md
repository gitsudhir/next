# Rust Serverless Functions for Vercel

This project includes Rust-based serverless functions that can be deployed to Vercel.

## Functions

1. `/api/hello.rs` - A simple "Hello World" Rust function
2. `/api/esp32_rust.rs` - An ESP32 data handler function
3. `/api/esp32_sensor.rs` - An enhanced ESP32 sensor data handler with validation
4. `/api/send_sensor_data.rs` - A function to send sensor data to an ESP32 device

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
```

## Deployment Notes

- The Rust functions will be automatically compiled and deployed by Vercel
- Make sure to use the correct runtime version in `vercel.json`
- The target directory is ignored in both `.gitignore` and `.vercelignore`