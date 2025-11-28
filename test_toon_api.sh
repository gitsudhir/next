#!/bin/bash

echo "Testing TOON Cars API"
echo "===================="

# Test getting all cars in TOON format
echo "1. Getting all cars (TOON format):"
curl -s -H "Accept: text/plain" https://www.sudhirkumar.in/api/toon/cars

echo -e "\n\n2. Filtering by brand (TOON format):"
curl -s -H "Accept: text/plain" "https://www.sudhirkumar.in/api/toon/cars?brand=Toyota"

echo -e "\n\n3. Creating a new car with TOON format:"
curl -s -X POST https://www.sudhirkumar.in/api/toon/cars \
  -H "Content-Type: text/plain" \
  -d 'brand: TestBrand
model: TestModel
year: 2025'

echo -e "\n\nTest completed!"