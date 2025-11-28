#!/bin/bash

# Test script for Rust functions

echo "Testing Rust functions..."

# Test the hello function
echo "Testing /api/hello..."
curl -s http://localhost:3000/api/hello
echo -e "\n"

# Test the ESP32 sensor function
echo "Testing /api/esp32_sensor..."
curl -s "http://localhost:3000/api/esp32_sensor?ip=192.168.1.23"
echo -e "\n"

# Test the send sensor data function
echo "Testing /api/send_sensor_data..."
curl -s -X POST "http://localhost:3000/api/send_sensor_data?ip=192.168.1.23" \
  -H "Content-Type: application/json" \
  -d '{"temperature": 23.5, "humidity": 65.2}'
echo -e "\n"

echo "All tests completed!"