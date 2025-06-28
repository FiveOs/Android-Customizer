# Android Kernel Customizer

A comprehensive web-based interface for Android kernel customization on Windows using WSL. This tool provides an intuitive GUI wrapper around kernel compilation with advanced NetHunter features, device tree configuration, and professional build toolchain management.

## Features

### 🔧 Build Process & Toolchain
- GCC/Clang compiler selection with version control
- Advanced optimization levels (O2, O3, Os, Oz)
- ccache integration for faster builds
- Link Time Optimization (LTO) support
- Debug information control

### 📱 Device Library (40+ Devices)
- **OnePlus Series**: OnePlus One through OnePlus 12 Pro
- **Nothing Phone**: Phone (1), Phone (2), Phone (2a)
- **Fairphone**: Fairphone 3, 4, 5
- **PinePhone**: Original, Pro, with PostmarketOS support
- **LineageOS Integration**: Database with custom ROM compatibility

### 🛡️ Advanced NetHunter Features
- WiFi monitor mode and packet injection
- Wireless driver support (RTL8812AU, RT2800USB, etc.)
- BadUSB and HID attack capabilities
- Bluetooth arsenal tools
- NFC hacking support
- SDR and RF analysis tools

### 🔐 Security & Validation
- Kernel signing with custom certificates
- Security patch management
- Vulnerability scanning integration
- Reproducible build support
- Verified boot configuration

### ⚡ Performance Optimization
- CPU governor configuration
- Memory management (ZRAM, KSM)
- I/O scheduler optimization
- Thermal management controls

### 🔓 Root & Recovery Integration
- **KernelSU**: Latest version with manager app
- **Magisk**: Hide root, Zygisk, deny list
- **TWRP**: Custom recovery with themes and encryption

## Prerequisites

- Windows 10/11 with WSL2 enabled
- Ubuntu or Kali Linux distribution in WSL
- Node.js 18+ (installed automatically)
- PostgreSQL database (configured automatically)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/FiveOs/android-kernel-customizer.git
   cd android-kernel-customizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## Usage

### Device Configuration
1. Select your device from the comprehensive library
2. Choose between official firmware or LineageOS builds
3. Configure device-specific settings automatically

### Feature Selection
1. Enable NetHunter core features (WiFi monitor, USB gadget, HID)
2. Add wireless drivers for your hardware
3. Configure advanced security tools
4. Enable root solutions (KernelSU/Magisk)

### Build Configuration
1. Select compiler toolchain (GCC/Clang)
2. Set optimization levels and debug options
3. Configure output format and compression
4. Enable kernel signing for security

### Performance Tuning
1. Choose CPU governors for power management
2. Configure memory optimization settings
3. Set up thermal management
4. Optimize I/O schedulers

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Application pages
│   │   └── lib/           # Utilities and hooks
├── server/                # Express backend
│   ├── services/          # Business logic
│   └── routes.ts          # API endpoints
├── shared/                # Shared types and schemas
├── kernel_customizer.py   # Python kernel builder
└── package.json
```

## API Endpoints

### Kernel Configurations
- `GET /api/kernel-configurations` - List all configurations
- `POST /api/kernel-configurations` - Create new configuration
- `PUT /api/configurations/:id` - Update configuration
- `DELETE /api/configurations/:id` - Delete configuration

### Build Jobs
- `GET /api/build-jobs` - List all builds
- `POST /api/build-jobs` - Create build job
- `POST /api/builds/:id/start` - Start kernel build
- `POST /api/builds/:id/cancel` - Cancel running build

### WSL Integration
- `GET /api/wsl/status` - Check WSL availability
- WebSocket `/ws` - Real-time build updates

## Configuration Example

```json
{
  "name": "OnePlus Nord NetHunter Build",
  "device": "oneplus_nord",
  "features": {
    "wifiMonitorMode": true,
    "packetInjection": true,
    "badUSB": true,
    "kernelSU": true
  },
  "toolchainConfig": {
    "compiler": "gcc",
    "optimizationLevel": "O2",
    "enableLto": false
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, WebSockets
- **Database**: PostgreSQL with Drizzle ORM
- **Build System**: Vite, TSX
- **Kernel Builder**: Python with WSL integration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Kali NetHunter project for kernel patches
- OnePlus, Nothing, Fairphone communities for device support
- LineageOS project for custom ROM integration
- All contributors to the Android kernel ecosystem

## Support

For issues and questions:
1. Check the [Issues](https://github.com/FiveOs/android-kernel-customizer/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**⚠️ Disclaimer**: This tool is for educational and research purposes. Users are responsible for compliance with local laws and device warranties.