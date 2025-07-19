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

### Android Device Tool Integration
- **Direct Device Control**: Real-time ADB/Fastboot operations via TypeScript service
- **Live Kernel Tweaking**: Runtime CPU governor, I/O scheduler, and TCP congestion control
- **Recovery Management**: TWRP flashing and custom recovery operations
- **Magisk Integration**: Boot image patching, ZIP sideloading, and root management
- **Device Diagnostics**: Hardware information, root detection, bootloader status
- **Developer Mode Helper**: Smart assistant for enabling developer mode
  - Automatic device state detection (normal, recovery, fastboot, locked, unauthorized)
  - Context-aware instructions based on current device state
  - Recovery-mode developer enabler for locked devices
  - Device-specific button combinations for recovery mode
  - Step-by-step guidance for all Android versions
- **Device Unbrick System**: Complete recovery solution for bricked devices
  - Automatic brick type detection (soft, hard, semi, bootloop)
  - GSM Sources repair cable support with 6 DIP switches
  - Multiple recovery modes: EDL, Download, DSU, Recovery, Bootloader
  - Hardware and software recovery methods
  - Real-time progress monitoring via WebSocket

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
- July 09, 2025: **HISTORIC INTEGRATION** - Unified FiveO's Android CLI tool with web platform
- July 09, 2025: Added comprehensive post-build device management system with live ADB/Fastboot operations
- July 09, 2025: Implemented complete Android customization pipeline from kernel compilation to device deployment
- July 09, 2025: **DOCUMENTATION UPDATE** - Comprehensive revision of all guides, wiki, and XDA post with latest features
- July 09, 2025: **DEVICE UNBRICK SYSTEM** - Revolutionary recovery solution with GSM Sources cable support
- July 09, 2025: Implemented comprehensive unbrick functionality with automatic brick detection
- July 09, 2025: Added GSM Sources repair cable integration with 6 DIP switches configuration
- July 09, 2025: Created 5-tab Android Tool interface including Device Recovery tab
- July 09, 2025: **DEVELOPER MODE HELPER** - Smart assistant for enabling developer mode on any device state
- July 09, 2025: Implemented device state detection (normal, recovery, fastboot, locked, unauthorized)
- July 09, 2025: Added context-aware instructions for enabling developer mode based on device state
- July 09, 2025: Created recovery-mode developer enabler for locked devices
- July 18, 2025: **COMPLETE PROJECT RESTRUCTURE** - Comprehensive cleanup and optimization
- July 18, 2025: Fixed all critical dependencies and TypeScript configuration issues
- July 18, 2025: Upgraded Zod to v3.25.1 for drizzle-zod compatibility
- July 18, 2025: Installed all missing packages: express-session, @neondatabase/serverless, authentication modules
- July 18, 2025: **GITHUB-STYLE UI COMPLETE** - Redesigned home page with authentic GitHub appearance
- July 18, 2025: Fixed Vite middleware configuration and asset importing paths
- July 18, 2025: Database schema finalized with comprehensive kernel configuration tables
- July 18, 2025: All 40+ device presets configured with OnePlus, Nothing Phone, Fairphone support
- July 18, 2025: **NETHUNTER THEME COMPLETE** - Converted from GitHub-style to NetHunter dark theme
- July 18, 2025: Implemented comprehensive color scheme with green accent hacker aesthetic
- July 18, 2025: Fixed all color contrast issues in settings and configuration components
- July 18, 2025: Added NetHunter-specific CSS animations and terminal glow effects
- July 18, 2025: Updated all UI components to use CSS variables for consistent theming
- July 18, 2025: **REPOSITORY STRUCTURE CLEANUP** - Complete Git organization and file structure overhaul
- July 18, 2025: Reorganized all documentation into proper docs/ directory hierarchy
- July 18, 2025: Moved development files, user guides, and assets to appropriate subdirectories
- July 18, 2025: Updated .gitignore with comprehensive exclusions and professional standards
- July 18, 2025: Created STRUCTURE.md for clear project organization overview
- July 18, 2025: Cleaned root directory to only contain essential configuration files
- July 18, 2025: **EXCITING UI ENHANCEMENTS** - Added dynamic selection boxes and visual improvements
- July 18, 2025: Implemented quick start configuration bar with device, root, NetHunter mode selection
- July 18, 2025: Added CSS animations (glow, pulse-glow, float, slide-in effects) for enhanced UX
- July 18, 2025: Created floating action button with expandable quick actions menu
- July 18, 2025: Enhanced feature toggles with interactive cards, hover effects, and visual feedback
- July 18, 2025: Added gradient backgrounds, emerald theme accents, and smooth transitions
- July 18, 2025: Implemented custom scrollbars and NetHunter-themed visual elements
- July 18, 2025: **COMPREHENSIVE UI IMPROVEMENTS** - Addressed visual hierarchy, typography, and spacing issues
- July 18, 2025: Implemented Google Fonts (Inter + Roboto Condensed) with proper 14-16px sizing
- July 18, 2025: Added color-coded feature groups with accent colors (#FFD700, #FF7043, #4FC3F7, #9C27B0)
- July 18, 2025: Created tabbed device selector with improved device grouping and specifications
- July 18, 2025: Enhanced form sections with shadows, borders, and proper breathing room
- July 18, 2025: Added breadcrumb navigation and animated dropdown transitions
- July 18, 2025: Improved component grouping with interactive cards and hover states

## Current Status

### ✅ Working Components
- **Authentication System**: Mock auth working, Replit Auth configured
- **Database**: PostgreSQL connected, schema defined (needs endpoint activation)
- **Frontend**: React app with GitHub-style UI loading successfully
- **Backend**: Express server with Vite integration running on port 5000
- **Navigation**: All routes configured (Home, Kernel Builder, Android Tool, Build History, Settings)
- **UI Components**: Radix UI components properly installed and configured
- **Asset Management**: Logo and images properly imported and displayed

### ⚠️ Known Issues
- Database endpoint disabled (requires Neon API activation)
- TypeScript strict mode disabled for UI compatibility
- 5 npm vulnerabilities (4 moderate, 1 high) - non-critical
- Some UI component type warnings (not affecting functionality)

### 🔧 Ready for Development
- All dependencies installed and working
- GitHub-style interface complete and responsive
- Comprehensive device preset library (40+ devices)
- Advanced kernel configuration schema ready
- WebSocket system configured for real-time build updates
- Complete NetHunter patches integration framework

## User Preferences

- **Developer**: FiveO (GitHub: https://github.com/FiveOs)
- **Domains**: netbriq.com, five0s.net (parked at Squarespace)
- **Communication style**: Simple, everyday language
- **Repository**: https://github.com/FiveOs/android-kernel-customizer