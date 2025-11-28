#!/bin/bash

# Test script for cars API

echo "Testing Cars API..."

# Test getting all cars
echo "Testing GET /api/cars..."
curl -s http://localhost:3000/api/cars
echo -e "\n"

# Test getting a specific car
echo "Testing GET /api/cars/1..."
curl -s http://localhost:3000/api/cars/1
echo -e "\n"

# Test creating a car
echo "Testing POST /api/cars..."
curl -s -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -d '{"brand": "Ford", "model": "Mustang", "year": 2023}'
echo -e "\n"

# Test updating a car
echo "Testing PUT /api/cars/1..."
curl -s -X PUT http://localhost:3000/api/cars/1 \
  -H "Content-Type: application/json" \
  -d '{"brand": "Chevrolet", "model": "Camaro", "year": 2022}'
echo -e "\n"

# Test deleting a car
echo "Testing DELETE /api/cars/1..."
curl -s -X DELETE http://localhost:3000/api/cars/1
echo -e "\n"

echo "All tests completed!"