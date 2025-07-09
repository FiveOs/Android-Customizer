# Android Kernel Customizer

**Developed by FiveO** | [GitHub Repository](https://github.com/FiveOs/android-kernel-customizer)

A revolutionary web-based platform that unifies Android kernel compilation with complete device management. This comprehensive tool transforms the entire Android customization workflow from kernel building to live device deployment, featuring real-time ADB/Fastboot operations, recovery management, and Magisk integration - all through an intuitive web interface designed for Windows platforms with WSL support.

*Latest Update: July 09, 2025 - Historic Integration of Android CLI Tool with Web Platform*

## Features

### 🚀 Complete Android Customization Pipeline (NEW - July 2025)
- **Unified Workflow**: Kernel compilation → Device deployment → Live management
- **Real-time Device Operations**: Live ADB/Fastboot operations via web interface
- **Recovery Management**: TWRP flashing, custom recovery operations
- **Magisk Integration**: Boot image patching, ZIP sideloading, root management
- **Live Kernel Tweaking**: Runtime CPU governor, I/O scheduler, TCP congestion control
- **Device Diagnostics**: Hardware information, root detection, bootloader status

### 🔧 Advanced Build System & Toolchain
- GCC/Clang compiler selection with version control
- Advanced optimization levels (O2, O3, Os, Oz)
- ccache integration for faster builds
- Link Time Optimization (LTO) support
- Debug information control
- WSL2 integration with automatic environment setup

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

## Complete Workflow (Updated July 2025)

### Phase 1: Kernel Building
1. **Device Configuration**: Select from 40+ supported devices
2. **NetHunter Features**: Enable security research tools and wireless drivers
3. **Build Configuration**: Choose toolchain, optimization, and output options
4. **Real-time Build**: Monitor progress with WebSocket updates
5. **Download Results**: Get compiled kernel, boot image, and modules

### Phase 2: Device Deployment (NEW)
6. **Device Connection**: Live ADB/Fastboot connectivity monitoring
7. **Boot Image Operations**: Flash custom kernels and recovery images
8. **Magisk Integration**: Patch boot images, sideload ZIP files
9. **Recovery Management**: Flash TWRP, manage custom recoveries

### Phase 3: Live Device Management (NEW)
10. **Kernel Tweaking**: Real-time CPU governor and I/O scheduler changes
11. **Performance Monitoring**: Live hardware diagnostics and status
12. **Root Management**: KernelSU and Magisk operations
13. **Device Optimization**: TCP congestion control and thermal management

### Traditional Usage (Still Supported)
- **Standalone Kernel Building**: Use just the kernel compilation features
- **Configuration Management**: Save and load build templates
- **Batch Operations**: Build multiple configurations sequentially

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

## API Endpoints (Updated July 2025)

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

### Android Device Tool (NEW)
- `GET /api/android-tool/device-info` - Get connected device information
- `POST /api/android-tool/check-connectivity` - Check ADB/Fastboot status
- `POST /api/android-tool/tweak-kernel` - Apply real-time kernel parameters
- `POST /api/android-tool/flash-recovery` - Flash custom recovery image
- `POST /api/android-tool/patch-boot` - Patch boot image with Magisk
- `POST /api/android-tool/sideload-magisk` - Sideload Magisk ZIP
- `POST /api/android-tool/dump-boot` - Extract boot image from device
- `POST /api/android-tool/cancel-operation` - Cancel running operation

### WSL Integration
- `GET /api/wsl/status` - Check WSL availability
- WebSocket `/ws` - Real-time build and device operation updates

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

## 📋 Release Information

- **Current Version**: v2.0.0 (July 09, 2025)
- **Historic Integration**: Android CLI Tool unified with web platform
- **Latest Features**: Real-time device management and live kernel tweaking
- **Documentation**: [Complete Wiki](WIKI.md) | [Release Notes](RELEASE.md) | [Changelog](CHANGELOG.md)

**⚠️ Disclaimer**: This tool is for educational and research purposes. Users are responsible for compliance with local laws and device warranties.

*Developed by FiveO | [GitHub](https://github.com/FiveOs) | [netbriq.com](https://netbriq.com)*