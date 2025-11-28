#!/bin/bash

echo "Testing Cars API with Query Parameters"
echo "======================================"

# Test getting all cars
echo "1. Getting all cars:"
curl -s https://www.sudhirkumar.in/api/cars | jq '.cars | length' || echo "Failed to get all cars"

# Test filtering by brand
echo -e "\n2. Filtering by brand (Toyota):"
curl -s "https://www.sudhirkumar.in/api/cars?brand=Toyota" | jq '.cars | length' || echo "Failed to filter by brand"

# Test filtering by model
echo -e "\n3. Filtering by model (Camry):"
curl -s "https://www.sudhirkumar.in/api/cars?model=Camry" | jq '.cars | length' || echo "Failed to filter by model"

# Test filtering by year
echo -e "\n4. Filtering by year (2020):"
curl -s "https://www.sudhirkumar.in/api/cars?year=2020" | jq '.cars | length' || echo "Failed to filter by year"

# Test combining filters
echo -e "\n5. Combining filters (brand=Toyota&year=2020):"
curl -s "https://www.sudhirkumar.in/api/cars?brand=Toyota&year=2020" | jq '.cars | length' || echo "Failed to combine filters"

echo -e "\nTest completed!"