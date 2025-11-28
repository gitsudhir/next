# ESP32 Sensor Control Panel

A Next.js application for controlling ESP32 devices through web-based sensors.

## Features

- **ESP32 Status Monitoring**: Monitor your ESP32 devices in real-time
- **Gyroscope Control**: Send device motion data from mobile devices to ESP32
- **Responsive Design**: Works on both desktop and mobile devices
- **Secure Deployment**: Ready for Vercel deployment with HTTPS support
- **Rust Serverless Functions**: High-performance backend APIs written in Rust

## Deployment to Vercel

1. Push this code to a GitHub repository
2. Connect the repository to Vercel
3. Deploy the application
4. Access via HTTPS to enable device sensors

## URLs After Deployment

- `/` - Main ESP32 status page
- `/esp32` - ESP32 control panel
- `/gyroscope` - Gyroscope control using various approaches
- `/gyroscope/proven-approach` - Proven DeviceOrientation/Motion API approach
- `/gyroscope/gyronorm-complete` - GyroNorm.js library approach
- `/gyroscope/diagnostics` - Sensor diagnostics tool
- `/api/*` - Rust serverless functions (see [RUST_FUNCTIONS.md](RUST_FUNCTIONS.md))

## Requirements

- Mobile device with gyroscope/accelerometer for sensor features
- Modern browser (Chrome, Safari, Firefox)
- ESP32 device running a web server

## Development

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

## Rust Serverless Functions

This project includes high-performance Rust-based serverless functions for Vercel. See [RUST_FUNCTIONS.md](RUST_FUNCTIONS.md) for detailed documentation on:

- Cars API with query parameter filtering
- ESP32 sensor data handlers
- Database connectivity with TLS encryption
- Local development and testing

## Deployment Commands

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Important Note About HTTPS

Device sensors (gyroscope, accelerometer) require a secure context to function properly in modern browsers. For local development, `localhost` is considered secure, but for remote access, you must use HTTPS. Deploying to Vercel automatically provides HTTPS, which is why it's the recommended deployment platform for the sensor features.