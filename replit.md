# Android Kernel Customizer

## Overview

Android Kernel Customizer is a comprehensive web-based tool for building custom Android kernels with NetHunter security features. Developed by FiveO (https://github.com/FiveOs), it provides an intuitive interface for kernel compilation on Windows using WSL, supporting 40+ devices and offering advanced security research capabilities.

## Project Information

- **Developer**: FiveO
- **GitHub Repository**: https://github.com/FiveOs/android-kernel-customizer
- **License**: MIT

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with dark theme support
- **State Management**: React hooks and TanStack Query for server state
- **Routing**: Wouter for client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript throughout
- **Build System**: Vite for frontend bundling, esbuild for backend
- **Session Management**: Express sessions with PostgreSQL storage
- **Real-time Communication**: WebSocket for build progress updates

### Build System Integration
- **Python Script**: `kernel_customizer.py` handles actual kernel compilation
- **WSL Integration**: Detects and utilizes Windows Subsystem for Linux
- **Compiler Support**: GCC and Clang with multiple versions
- **Optimization**: ccache integration and Link Time Optimization (LTO)

## Key Components

### Device Support System
- **Device Library**: 40+ preconfigured devices including OnePlus, Nothing Phone, Fairphone, PinePhone
- **Device Presets**: Stored in shared schema with codename, kernel repo, and specifications
- **LineageOS Integration**: Full custom ROM compatibility database

### NetHunter Features
- **Wireless Security**: WiFi monitor mode, packet injection, wireless drivers
- **Attack Frameworks**: BadUSB, HID support, Bluetooth arsenal
- **Hardware Support**: NFC hacking, SDR, RF analysis tools
- **Driver Collection**: RTL8812AU, RT2800USB, ATH9K, and more

### Root Solutions
- **KernelSU**: Latest kernel-level root with manager app integration
- **Magisk**: Full support with Zygisk, hide root, and deny list
- **TWRP**: Custom recovery with themes and encryption support

### Build Configuration
- **Toolchain Options**: Compiler selection, optimization levels, debug settings
- **Output Formats**: Boot image, kernel-only, modules, full package
- **Security Features**: Kernel signing, verified boot, security patches

## Data Flow

### Configuration Management
1. User selects device from preset library or custom configuration
2. Feature toggles configure NetHunter capabilities
3. Build options set compiler and optimization parameters
4. Configuration saved to PostgreSQL database

### Build Process
1. Configuration validated and Python config generated
2. Build job created in database with "pending" status
3. WebSocket connection established for real-time updates
4. Python script spawned with configuration parameters
5. Build progress streamed via WebSocket to frontend
6. Completed builds stored with logs and artifacts

### Real-time Updates
- WebSocket manager handles connection lifecycle
- Build progress updates sent to all connected clients
- Automatic reconnection with exponential backoff
- Build logs captured and stored for debugging

## External Dependencies

### Database
- **Primary**: PostgreSQL via Neon serverless
- **ORM**: Drizzle with TypeScript schema definitions
- **Sessions**: PostgreSQL session store for persistence

### Build Dependencies
- **WSL2**: Required for Linux kernel compilation environment
- **Python 3**: Kernel builder script execution
- **Git**: Repository cloning and patch management
- **Cross-compilation Tools**: GCC/Clang ARM64 toolchains

### Package Dependencies
- **Frontend**: React ecosystem, Radix UI, Tailwind CSS
- **Backend**: Express, WebSocket, session management
- **Shared**: Zod for schema validation, TypeScript types

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- tsx for TypeScript execution in development
- Database migrations via Drizzle Kit
- WSL integration for build testing

### Production Build
- Frontend built to static assets via Vite
- Backend bundled with esbuild for Node.js deployment
- PostgreSQL database with connection pooling
- Session persistence across restarts

### Platform Requirements
- Windows 10/11 with WSL2 enabled
- Ubuntu 22.04 or Kali Linux distribution
- 16GB+ RAM (32GB recommended)
- 100GB+ disk space for kernel sources and builds

## Changelog

- June 28, 2025: Initial setup with comprehensive kernel customization platform
- June 28, 2025: GitHub integration completed - connected to FiveO's account (https://github.com/FiveOs)
- June 28, 2025: Project rebranded to reflect developer identity and repository location

## User Preferences

- **Developer**: FiveO (GitHub: https://github.com/FiveOs)
- **Communication style**: Simple, everyday language
- **Repository**: https://github.com/FiveOs/android-kernel-customizer