#!/bin/bash

echo "Testing Cars API Endpoints with Query Parameters..."
echo "==================================================="

# Test getting all cars
echo "1. Testing GET /api/cars (all cars)..."
response=$(curl -s https://www.sudhirkumar.in/api/cars)
echo "Response: $response"
echo ""

# Test filtering by brand
echo "2. Testing GET /api/cars?brand=Toyota..."
response=$(curl -s "https://www.sudhirkumar.in/api/cars?brand=Toyota")
echo "Response: $response"
echo ""

# Test filtering by model
echo "3. Testing GET /api/cars?model=Camry..."
response=$(curl -s "https://www.sudhirkumar.in/api/cars?model=Camry")
echo "Response: $response"
echo ""

# Test filtering by year
echo "4. Testing GET /api/cars?year=2020..."
response=$(curl -s "https://www.sudhirkumar.in/api/cars?year=2020")
echo "Response: $response"
echo ""

# Test combining filters
echo "5. Testing GET /api/cars?brand=Toyota&year=2020..."
response=$(curl -s "https://www.sudhirkumar.in/api/cars?brand=Toyota&year=2020")
echo "Response: $response"
echo ""

# Test creating a new car
echo "6. Testing POST /api/cars..."
response=$(curl -s -X POST https://www.sudhirkumar.in/api/cars \
  -H "Content-Type: application/json" \
  -d '{"brand": "TestBrand", "model": "TestModel", "year": 2025}')
echo "Response: $response"
echo ""

echo "All tests completed!"