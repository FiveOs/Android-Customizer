# Quick Start Guide

Build your first custom Android kernel with NetHunter features in under 30 minutes.

## Prerequisites Check

Ensure you have:
- Windows 10/11 with WSL2 enabled
- Ubuntu 22.04 or Kali Linux installed in WSL
- 16GB+ RAM available
- 50GB+ free disk space

## 5-Minute Setup

### 1. Download and Extract
```bash
# Download release package
wget https://github.com/yourusername/android-kernel-customizer/releases/download/v1.0.0/android-kernel-customizer-v1.0.0.zip

# Extract files
unzip android-kernel-customizer-v1.0.0.zip
cd android-kernel-customizer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize Database
```bash
npm run db:push
```

### 4. Start Application
```bash
npm run dev
```

## First Kernel Build

### Step 1: Access Interface
Open browser to `http://localhost:5000`

### Step 2: Choose Device
Select from popular options:
- **OnePlus Nord** (recommended for beginners)
- **Nothing Phone (1)** (modern device)
- **OnePlus 7 Pro** (well-supported)

### Step 3: Basic Configuration
Enable essential features:
- ✅ WiFi Monitor Mode
- ✅ USB Gadget Support
- ✅ KernelSU (modern root)
- ✅ Basic NetHunter patches

### Step 4: Build Settings
Use recommended defaults:
- Compiler: GCC 12.3.0
- Optimization: O2
- Enable ccache: Yes

### Step 5: Start Build
Click "Start Build" and monitor progress.

## Expected Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| Setup | 2-5 min | WSL environment preparation |
| Clone | 5-10 min | Download kernel sources |
| Patches | 3-8 min | Apply NetHunter modifications |
| Build | 15-45 min | Compile kernel |
| Package | 2-5 min | Create flashable output |

## Output Files

Successful build creates:
- `boot.img` - Flashable kernel image
- `Image.gz-dtb` - Kernel with device tree
- `build.log` - Complete compilation log

## Next Steps

After your first successful build:
1. [Advanced Features](NetHunter-Features.md) - Add security tools
2. [Performance Tuning](Performance-Tuning.md) - Optimize settings
3. [Custom Devices](Custom-Device-Support.md) - Add new hardware

## Common Quick Fixes

**WSL Not Detected**
```bash
wsl --version
wsl --install -d Ubuntu-22.04
```

**Build Fails Quickly**
- Check available disk space: `df -h`
- Verify internet connection
- Restart WSL: `wsl --shutdown`

**Memory Issues**
- Close other applications
- Increase WSL memory allocation
- Disable unnecessary features

## Test Configuration

For fastest initial build, use this minimal setup:

```json
{
  "device": "oneplus_nord",
  "features": {
    "wifiMonitorMode": true,
    "usbGadget": true,
    "kernelSU": true
  },
  "skipOptions": {
    "skipBuild": false,
    "cleanOutput": true
  }
}
```

This completes in approximately 20-30 minutes on modern systems.