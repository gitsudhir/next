#!/bin/bash

echo "Testing Cars API Endpoints..."
echo "================================"

# Test getting all cars
echo "1. Testing GET /api/cars..."
response=$(curl -s https://www.sudhirkumar.in/api/cars)
echo "Response: $response"
echo ""

# Extract a car ID from the response for testing individual car endpoints
car_id=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
if [ -z "$car_id" ]; then
    car_id=1  # fallback to ID 1
fi

echo "Using car ID: $car_id for testing individual endpoints"
echo ""

# Test getting a specific car
echo "2. Testing GET /api/cars/$car_id..."
response=$(curl -s https://www.sudhirkumar.in/api/cars/$car_id)
echo "Response: $response"
echo ""

# Test creating a new car (this might fail if the endpoint isn't set up correctly)
echo "3. Testing POST /api/cars..."
response=$(curl -s -X POST https://www.sudhirkumar.in/api/cars \
  -H "Content-Type: application/json" \
  -d '{"brand": "TestBrand", "model": "TestModel", "year": 2025}')
echo "Response: $response"
echo ""

# Test updating a car (this might fail if the endpoint isn't set up correctly)
echo "4. Testing PUT /api/cars/$car_id..."
response=$(curl -s -X PUT https://www.sudhirkumar.in/api/cars/$car_id \
  -H "Content-Type: application/json" \
  -d '{"brand": "UpdatedBrand", "model": "UpdatedModel", "year": 2026}')
echo "Response: $response"
echo ""

# Test deleting a car (this might fail if the endpoint isn't set up correctly)
echo "5. Testing DELETE /api/cars/$car_id..."
response=$(curl -s -X DELETE https://www.sudhirkumar.in/api/cars/$car_id)
echo "Response: $response"
echo ""

echo "All tests completed!"