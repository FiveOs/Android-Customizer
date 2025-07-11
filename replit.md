# Android Kernel Customizer

## Overview

Android Kernel Customizer is a comprehensive web-based tool for building custom Android kernels with NetHunter security patches and device-specific optimizations. The application provides an intuitive interface for kernel compilation, device management, and real-time build monitoring, designed specifically for Windows users with WSL2 integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for development and bundling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Framework**: Custom component library built on Radix UI primitives with Tailwind CSS
- **Real-time Communication**: WebSocket integration for live build progress updates

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with custom routing and middleware
- **Database ORM**: Drizzle ORM with Neon serverless PostgreSQL
- **Authentication**: Replit OpenID Connect integration with session management
- **Real-time**: WebSocket server for build progress and device communication
- **Process Management**: Child process spawning for kernel builds and Android tools

### Key Components

#### Build System
- **Kernel Builder Service**: Manages kernel compilation processes with Python script integration
- **Android Tool Service**: Handles ADB/Fastboot operations and device management
- **Real-time Progress**: WebSocket-based live updates during compilation
- **Configuration Management**: Comprehensive device and feature configuration system

#### Device Support
- **40+ Device Presets**: Pre-configured support for OnePlus, Nothing Phone, Fairphone, PinePhone
- **NetHunter Integration**: Full support for Kali NetHunter patches and wireless drivers
- **Custom Recovery**: TWRP and recovery management integration
- **Root Solutions**: KernelSU and Magisk integration support

#### Security Features
- **Kernel Signing**: Support for verified boot and custom signing keys
- **Security Patches**: Automated application of NetHunter security patches
- **Vulnerability Scanning**: Integration with security scanning tools

## Data Flow

1. **User Authentication**: Users authenticate via Replit OpenID Connect
2. **Configuration Creation**: Users create kernel configurations through the web interface
3. **Build Process**: Configurations are converted to Python scripts and executed via child processes
4. **Real-time Updates**: Build progress is streamed via WebSocket to the frontend
5. **Device Management**: Android tools communicate directly with connected devices
6. **Result Storage**: Build artifacts and logs are stored and made available for download

## External Dependencies

### Core Dependencies
- **Database**: Neon serverless PostgreSQL for production data storage
- **Authentication**: Replit OpenID Connect service
- **Build Tools**: Python kernel build scripts with WSL2 integration
- **Android SDK**: ADB and Fastboot tools for device communication

### Development Tools
- **Package Manager**: npm for dependency management
- **Build System**: Vite for frontend development and production builds
- **Code Quality**: TypeScript for type safety and better developer experience

### Infrastructure
- **WebSocket**: ws library for real-time communication
- **Session Storage**: PostgreSQL-backed session store
- **File System**: Node.js fs module for build artifact management

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Uses environment variable `DATABASE_URL` for database connection
- **Authentication**: Replit authentication integration for development

### Production Considerations
- **Build Process**: Static asset generation via Vite build
- **Database**: Neon serverless PostgreSQL with connection pooling
- **Session Management**: Secure session handling with PostgreSQL storage
- **Process Management**: Child process spawning for kernel builds
- **File Storage**: Local file system for build artifacts (consider cloud storage for scaling)

### Security Measures
- **Session Security**: HTTP-only cookies with CSRF protection
- **Database Security**: Parameterized queries via Drizzle ORM
- **Process Isolation**: Sandboxed execution of build processes
- **Authentication**: OAuth2/OpenID Connect via Replit

### Scalability Notes
- **WebSocket Connections**: Consider implementing connection pooling for multiple concurrent builds
- **Build Queue**: May need build queue management for high concurrency
- **Storage**: Consider cloud storage solutions for build artifacts in production
- **Database**: Neon provides automatic scaling for database connections