# Android Kernel Customizer v1.0.0

**Developed by FiveO (netbriq.com)** | [GitHub Repository](https://github.com/FiveOs/android-kernel-customizer)

## 📦 Release Package

Professional web-based Android kernel customization tool with comprehensive NetHunter features.

### Download Options

#### Option 1: Direct Download
- **Release Package**: `android-kernel-customizer-v1.0.0.zip`
- **Size**: ~50MB (excluding dependencies)
- **Includes**: Complete source code, documentation, setup scripts

#### Option 2: Clone Repository
```bash
git clone https://github.com/FiveOs/android-kernel-customizer.git
cd android-kernel-customizer
git checkout v1.0.0
```

## 🚀 Quick Installation

### Prerequisites
- Windows 10/11 with WSL2 enabled
- Ubuntu 22.04 or Kali Linux in WSL
- 16GB+ RAM (32GB recommended)
- 100GB+ free disk space

### One-Line Setup
```bash
curl -fsSL https://raw.githubusercontent.com/FiveOs/android-kernel-customizer/main/install.sh | bash
```

### Manual Installation
```bash
# 1. Extract release package
unzip android-kernel-customizer-v1.0.0.zip
cd android-kernel-customizer

# 2. Install dependencies
npm install

# 3. Setup database
npm run db:push

# 4. Start application
npm run dev
```

## ✨ What's Included

### Complete Device Library
- **40+ Supported Devices** across major manufacturers
- **OnePlus Series**: OnePlus One through OnePlus 12 Pro
- **Nothing Phone**: Phone (1), Phone (2), Phone (2a)
- **Fairphone**: Fairphone 3, 4, 5
- **PinePhone**: Original, Pro variants
- **LineageOS Integration**: Full custom ROM support

### NetHunter Security Arsenal
- WiFi monitor mode and packet injection
- Comprehensive wireless driver support
- BadUSB and HID attack frameworks
- Bluetooth arsenal tools
- NFC hacking capabilities
- SDR and RF analysis support

### Professional Build System
- GCC/Clang compiler selection
- Advanced optimization levels
- ccache integration for speed
- Kernel signing and verification
- Real-time build monitoring

### Root & Recovery Solutions
- KernelSU latest integration
- Magisk with Zygisk support
- TWRP custom recovery
- Security patch management

## 🎯 First Time Usage

### 1. Access Application
Open browser to `http://localhost:5000`

### 2. Check WSL Status
Verify WSL2 is properly configured and accessible

### 3. Select Device
Choose from the comprehensive device library:
- Browse by manufacturer
- Search by device name
- Filter by ROM compatibility

### 4. Configure Features
Enable desired NetHunter capabilities:
- Core features (WiFi monitor, USB gadget)
- Wireless drivers for your hardware
- Security research tools
- Root solutions

### 5. Build Configuration
Set compiler and optimization preferences:
- GCC 12.3.0 or Clang 15.0.0
- Optimization level (O2 recommended)
- Enable ccache for faster rebuilds

### 6. Start Build
Monitor real-time progress:
- WSL environment setup
- Repository cloning
- Patch application
- Kernel compilation

## 📊 Performance Expectations

### Build Times
- **Minimal Config**: 20-30 minutes
- **Standard NetHunter**: 45-60 minutes
- **Full Featured**: 60-90 minutes

### Resource Usage
- **Memory**: 4-8GB during compilation
- **Disk Space**: 10-30GB per build
- **Network**: 1-3GB initial downloads

## 🔧 Configuration Examples

### OnePlus Nord NetHunter Build
```json
{
  "device": "oneplus_nord",
  "features": {
    "wifiMonitorMode": true,
    "packetInjection": true,
    "badUSB": true,
    "kernelSU": true
  },
  "toolchain": {
    "compiler": "gcc",
    "optimizationLevel": "O2"
  }
}
```

### Security Research Configuration
```json
{
  "device": "nothing_phone_1",
  "features": {
    "bluetoothArsenal": true,
    "nfcHacking": true,
    "sdrSupport": true,
    "wirelessKeylogger": true
  },
  "security": {
    "kernelSigning": true,
    "securityPatches": "latest"
  }
}
```

## 📚 Documentation

### Essential Guides
- [Installation Guide](docs/wiki/Installation-Guide.md) - Complete setup
- [How to Use](docs/wiki/How-to-Use.md) - Step-by-step usage
- [Device Selection](docs/wiki/Device-Selection.md) - Choosing devices
- [NetHunter Features](docs/wiki/NetHunter-Features.md) - Security tools

### Advanced Topics
- [API Reference](docs/wiki/API-Reference.md) - Backend integration
- [Custom Devices](docs/wiki/Custom-Device-Support.md) - Adding devices
- [Troubleshooting](docs/wiki/Common-Issues.md) - Problem solving

## 🛠️ Troubleshooting

### Common Issues

**WSL Not Detected**
```bash
# Enable WSL2
wsl --install
# Restart Windows
```

**Build Failures**
```bash
# Check disk space
df -h
# Clear cache
npm cache clean --force
```

**Database Errors**
```bash
# Reset database
npm run db:push
```

### Getting Help
1. Check [FAQ](docs/wiki/FAQ.md)
2. Review [Common Issues](docs/wiki/Common-Issues.md)
3. Create GitHub issue with logs
4. Join community discussions

## 🔐 Security Notes

### Production Builds
- Always enable kernel signing
- Use latest security patches
- Verify build reproducibility
- Test thoroughly before deployment

### Development Environment
- Keep WSL updated
- Use secure Git credentials
- Backup working configurations
- Monitor build logs for errors

## 🚦 System Status

### Tested Environments
- ✅ Windows 11 22H2 with WSL2
- ✅ Windows 10 21H2 with WSL2
- ✅ Ubuntu 22.04 LTS in WSL
- ✅ Kali Linux 2023.4 in WSL

### Known Limitations
- WSL2 required for Windows builds
- Large memory requirements for complex builds
- Internet dependency for initial setup
- Build times vary by system performance

## 📈 What's Next

### v1.1.0 Planned Features
- Linux native support
- Additional device families
- Build queue management
- Performance optimizations

### v1.2.0 Roadmap
- Cloud build integration
- Advanced security analysis
- Collaborative configurations
- Mobile device support

## 🤝 Contributing

We welcome contributions:
- Device support for new models
- NetHunter feature additions
- Performance improvements
- Documentation updates

See [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

Released under MIT License - see [LICENSE](LICENSE) for details.

---

**Download, build, and customize your Android kernel with professional-grade tools.**

*For support, visit our [GitHub repository](https://github.com/FiveOs/android-kernel-customizer)*