# Rust Serverless Functions for Vercel

This project includes Rust-based serverless functions that can be deployed to Vercel. These functions provide high-performance backend capabilities while leveraging Vercel's serverless infrastructure.

## Functions

1. `/api/hello.rs` - A simple "Hello World" Rust function
2. `/api/esp32_rust.rs` - An ESP32 data handler function
3. `/api/esp32_sensor.rs` - An enhanced ESP32 sensor data handler with validation
4. `/api/send_sensor_data.rs` - A function to send sensor data to an ESP32 device
5. `/api/cars.rs` - A REST API for managing cars in a PostgreSQL database (TCP-based)
6. `/api/cars_neon_http.rs` - A REST API for managing cars using Neon's HTTP API
7. `/api/toon/cars.rs` - A REST API for managing cars using TOON format for reduced token usage

## Setup

1. Install Rust toolchain using [rustup](https://rustup.rs/)
2. Install [Vercel CLI](https://vercel.com/docs/cli#installing-vercel-cli)

## Database Configuration

The cars API connects to a PostgreSQL database using environment variables:
- `POSTGRES_URL` or `DATABASE_URL` - Database connection string

For HTTP-based database access, you'll also need:
- `NEON_API_KEY` - Neon API key for authentication (get this from Neon console)

Vercel automatically sets the database URL when you add a PostgreSQL database to your project.

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

## TOON Format for Reduced Token Usage

The TOON API (`/api/toon/cars.rs`) uses the TOON format instead of JSON to reduce token usage by 30-60%. TOON is a compact data format that keeps structure like JSON but removes repeated keys, braces, quotes, and unnecessary punctuation.

See [TOON_FORMAT.md](TOON_FORMAT.md) for detailed information about:
- How TOON reduces token usage
- TOON syntax and examples
- Benefits for LLM applications

## HTTP-Based Database Access

For better scalability in serverless environments, we provide an HTTP-based version of the cars API (`cars_neon_http.rs`) that uses HTTP requests instead of TCP connections to communicate with the Neon database.

See [HTTP_DATABASE_ACCESS.md](HTTP_DATABASE_ACCESS.md) for detailed information about:
- Why HTTP-based database access is better for serverless
- How to implement HTTP-based database drivers
- Migration guide from TCP to HTTP
- Performance considerations

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

### HTTP-Based Alternative
For better serverless scalability without TCP connection issues, see `cars_neon_http.rs` which uses Neon's HTTP API.

### TOON Format Alternative
For reduced token usage in LLM applications, see `api/toon/cars.rs` which uses TOON format.

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

## Cars API with Neon HTTP (/api/cars_neon_http)

### Overview
This is an HTTP-based version of the cars API that uses Neon's HTTP API instead of direct TCP connections, eliminating connection pooling issues in serverless environments.

### Features
- Same functionality as the TCP-based version
- HTTP-based database access for better scalability
- No connection management overhead
- Works perfectly with serverless cold starts

### Required Environment Variables
- `NEON_API_KEY` - Your Neon API key (get from Neon console)

### Benefits
- Eliminates TCP connection issues
- Better performance during cold starts
- Higher concurrent request handling
- No database connection limits

## Cars API with TOON Format (/api/toon/cars)

### Overview
This is a TOON-based version of the cars API that uses the TOON format instead of JSON to reduce token usage by 30-60%. This is particularly useful for LLM applications where token usage directly impacts costs.

### Features
- Same functionality as the JSON-based version
- Uses TOON format for requests and responses
- Reduced token usage for LLM applications
- Plain text content type

### Benefits
- 30-60% reduction in token usage
- Lower costs for LLM applications
- Faster processing for large datasets
- Better performance in token-limited environments

### TOON Format Examples

**JSON:**
```json
{
  "cars": [
    {
      "brand": "Toyota",
      "model": "Camry",
      "year": 2015
    }
  ],
  "filters": {
    "brand": "Toyota",
    "model": null,
    "year": null
  }
}
```

**TOON:**
```
cars[1]{brand,model,year}:
  Toyota,Camry,2015
filters{brand,model,year}:
  Toyota,,
```

### Endpoints

#### GET /api/toon/cars
Returns all cars from the database with optional filtering in TOON format.

**Query Parameters:**
- `brand` - Filter by car brand (e.g., Toyota, Ford)
- `model` - Filter by car model (e.g., Camry, Mustang)
- `year` - Filter by manufacturing year (e.g., 2020, 2023)

**Examples:**
```bash
# Get all cars
curl -H "Accept: text/plain" https://your-domain.com/api/toon/cars

# Filter by brand
curl -H "Accept: text/plain" "https://your-domain.com/api/toon/cars?brand=Toyota"
```

#### POST /api/toon/cars
Creates a new car record in the database using TOON format.

**Request Body:**
```
brand: Tesla
model: Model 3
year: 2023
```

**Example:**
```bash
curl -X POST https://your-domain.com/api/toon/cars \
  -H "Content-Type: text/plain" \
  -d 'brand: Tesla
model: Model 3
year: 2023'
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

# Test the TOON cars API
curl -H "Accept: text/plain" http://localhost:3000/api/toon/cars
curl -X POST http://localhost:3000/api/toon/cars \
  -H "Content-Type: text/plain" \
  -d 'brand: Tesla
model: Model 3
year: 2023'
```

## Deployment Notes

- The Rust functions will be automatically compiled and deployed by Vercel
- Make sure to use the correct runtime version in `vercel.json`
- The target directory is ignored in both `.gitignore` and `.vercelignore`
- Database connections are handled automatically when deployed to Vercel
- Query parameters in curl commands must be quoted to prevent shell interpretation issues
- Next.js API routes take precedence over Rust functions at the same URL path
- For HTTP-based database access, set the `NEON_API_KEY` environment variable
- For TOON format APIs, use `Content-Type: text/plain` and `Accept: text/plain` headers