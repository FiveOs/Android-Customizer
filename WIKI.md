# Android Kernel Customizer - Complete Documentation

**Developed by FiveO** | [GitHub Repository](https://github.com/FiveOs/android-kernel-customizer) | [Website: netbriq.com](https://netbriq.com)

*Last Updated: July 09, 2025 - Historic Integration Release*

## Table of Contents

1. [Overview](#overview)
2. [Revolutionary Features (v2.0.0)](#revolutionary-features-v200)
3. [Installation Guide](#installation-guide)
4. [Complete Workflow](#complete-workflow)
5. [API Reference](#api-reference)
6. [Device Support](#device-support)
7. [Technical Architecture](#technical-architecture)
8. [Troubleshooting](#troubleshooting)
9. [Contributing](#contributing)

## Overview

Android Kernel Customizer has evolved from a simple kernel builder into a revolutionary platform that unifies the entire Android customization workflow. The historic v2.0.0 release introduces real-time device management, creating the industry's first web-based platform for complete Android customization.

### What's New in v2.0.0 (July 09, 2025)

**HISTORIC INTEGRATION**: We've unified FiveO's standalone Android CLI tool with the web platform, creating a seamless workflow from kernel compilation to live device management.

**Revolutionary Pipeline**: Kernel Building → Real-time Device Deployment → Live Management

## Revolutionary Features (v2.0.0)

### 🚀 Complete Android Customization Pipeline

#### Real-time Device Management
- **Live ADB/Fastboot Operations**: Execute device commands through web interface
- **Device Connectivity Monitoring**: Automatic detection and status updates
- **Hardware Diagnostics**: Complete device information extraction
- **Root Status Detection**: Automatic root and bootloader unlock detection

#### Recovery and Boot Management
- **TWRP Operations**: Direct custom recovery flashing with progress monitoring
- **Boot Image Management**: Extract, patch, and flash boot images seamlessly
- **Magisk Integration**: Boot image patching, ZIP sideloading, root management
- **Recovery Operations**: Complete custom recovery management suite

#### Live Kernel Tweaking (Industry First)
- **Runtime CPU Governor**: Change performance profiles without rebooting
- **I/O Scheduler Optimization**: Real-time storage performance tuning
- **TCP Congestion Control**: Network performance optimization
- **Thermal Management**: Live temperature and throttling control

#### Device Unbrick System (Revolutionary)
- **Automatic Brick Detection**: Identifies soft, hard, semi, and bootloop bricks
- **GSM Sources Cable Support**: Hardware-level recovery with 6 DIP switches
- **Multiple Recovery Modes**: EDL, Download, DSU, Recovery, Bootloader
- **Intelligent Recovery**: Automatic detection of best recovery method
- **Real-time Progress**: Live updates via WebSocket for all operations

### 🎯 Massive Device Support (40+ Devices)

#### OnePlus Series (15 devices)
- OnePlus One, 2, 3, 3T, 5, 5T, 6, 6T, 7, 7 Pro, 7T, 7T Pro, 8, 8 Pro, 9, 9 Pro, 10, 10 Pro, 11, 12, 12 Pro

#### Nothing Phone Series (3 devices)
- Nothing Phone (1), Phone (2), Phone (2a)

#### Fairphone Series (3 devices)
- Fairphone 3, 4, 5

#### PinePhone Series (2 devices)
- PinePhone Original, PinePhone Pro

#### LineageOS Integration (17+ variants)
- Complete custom ROM compatibility database
- Automatic device tree configuration
- Hardware-specific driver support

### 🛡️ Complete NetHunter Arsenal

#### Wireless Security Tools
- **WiFi Monitor Mode**: Complete 802.11 monitoring capabilities
- **Packet Injection**: Advanced wireless attack frameworks
- **Wireless Drivers**: RTL8812AU, RT2800USB, ATH9K, RTL88XXAU support
- **RF Analysis**: SDR integration for radio frequency research

#### Attack Frameworks
- **BadUSB**: Complete HID attack capabilities
- **Bluetooth Arsenal**: Comprehensive Bluetooth security tools
- **NFC Hacking**: Near Field Communication research tools
- **Wireless Keylogger**: Advanced keystroke capture

### 🔧 Professional Build System

#### Compiler Support
- **GCC Versions**: 9.4.0, 10.3.0, 11.2.0, 12.3.0
- **Clang Versions**: 12.0.1, 13.0.1, 14.0.6, 15.0.0
- **Optimization Levels**: O2, O3, Os, Oz with detailed explanations
- **Advanced Features**: LTO, ccache, debug information control

#### Build Management
- **Real-time Monitoring**: Live progress updates via WebSocket
- **Build Queuing**: Multiple builds with priority management
- **Error Handling**: Comprehensive error reporting and recovery
- **Artifact Management**: Automatic storage and organization

### 🔓 Modern Root Solutions

#### KernelSU Integration
- **Latest Version**: Automatic integration with newest KernelSU releases
- **Manager App**: Complete app installation and configuration
- **Security Features**: Enhanced security with kernel-level root
- **Module Support**: Comprehensive module management

#### Magisk Integration
- **Full Support**: Complete Magisk integration with all features
- **Zygisk**: Advanced hooking framework support
- **Hide Root**: Comprehensive root hiding capabilities
- **Deny List**: Advanced application root detection bypass

#### TWRP Support
- **Custom Recovery**: Complete TWRP integration and flashing
- **Themes**: Custom theme support and installation
- **Encryption**: Advanced encryption and decryption support
- **Backup Management**: Complete NANDroid backup solutions

## Installation Guide

### Prerequisites

#### Windows System Requirements
- Windows 10 version 2004+ or Windows 11
- WSL2 enabled and configured
- 16GB RAM minimum (32GB recommended)
- 100GB free disk space
- Internet connection for repository downloads

#### WSL2 Setup
```powershell
# Run as Administrator in PowerShell
wsl --install -d Ubuntu-22.04

# Alternative: Kali Linux for security research
wsl --install -d kali-linux
```

### Step-by-Step Installation

#### 1. Clone Repository
```bash
git clone https://github.com/FiveOs/android-kernel-customizer.git
cd android-kernel-customizer
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Database Setup
```bash
npm run db:push
```

#### 4. Start Development Server
```bash
npm run dev
```

#### 5. Access Web Interface
Open browser to `http://localhost:5000`

### Production Setup

#### Environment Variables
```bash
# Database configuration
DATABASE_URL="postgresql://user:password@localhost:5432/android_kernel_customizer"

# Session security
SESSION_SECRET="your-secure-session-secret"

# Build configuration
WSL_DISTRO="Ubuntu-22.04"
```

#### Process Management
```bash
# Using PM2 for production
npm install -g pm2
pm2 start npm --name "android-kernel-customizer" -- run start
```

## Complete Workflow

### Phase 1: Kernel Building

#### Device Selection
1. **Browse Device Library**: Choose from 40+ supported devices
2. **Device Information**: View specifications, kernel version, ROM support
3. **Custom Configuration**: Add unsupported devices with manual configuration

#### Feature Configuration
1. **NetHunter Core**: Enable monitor mode, packet injection, USB gadget
2. **Wireless Drivers**: Select hardware-specific drivers
3. **Security Tools**: Configure advanced security research tools
4. **Root Solutions**: Choose KernelSU, Magisk, or both

#### Build Configuration
1. **Compiler Selection**: Choose GCC or Clang with version
2. **Optimization**: Set performance, size, or debug optimization
3. **Output Format**: boot.img, kernel only, modules, or full package
4. **Advanced Options**: LTO, ccache, signing, verification

#### Build Process
1. **Configuration Validation**: Automatic validation and error checking
2. **WSL Environment**: Automatic setup and tool installation
3. **Real-time Monitoring**: Live progress updates and logging
4. **Completion**: Download results and build artifacts

### Phase 2: Device Deployment (NEW)

#### Device Connection
1. **Automatic Detection**: Real-time ADB/Fastboot device detection
2. **Connectivity Status**: Live connection monitoring and diagnostics
3. **Device Information**: Hardware specs, Android version, kernel version
4. **Bootloader Status**: Unlock status and security state

#### Boot Image Operations
1. **Flash Kernel**: Direct boot.img flashing with progress monitoring
2. **Boot Extraction**: Download current boot image from device
3. **Magisk Patching**: Automatic boot image patching with Magisk
4. **Verification**: Boot image integrity and signature verification

#### Recovery Management
1. **TWRP Flashing**: Direct custom recovery installation
2. **Recovery Operations**: Backup, restore, factory reset operations
3. **Custom Recovery**: Support for various recovery solutions
4. **Recovery Testing**: Automatic recovery functionality verification

### Phase 3: Live Device Management (NEW)

#### Performance Tuning
1. **CPU Governor**: Real-time performance profile changes
   - `schedutil`: Balanced performance and efficiency
   - `performance`: Maximum performance mode
   - `powersave`: Battery optimization mode
   - `ondemand`: Dynamic frequency scaling

2. **I/O Scheduler**: Storage performance optimization
   - `mq-deadline`: Multi-queue deadline scheduler
   - `kyber`: Low-latency I/O scheduler
   - `bfq`: Budget Fair Queueing scheduler
   - `none`: No-op scheduler for SSDs

3. **TCP Congestion Control**: Network optimization
   - `bbr`: Google's Bottleneck Bandwidth and RTT
   - `cubic`: Default TCP congestion control
   - `reno`: Classic TCP Reno algorithm

#### Root Management
1. **Magisk Operations**: Hide root, deny list, module management
2. **KernelSU Management**: Kernel-level root configuration
3. **Root Detection**: Bypass SafetyNet and other detection methods
4. **Module Management**: Install, configure, and manage root modules

#### System Monitoring
1. **Hardware Status**: Real-time temperature, voltage, frequency monitoring
2. **Performance Metrics**: CPU usage, memory consumption, I/O statistics
3. **Thermal Management**: Temperature limits and throttling configuration
4. **Battery Optimization**: Power consumption analysis and optimization

## API Reference

### Kernel Configuration Endpoints

#### `GET /api/kernel-configurations`
List all saved kernel configurations.

**Response:**
```json
{
  "configurations": [
    {
      "id": 1,
      "name": "OnePlus Nord NetHunter",
      "device": "oneplus_nord",
      "features": {
        "wifiMonitorMode": true,
        "packetInjection": true,
        "kernelSU": true
      },
      "createdAt": "2025-07-09T12:00:00Z"
    }
  ]
}
```

#### `POST /api/kernel-configurations`
Create new kernel configuration.

**Request:**
```json
{
  "name": "Custom Build",
  "device": "device_codename",
  "features": {
    "wifiMonitorMode": true,
    "badUSB": false
  },
  "toolchainConfig": {
    "compiler": "gcc",
    "optimizationLevel": "O2"
  }
}
```

### Build Job Endpoints

#### `POST /api/build-jobs`
Create and start new build job.

#### `GET /api/build-jobs/:id`
Get build job status and logs.

#### `POST /api/build-jobs/:id/cancel`
Cancel running build job.

### Android Device Tool Endpoints (NEW)

#### `GET /api/android-tool/device-info`
Get comprehensive device information.

**Response:**
```json
{
  "model": "OnePlus Nord",
  "androidVersion": "12",
  "buildId": "SKQ1.211103.001",
  "securityPatch": "2025-06-01",
  "kernelVersion": "4.19.191",
  "bootloader": "unlocked",
  "isRooted": true,
  "bootloaderUnlocked": true
}
```

#### `POST /api/android-tool/check-connectivity`
Check ADB/Fastboot device connectivity.

**Request:**
```json
{
  "mode": "adb"
}
```

#### `POST /api/android-tool/tweak-kernel`
Apply real-time kernel parameter changes.

**Request:**
```json
{
  "cpuGovernor": "performance",
  "ioScheduler": "mq-deadline",
  "tcpCongestion": "bbr"
}
```

#### `POST /api/android-tool/flash-recovery`
Flash custom recovery image.

**Request:**
```json
{
  "recoveryImagePath": "/path/to/twrp.img",
  "operationId": "unique-operation-id"
}
```

#### `POST /api/android-tool/patch-boot`
Patch boot image with Magisk.

**Request:**
```json
{
  "bootImagePath": "/path/to/boot.img",
  "magiskBootPath": "/path/to/magisk_boot.img",
  "operationId": "unique-operation-id"
}
```

### WebSocket Events

#### Build Progress Events
```json
{
  "type": "build_progress",
  "buildJobId": 123,
  "progress": 45,
  "currentStep": "Compiling kernel modules",
  "output": "CC [M] drivers/net/wireless/rtl8812au/..."
}
```

#### Device Operation Events
```json
{
  "type": "device_operation",
  "operationId": "unique-id",
  "status": "in_progress",
  "progress": 30,
  "message": "Flashing recovery image..."
}
```

## Device Support

### Adding New Devices

#### Device Configuration Structure
```json
{
  "codename": "device_codename",
  "name": "Device Display Name",
  "manufacturer": "Manufacturer Name",
  "kernelRepo": "https://github.com/manufacturer/kernel_repo",
  "kernelBranch": "android-12",
  "defconfig": "device_defconfig",
  "architecture": "arm64",
  "bootImageOffset": "0x00008000",
  "ramdiskOffset": "0x01000000",
  "tagsOffset": "0x00000100",
  "pageSize": 4096,
  "cmdline": "console=ttyMSM0,115200,n8 androidboot.console=ttyMSM0"
}
```

#### LineageOS Integration
- Automatic device tree detection
- Hardware abstraction layer support
- Custom ROM compatibility validation
- Vendor binary management

## Technical Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state
- **Real-time**: WebSocket integration for live updates

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript throughout
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Sessions**: PostgreSQL session store with secure cookies

### Build System
- **Kernel Builder**: Python script with WSL integration
- **Compiler Support**: GCC and Clang toolchains
- **Build Environment**: Automated WSL setup and configuration
- **Progress Monitoring**: Real-time WebSocket updates

### Device Management System (NEW)
- **ADB/Fastboot Integration**: Direct command execution
- **Process Management**: Long-running operation handling
- **Error Recovery**: Comprehensive error handling and recovery
- **Real-time Updates**: Live operation progress and status

## Troubleshooting

### Common Issues

#### WSL Not Detected
```bash
# Enable WSL in Windows Features
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Set WSL 2 as default
wsl --set-default-version 2
```

#### Build Failures
1. **Insufficient Disk Space**: Ensure 50GB+ free space
2. **Memory Issues**: Increase WSL memory allocation
3. **Network Timeouts**: Check internet connectivity
4. **Permission Errors**: Verify WSL user permissions

#### Device Connection Issues
1. **USB Debugging**: Enable developer options and USB debugging
2. **Driver Issues**: Install proper ADB/Fastboot drivers
3. **Cable Problems**: Use high-quality USB cables
4. **Authorization**: Accept ADB authorization on device

### Getting Support

#### Documentation Resources
- **GitHub Wiki**: [Complete documentation](https://github.com/FiveOs/android-kernel-customizer/wiki)
- **API Reference**: Comprehensive endpoint documentation
- **Troubleshooting Guide**: Common issues and solutions
- **Contributing Guide**: Development and contribution guidelines

#### Community Support
- **GitHub Issues**: [Report bugs and request features](https://github.com/FiveOs/android-kernel-customizer/issues)
- **Discussions**: Community support and discussions
- **XDA Forums**: Active community support and device additions

## Contributing

### Development Setup

#### Local Development
```bash
# Clone repository
git clone https://github.com/FiveOs/android-kernel-customizer.git
cd android-kernel-customizer

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Comprehensive linting rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

### Adding Device Support

#### Device Addition Process
1. **Research**: Gather device specifications and kernel information
2. **Configuration**: Create device configuration JSON
3. **Testing**: Test kernel building and flashing
4. **Documentation**: Add device to supported list
5. **Pull Request**: Submit changes for review

#### Required Information
- Device codename and display name
- Kernel repository and branch
- Boot image specifications
- Hardware-specific configurations

### Feature Development

#### Architecture Guidelines
- **Frontend**: React components with TypeScript
- **Backend**: Express routes with proper validation
- **Database**: Drizzle ORM with proper migrations
- **Real-time**: WebSocket integration for live updates

#### Testing Requirements
- **Unit Tests**: Comprehensive test coverage
- **Integration Tests**: End-to-end workflow testing
- **Device Testing**: Real device validation
- **Security Testing**: Vulnerability assessment

## License and Legal

### MIT License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Disclaimer
This tool is intended for security research, development, and educational purposes. Users are responsible for compliance with local laws and device warranties. Always backup your device before flashing custom kernels.

### Acknowledgments
- **Kali NetHunter Project**: Security research frameworks and patches
- **LineageOS Community**: Device compatibility databases and support
- **Android Kernel Community**: Open source kernel development
- **Device Communities**: OnePlus, Nothing, Fairphone user communities

---

**Transform your Android customization experience with the industry's first unified kernel building and device management platform.**

*Developed by FiveO | [GitHub](https://github.com/FiveOs) | [netbriq.com](https://netbriq.com)*