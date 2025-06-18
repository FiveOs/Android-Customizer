# How to Use Android Kernel Customizer

This comprehensive guide walks you through building your first custom Android kernel with NetHunter features.

## 🎯 Overview

The Android Kernel Customizer provides a web interface for building custom kernels with security research tools, wireless drivers, and performance optimizations. No command-line knowledge required.

## 📋 Prerequisites

- Windows 10/11 with WSL2 enabled
- Ubuntu 22.04 or Kali Linux in WSL
- 16GB+ RAM recommended
- 50GB+ free disk space

## 🚀 Step-by-Step Guide

### Step 1: Device Selection

1. **Open the application** at `http://localhost:5000`
2. **Choose your device** from the comprehensive library:
   - OnePlus series (One through 12 Pro)
   - Nothing Phone (1, 2, 2a)
   - Fairphone (3, 4, 5)
   - PinePhone variants
3. **Select ROM type**:
   - Stock firmware
   - LineageOS build
   - Custom configuration

![Device Selection Interface](../images/device-selection.png)

### Step 2: NetHunter Features Configuration

Configure security research tools and wireless capabilities:

#### Core Features
- ✅ **WiFi Monitor Mode** - Essential for packet capture
- ✅ **USB Gadget** - Enable USB attack capabilities  
- ✅ **HID Support** - Hardware input device attacks
- ✅ **Packet Injection** - Wireless security testing

#### Wireless Drivers
- **RTL8812AU** - Popular USB WiFi adapter
- **RT2800USB** - Ralink chipset support
- **ATH9K-HTC** - Atheros wireless cards

#### Advanced Tools
- **BadUSB** - USB attack framework
- **Bluetooth Arsenal** - Bluetooth security tools
- **NFC Hacking** - Near field communication attacks
- **SDR Support** - Software defined radio integration

### Step 3: Root Solution Selection

Choose your preferred root method:

#### KernelSU (Recommended)
- Modern kernel-level root solution
- Built-in manager application
- Enhanced security features
- Web UI for management

#### Magisk Integration
- Traditional systemless root
- Zygisk framework support
- Module ecosystem
- Hide root from apps

### Step 4: Build Configuration

#### Toolchain Settings
1. **Compiler Selection**:
   - GCC 12.3.0 (stable, recommended)
   - Clang 15.0.0 (modern, faster)

2. **Optimization Level**:
   - O2: Balanced performance/size
   - O3: Maximum performance
   - Os: Size optimization
   - Oz: Aggressive size reduction

3. **Advanced Options**:
   - Enable ccache for faster rebuilds
   - Link Time Optimization (LTO)
   - Debug information inclusion

#### Output Configuration
1. **Format Selection**:
   - boot.img (flashable image)
   - kernel_only (kernel binary)
   - kernel_modules (loadable modules)
   - full_package (complete build)

2. **Compression**:
   - gzip (universal compatibility)
   - lz4 (fast decompression)
   - xz (high compression)
   - zstd (balanced modern option)

### Step 5: Security Configuration

#### Kernel Signing
1. Enable kernel signing for verified boot
2. Provide signing key and certificate paths
3. Choose signature algorithm (SHA-256 recommended)

#### Security Patches
- Enable automatic security patching
- Select patch level (latest recommended)
- Add custom security patches if needed

### Step 6: Performance Optimization

#### CPU Management
1. **Governor Selection**:
   - schedutil (modern, adaptive)
   - ondemand (classic dynamic)
   - performance (maximum speed)
   - powersave (battery optimization)

2. **Custom Tuning**:
   - Set frequency scaling parameters
   - Configure thermal throttling
   - Adjust power management

#### Memory Optimization
1. **ZRAM Configuration**:
   - Enable compressed swap
   - Set size (1-2GB recommended)
   - Configure swappiness value

2. **Kernel Samepage Merging**:
   - Enable KSM for memory efficiency
   - Useful for virtualized environments

### Step 7: TWRP Integration

