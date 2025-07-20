# Building Windows Executable (.exe) and Installer (.msi)

## Quick Build Commands

### 1. Build Server Bundle
```bash
npx esbuild server/basic-server.ts --platform=node --packages=external --bundle --format=cjs --outfile=dist/server/basic-server.js
```

### 2. Build Windows Executable
```bash
npx electron-builder --win --config electron-builder.json
```

### 3. Build All Formats (Portable + Installer)
```bash
npx electron-builder --win --config electron-builder.json
```

## Output Files

After building, you'll get these Windows installation options:

### 🎯 **NSIS Installer (.exe)**
- **File**: `dist-electron/Android Kernel Customizer Setup 1.0.0.exe`
- **Type**: Full Windows installer with uninstaller
- **Features**:
  - Start Menu shortcuts
  - Desktop shortcuts  
  - Add/Remove Programs entry
  - WSL2 detection and installation prompts
  - System requirements check
  - Professional installation wizard

### 📱 **Portable Executable (.exe)**
- **File**: `dist-electron/AndroidKernelCustomizer-Portable-1.0.0.exe`
- **Type**: Single executable file (no installation required)
- **Features**:
  - Run from any location
  - No registry changes
  - Perfect for USB drives
  - No admin rights required

## Windows System Requirements

✅ **Operating System**: Windows 10/11 (64-bit)
✅ **WSL2**: Windows Subsystem for Linux 2 enabled
✅ **RAM**: 16GB+ recommended (8GB minimum)
✅ **Storage**: 100GB+ free space for kernel sources
✅ **Network**: Internet connection for downloading toolchains

## Installation Features

### Automatic WSL2 Detection
The installer automatically:
- Checks if WSL2 is properly configured
- Prompts user to install WSL2 if missing
- Opens official Microsoft WSL2 installation guide
- Validates system requirements

### Smart System Checks
- RAM availability detection
- Disk space verification
- Windows version compatibility
- Architecture validation (x64 only)

### Professional Integration
- Windows Start Menu integration
- Desktop shortcuts with proper icons
- File associations for kernel configs
- Windows Defender exclusions prompts

## Build Process Details

1. **Server Bundling**: Node.js backend compiled into single executable
2. **Frontend Assets**: React app bundled with Vite
3. **Electron Packaging**: Native Windows app with system integration
4. **NSIS Installer**: Professional installer with custom logic
5. **Code Signing**: Ready for certificate-based signing

## Distribution Ready

Both output files are production-ready for:
- GitHub Releases distribution
- Direct download from website
- Enterprise deployment
- Software repositories

The executable includes all dependencies and runs completely self-contained on Windows systems with WSL2 enabled.