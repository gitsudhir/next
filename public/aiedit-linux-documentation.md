# AIEdit for Linux

## Overview
AIEdit is a powerful Tauri-based application for Linux systems with advanced editing capabilities. Built with Rust for maximum performance and reliability.

## Installation Instructions

### Ubuntu/Debian Installation

Easily install AIEdit on your Linux system with our one-command installer.

**One-command installation:**
```bash
curl -fsSL https://sudhirkumar.in/linux/install.sh | sudo bash
```

This command will:
- Download the latest AIEdit package
- Install required dependencies (libwebkit2gtk-4.1-0, libgtk-3-0)
- Install AIEdit on your system

### Manual Installation

Alternatively, you can download and install manually:

1. Download the .deb file from:
   https://sudhirkumar.in/linux/aiedit_0.1.1_amd64.deb

2. Install dependencies:
   ```bash
   sudo apt-get update
   sudo apt-get install -y libwebkit2gtk-4.1-0 libgtk-3-0
   ```

3. Install the package:
   ```bash
   sudo dpkg -i aiedit_0.1.1_amd64.deb
   ```

## Features
- One-command installation
- Lightweight and fast
- Built with Rust for security and performance
- Tauri-based desktop application

## System Requirements
- Ubuntu/Debian Linux distribution
- AMD64 architecture
- Internet connection for installation

## Version Information
- Current Version: 0.1.1
- Architecture: AMD64

## Post-Installation
After installation, you can launch AIEdit by running:
```bash
aiedit
```

## Support
For issues or questions, please visit the project website or contact the developer.