Configure custom recovery features:

1. **Theme Selection**:
   - portrait_hdpi (phones)
   - landscape_hdpi (tablets)
   - portrait_mdpi (older devices)

2. **Features**:
   - Enable encryption support
   - Touch screen compatibility
   - Custom flags and options

### Step 8: Build Execution

1. **Review Configuration**:
   - Check all selected features
   - Verify device compatibility
   - Review build settings

2. **Start Build Process**:
   - Click "Start Build"
   - Monitor real-time progress
   - View detailed logs

3. **Build Monitoring**:
   - WSL environment setup
   - Repository cloning
   - Patch application
   - Kernel compilation
   - Output generation

## 📊 Build Process Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| Environment Setup | 5-10 min | WSL tools installation |
| Repository Clone | 10-20 min | Kernel source download |
| Patch Application | 5-15 min | NetHunter patches |
| Configuration | 2-5 min | Kernel config generation |
| Compilation | 30-90 min | Main build process |
| Packaging | 5-10 min | Output file creation |

## 🎛️ Advanced Configuration

### Custom Kernel Configs
Add manual kernel configuration options:
```
CONFIG_PACKET=y
CONFIG_CFG80211_WEXT=y
CONFIG_USB_GADGET=y
CONFIG_KPROBES=y
```

### Device Tree Customization
- Configure device tree blob (DTB) paths
- Add custom device tree overlays
- Set hardware variant specifications
- Define board revision parameters

### Hardware Driver Configuration
- Camera sensor drivers
- Display panel configurations
- Audio codec settings
- Sensor framework setup

## 🔍 Monitoring and Debugging

### Real-time Progress
- WebSocket connection shows live updates
- Detailed build step information
- Error reporting and diagnostics
- Log file access

### Build Logs
Monitor compilation progress:
```
[INFO] Setting up WSL environment...
[INFO] Cloning kernel repository...
[INFO] Applying NetHunter patches...
[INFO] Configuring kernel build...
[INFO] Starting compilation...
[INFO] Build completed successfully!
```

## 📦 Output Files

Successful builds generate:
- `Image.gz-dtb` - Kernel with device tree
- `boot.img` - Flashable boot image
- `*.ko` - Kernel modules
- `build.log` - Complete build log
- `config` - Final kernel configuration

## 🔧 Troubleshooting

### Common Issues

1. **WSL Not Found**
   - Enable WSL2 in Windows features
   - Install Ubuntu or Kali Linux
   - Restart system after installation

2. **Build Failures**
   - Check available disk space (50GB+)
   - Verify internet connection
   - Review build logs for specific errors

3. **Missing Dependencies**
   - Update WSL distribution
   - Install build-essential package
   - Configure Git credentials

### Performance Tips

1. **Faster Builds**:
   - Enable ccache
   - Use SSD storage
   - Allocate more RAM to WSL

2. **Reliable Builds**:
   - Use stable compiler versions
   - Test with minimal feature set first
   - Backup working configurations

## 🎯 Best Practices

### Configuration Management
- Save successful configurations
- Export settings before modifications
- Use descriptive build names
- Document custom changes

### Security Considerations
- Use kernel signing for production
- Test builds thoroughly before deployment
- Keep security patches updated
- Verify build reproducibility

### Testing Strategy
1. Start with basic configuration
2. Add features incrementally
3. Test each build thoroughly
4. Document working combinations

## 📱 Device Flashing

After successful build:

1. **Boot into fastboot mode**
2. **Flash the kernel**:
   ```bash
   fastboot flash boot boot.img
   ```
3. **Reboot device**:
   ```bash
   fastboot reboot
   ```

## 🔗 Next Steps

- [Performance Tuning Guide](Performance-Tuning.md)
- [Advanced NetHunter Features](NetHunter-Features.md)
- [Custom Device Support](Custom-Device-Support.md)
- [API Integration](API-Reference.md)

---

*Need help? Check the [FAQ](FAQ.md) or create an issue on GitHub.*