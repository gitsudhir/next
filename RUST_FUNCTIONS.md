# Rust Serverless Functions for Vercel

This project includes Rust-based serverless functions that can be deployed to Vercel. These functions provide high-performance backend capabilities while leveraging Vercel's serverless infrastructure.

## Functions

1. `/api/hello.rs` - A simple "Hello World" Rust function
2. `/api/esp32_rust.rs` - An ESP32 data handler function
3. `/api/esp32_sensor.rs` - An enhanced ESP32 sensor data handler with validation
4. `/api/send_sensor_data.rs` - A function to send sensor data to an ESP32 device
5. `/api/cars.rs` - A REST API for managing cars in a PostgreSQL database

## Setup

1. Install Rust toolchain using [rustup](https://rustup.rs/)
2. Install [Vercel CLI](https://vercel.com/docs/cli#installing-vercel-cli)

## Database Configuration

The cars API connects to a PostgreSQL database using environment variables:
- `POSTGRES_URL` or `DATABASE_URL` - Database connection string

Vercel automatically sets these when you add a PostgreSQL database to your project.

## Local Development

```bash
vercel dev
```

## Deployment

Deploy by connecting a Git repository to Vercel, or using the `vercel` command directly.

## Performance: Rust vs Next.js API Routes

🚀 **Rust API (Serverless Function) is faster than JS API (Next.js API Route)**

Performance comparison:
- **Much faster** for CPU-intensive work
- **Slightly faster** for simple APIs
- **Lower latency** and better throughput

👍 If performance is your priority → Rust is the winner.

This makes Rust serverless functions ideal for:
- Data processing and transformation
- Mathematical computations
- Database-heavy operations
- APIs that need to handle high request volumes
- Performance-critical endpoints

## Routing Priority: Next.js API Routes vs Rust Functions

When both Next.js API routes and Rust serverless functions exist at the same URL path, **Next.js API routes take precedence** and the Rust functions are ignored.

For example, if you have:
- A Next.js API route at `pages/api/users.js`
- A Rust function at `api/users.rs`

When a request is made to `/api/users`, the Next.js API route will be called and the Rust function will be ignored.

This is important to understand when designing your API architecture to avoid conflicts between implementations.

## Cars API (/api/cars)

### Overview
The cars API provides a complete RESTful interface for managing car records in a PostgreSQL database. It supports CRUD operations (Create, Read, Update, Delete) and advanced filtering capabilities.

### Features
- Query parameter-based filtering (brand, model, year)
- JSON request/response handling
- Database connection with TLS encryption
- Comprehensive error handling
- Input validation

### Scalability
For information about how the cars API scales and how to optimize it for high traffic, see [CARS_API_SCALING.md](CARS_API_SCALING.md).

### Endpoints

#### GET /api/cars
Returns all cars from the database with optional filtering.

**Query Parameters:**
- `brand` - Filter by car brand (e.g., Toyota, Ford)
- `model` - Filter by car model (e.g., Camry, Mustang)
- `year` - Filter by manufacturing year (e.g., 2020, 2023)

**Examples:**
```bash
# Get all cars
curl "https://your-domain.com/api/cars"

# Filter by brand
curl "https://your-domain.com/api/cars?brand=Toyota"

# Filter by year
curl "https://your-domain.com/api/cars?year=2020"

# Combine filters
curl "https://your-domain.com/api/cars?brand=Toyota&year=2015"
```

#### POST /api/cars
Creates a new car record in the database.

**Request Body:**
```json
{
  "brand": "string",
  "model": "string",
  "year": integer
}
```

**Example:**
```bash
curl -X POST "https://your-domain.com/api/cars" \
  -H "Content-Type: application/json" \
  -d '{"brand": "Tesla", "model": "Model 3", "year": 2023}'
```

### Database Schema
The cars API expects a table named `CARS` with the following columns:
- `brand` (TEXT) - Car manufacturer
- `model` (TEXT) - Car model name
- `year` (INTEGER) - Manufacturing year

### Implementation Details

#### Rust Dependencies
The cars API uses several key Rust crates:
- `vercel_runtime` - Vercel serverless runtime for Rust
- `tokio-postgres` - Async PostgreSQL client
- `postgres-native-tls` - TLS support for PostgreSQL connections
- `serde` - Serialization/deserialization framework
- `serde_json` - JSON handling
- `urlencoding` - URL decoding for query parameters

#### Connection Handling
Database connections are established using TLS encryption for security:
```rust
let connector = TlsConnector::new()?;
let connector = MakeTlsConnector::new(connector);
let (client, connection) = tokio_postgres::connect(&database_url, connector).await?;
```

#### Query Parameter Processing
The API parses query parameters manually to support flexible filtering:
```rust
for pair in query.split('&') {
    let parts: Vec<&str> = pair.split('=').collect();
    if parts.len() == 2 {
        match parts[0] {
            "brand" => brand_filter = Some(decode(parts[1])),
            "model" => model_filter = Some(decode(parts[1])),
            "year" => year_filter = parts[1].parse::<i32>().ok(),
            _ => {} // Ignore unknown parameters
        }
    }
}
```

#### Dynamic SQL Generation
SQL queries are constructed dynamically based on provided filters:
```rust
let mut sql = "SELECT * FROM CARS".to_string();
if !where_clauses.is_empty() {
    sql.push_str(&format!(" WHERE {}", where_clauses.join(" AND ")));
}
```

## Other API Endpoints

### GET /api/hello
Returns a simple JSON response.

**Example:**
```bash
curl https://your-domain.com/api/hello
```

### GET /api/esp32_rust
Returns mock ESP32 sensor data.

**Query Parameters:**
- `ip` - IP address of the ESP32 device

**Example:**
```bash
curl "https://your-domain.com/api/esp32_rust?ip=192.168.1.23"
```

### GET /api/esp32_sensor
Returns validated mock ESP32 sensor data.

**Query Parameters:**
- `ip` - IP address of the ESP32 device

**Example:**
```bash
curl "https://your-domain.com/api/esp32_sensor?ip=192.168.1.23"
```

### POST /api/send_sensor_data
Sends sensor data to an ESP32 device.

**Query Parameters:**
- `ip` - IP address of the ESP32 device

**Request Body:**
```json
{
  "temperature": number,
  "humidity": number
}
```

**Example:**
```bash
curl -X POST "https://your-domain.com/api/send_sensor_data?ip=192.168.1.23" \
  -H "Content-Type: application/json" \
  -d '{"temperature": 23.5, "humidity": 65.2}'
```

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
curl "http://localhost:3000/api/cars"
curl -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -d '{"brand": "Ford", "model": "Mustang", "year": 2023}'
```

## Deployment Notes

- The Rust functions will be automatically compiled and deployed by Vercel
- Make sure to use the correct runtime version in `vercel.json`
- The target directory is ignored in both `.gitignore` and `.vercelignore`
- Database connections are handled automatically when deployed to Vercel
- Query parameters in curl commands must be quoted to prevent shell interpretation issues
- Next.js API routes take precedence over Rust functions at the same URL path