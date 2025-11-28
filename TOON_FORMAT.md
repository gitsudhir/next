# TOON Format for Reduced Token Usage

TOON (Token-Optimized Object Notation) is a compact data format designed to reduce token usage by 30-60% when communicating with LLMs. It keeps structure like JSON but removes repeated keys, braces, quotes, and unnecessary punctuation.

## What is TOON?

TOON is a serialization format that provides the same structured data capabilities as JSON but with significantly reduced token usage. This makes it ideal for LLM applications where token usage directly impacts costs and performance.

## TOON Syntax

### Basic Objects
**JSON:**
```json
{
  "name": "Alice",
  "age": 30
}
```

**TOON:**
```
name: Alice
age: 30
```

### Arrays
**JSON:**
```json
{
  "users": [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25}
  ]
}
```

**TOON:**
```
users[2]{name,age}:
  Alice,30
  Bob,25
```

### Nested Objects
**JSON:**
```json
{
  "user": {
    "name": "Alice",
    "address": {
      "street": "123 Main St",
      "city": "New York"
    }
  }
}
```

**TOON:**
```
user{name,address{street,city}}:
  Alice,123 Main St,New York
```

## Benefits of TOON

### 1. Reduced Token Usage
- 30-60% fewer tokens compared to JSON
- Lower costs for LLM API calls
- Better performance within token limits

### 2. Improved LLM Performance
- Faster processing of large datasets
- More efficient context window usage
- Reduced parsing overhead

### 3. Backward Compatibility
- Lossless round-trip conversion to/from JSON
- Same data structure capabilities
- Easy migration from JSON

## Use Cases

### 1. LLM Function Calling
```bash
# Instead of JSON payload (100+ tokens):
{
  "function": "search_cars",
  "parameters": {
    "brand": "Toyota",
    "model": "Camry",
    "year": 2020
  }
}

# Use TOON (40+ tokens):
function: search_cars
parameters{brand,model,year}:
  Toyota,Camry,2020
```

### 2. Chat History Compression
```bash
# JSON chat history (verbose)
[
  {"role": "user", "content": "Hello"},
  {"role": "assistant", "content": "Hi there!"}
]

# TOON chat history (compact)
[2]{role,content}:
  user,Hello
  assistant,Hi there!
```

### 3. API Responses
```bash
# JSON response (many tokens)
{
  "cars": [
    {"brand": "Toyota", "model": "Camry", "year": 2015},
    {"brand": "Honda", "model": "Civic", "year": 2016}
  ]
}

# TOON response (fewer tokens)
cars[2]{brand,model,year}:
  Toyota,Camry,2015
  Honda,Civic,2016
```

## TOON Implementation in Rust

### Dependencies
Add to `Cargo.toml`:
```toml
[dependencies]
json2toon_rs = "0.2"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

### Basic Usage
```rust
use serde::{Serialize, Deserialize};
use json2toon_rs::{encode, decode, EncoderOptions, DecoderOptions};
use serde_json::json;

// Encoding to TOON
let data = json!({
    "users": [
        {"name": "Alice", "age": 30},
        {"name": "Bob", "age": 25}
    ]
});

let toon_string = encode(&data, &EncoderOptions::default());
println!("{}", toon_string);
// Output:
// users[2]{name,age}:
//   Alice,30
//   Bob,25

// Decoding from TOON
let decoded_json = decode(&toon_string, &DecoderOptions::default())?;
```

## API Development with TOON

### Faster responses with smaller payloads
TOON is perfect for:
- REST API responses
- GraphQL query results
- Webhook payloads
- Real-time data streaming

### Example Code (Rust/Vercel)
```rust
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};
use json2toon_rs::{encode, EncoderOptions};
use serde_json::json;

// API Response
pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    let users = get_users_from_db(); // Your database function
    
    // Convert to JSON value
    let json_value = serde_json::to_value(&users)?;
    
    // Encode to TOON format (50% smaller)
    let toon_response = encode(&json_value, &EncoderOptions::default());
    
    // Send TOON format response
    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "text/plain") // TOON uses plain text
        .body(toon_response.into())?)
    
    // Clients can easily decode:
    // const users = decodeToon(response);
}
```

### HTTP Headers
When using TOON format, use these standard headers:
- **Request**: `Content-Type: text/plain`
- **Response**: `Content-Type: text/plain`

### Example Request
```bash
curl -X POST https://api.example.com/toon/cars \
  -H "Content-Type: text/plain" \
  -d 'brand: Toyota
model: Camry
year: 2015'
```

### Example Response
```
cars[2]{brand,model,year}:
  Toyota,Camry,2015
  Honda,Civic,2016
filters{brand,model,year}:
  Toyota,,
```

## Working with Different Content Types

While `text/plain` is the most common content type for TOON, you can also use:

### Custom MIME Type
```rust
.header("Content-Type", "application/toon")
```

### Content Negotiation
```rust
// Check Accept header
let accept_header = req.headers().get("accept").and_then(|h| h.to_str().ok());
let content_type = if accept_header == Some("application/toon") {
    "application/toon"
} else {
    "text/plain"
};
```

## Best Practices

### 1. Schema Definition
Always define clear schemas for your TOON data structures to ensure consistency.

### 2. Error Handling
Provide clear error messages in TOON format for consistency:
```
error: Database connection failed
code: DB_CONNECTION_ERROR
```

### 3. Validation
Validate TOON input data before processing, just as you would with JSON.

### 4. Documentation
Clearly document your TOON API endpoints with examples:
```bash
# Get users
GET /api/toon/users
Accept: text/plain

# Response:
users[2]{id,name,email}:
  1,Alice,alice@example.com
  2,Bob,bob@example.com
```

## Migration from JSON

### 1. Gradual Migration
- Start with new endpoints using TOON
- Keep existing JSON endpoints for backward compatibility
- Migrate clients gradually

### 2. Dual Format Support
```rust
// Support both JSON and TOON based on Content-Type header
match content_type {
    "application/json" => parse_json(body),
    "text/plain" => parse_toon(body),
    _ => return error("Unsupported content type"),
}
```

## Performance Comparison

| Format | Tokens | Size Reduction | Use Case |
|--------|--------|----------------|----------|
| JSON   | 100%   | Baseline       | Standard APIs |
| TOON   | 40-70% | 30-60%         | LLM applications |

## Libraries

### Rust
- `json2toon_rs` - Full TOON v2.0 specification compliant implementation

### JavaScript/TypeScript
- `toon-js` - JavaScript implementation

### Python
- `toon-py` - Python implementation

## Conclusion

TOON provides an excellent solution for reducing token usage in LLM applications while maintaining full data structure capabilities. By eliminating redundant syntax and optimizing for compactness, TOON can significantly reduce costs and improve performance in token-sensitive applications.

For serverless environments like Vercel, TOON is particularly beneficial because:
1. Smaller payloads reduce bandwidth costs
2. Faster parsing improves cold start performance
3. Reduced token usage lowers LLM API costs
4. Compact format works well with edge computing limitations