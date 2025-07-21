# Android Customizer v2.1.0 - Complete User Guide

## 🚀 Quick Start Guide

### What is Android Customizer?
Android Customizer is a complete Android development platform that lets you build custom LineageOS ROMs, NetHunter security kernels, TWRP recovery, and manage APK installations - all from a single web interface or Windows application.

### Choose Your Installation Method

#### Option 1: Web Application (Recommended)
```bash
git clone https://github.com/FiveOs/android-kernel-customizer.git
cd android-kernel-customizer
npm install
npm run dev
```
Access at: `http://localhost:5000`

#### Option 2: Windows Executable
1. Download from [GitHub Releases](https://github.com/FiveOs/android-kernel-customizer/releases)
2. Run `Android Customizer Setup.exe`
3. Follow installation wizard
4. Launch from Start Menu

---

## 📱 Building Your First Custom ROM

### Step 1: Device Selection
1. Navigate to **ROM Builder** from the main menu
2. Select your device from the dropdown (100+ supported devices)
3. Choose LineageOS version:
   - **LineageOS 21** (Android 14) - Recommended for newest features
   - **LineageOS 20** (Android 13) - Stable, mature support
   - **LineageOS 19.1** (Android 12.1) - Broad device compatibility
   - **LineageOS 18.1** (Android 11) - Legacy device support

### Step 2: Google Apps (GApps) Configuration
Choose your Google integration level:

| Variant | Size | What's Included | Best For |
|---------|------|-----------------|----------|
| **None** | 0MB | Pure LineageOS | Maximum privacy |
| **Pico** | 50MB | Play Store only | Minimal Google |
| **Nano** | 120MB | Gmail, Chrome, Play Store | Basic users |
| **Micro** | 200MB | + Maps, YouTube | Most users |
| **Mini** | 350MB | Standard Google suite | Full experience |
| **Full** | 800MB | Complete Google ecosystem | Google enthusiasts |

### Step 3: Privacy & Open Source Features
Enable privacy-focused alternatives:
- ✅ **F-Droid Store**: 3000+ open-source applications
- ✅ **Aurora Store**: Anonymous Google Play access
- ✅ **microG Services**: FOSS Google Play Services replacement
- ✅ **Magisk Root**: Systemless root with hide capabilities

### Step 4: Custom APK Integration
1. Click **"Drop APK files here"** in the Build Configuration section
2. Select multiple `.apk` files from your computer
3. APKs will be automatically integrated into your ROM build
4. Popular FOSS apps (NewPipe, Bromite, Signal) available as quick-add options

### Step 5: Build Execution
1. Give your ROM a custom name (optional)
2. Click **"Build Custom ROM"** button  
3. Monitor real-time progress with live logs
4. Download completed ROM when build finishes (typically 30-60 minutes)

---

## ⚙️ Custom Kernel Building

### NetHunter Security Kernel
Perfect for security research and penetration testing:

1. Navigate to **Kernel Builder**
2. Select your device and enable **NetHunter Mode**
3. Choose wireless drivers:
   - **RTL8812AU**: USB 802.11ac adapters
   - **RT2800USB**: Ralink wireless cards
   - **ATH9K**: Atheros chipsets
4. Select root solution:
   - **KernelSU**: Modern kernel-level root
   - **Magisk**: Traditional systemless root
5. Configure build optimization levels
6. Start build and monitor progress

### Standard Custom Kernel
For performance and customization:

1. Choose your device from supported list
2. Configure CPU governors and I/O schedulers
3. Enable custom boot logo/animation
4. Set compiler optimizations (GCC vs Clang)
5. Build and flash to your device

---

## 🛠️ TWRP Recovery Customization

### Theme Selection
- **Dark Theme**: Sleek black interface (recommended)
- **Light Theme**: Clean white interface  
- **Material Design**: Modern Google Design Language
- **Custom Colors**: Personalize accent colors

### Advanced Features
- **Encryption Support**: For encrypted device compatibility
- **MTP Support**: File transfer while in recovery
- **Custom Layouts**: Optimize for your screen size
- **Backup Solutions**: Full system backup capabilities

### Build Process
1. Select your device from TWRP-supported list
2. Choose theme and color scheme
3. Enable required features for your device
4. Build custom TWRP image
5. Flash using fastboot or existing recovery

---

## 📦 APK Management System

### Uploading APKs
1. Navigate to **APK Manager**
2. Drag and drop APK files into upload area
3. Choose installation location:
   - **System App** (`/system/app`): Basic system integration
   - **Privileged App** (`/system/priv-app`): Apps needing special permissions
   - **User App** (`/data/app`): Regular user applications
4. Select category for organization
5. APKs are ready for ROM integration

### Popular Open-Source Apps
Pre-configured options available:
- **Signal**: Encrypted messaging
- **NewPipe**: Privacy YouTube client  
- **Bromite**: Privacy-hardened browser
- **K-9 Mail**: Open-source email client
- **OsmAnd**: Offline maps and navigation

### APK Analysis
The system automatically:
- Validates APK integrity
- Analyzes required permissions
- Checks compatibility with target Android version
- Prevents integration of potentially harmful applications

---

## 💻 Windows Application Features

### Native Integration
- **Start Menu Shortcuts**: Professional Windows integration
- **Desktop Icons**: Quick access to Android Customizer
- **File Associations**: Open supported files directly
- **System Tray**: Background operation with status updates

### WSL2 Management
- **Automatic Detection**: Checks WSL2 installation status
- **Setup Guidance**: Step-by-step WSL2 installation
- **Distribution Management**: Ubuntu 22.04 or Kali Linux setup
- **Resource Allocation**: Optimal RAM and CPU configuration

### Portable Mode
- **No Installation Required**: Run from USB drive or network location
- **Enterprise Friendly**: Deploy across multiple machines
- **Isolated Environment**: No system modifications
- **Complete Functionality**: All features available in portable mode

---

## 🔧 System Requirements & Optimization

### Minimum Requirements
- **Operating System**: Windows 10/11 (64-bit)
- **Memory**: 16GB RAM
- **Storage**: 100GB free disk space
- **WSL2**: Enabled with Linux distribution
- **Network**: Stable internet connection

### Recommended Configuration
- **Memory**: 32GB RAM for optimal performance
- **Storage**: NVMe SSD with 200GB+ free space
- **Processor**: 8+ core CPU for parallel compilation
- **WSL2**: Ubuntu 22.04 or Kali Linux
- **Network**: Gigabit connection for faster downloads

### Performance Optimization
```bash
# WSL2 configuration optimization
echo '[wsl2]
memory=16GB
processors=8
swap=4GB
localhostForwarding=true' > ~/.wslconfig

# Build environment tuning
export USE_CCACHE=1
export CCACHE_DIR=~/.ccache
ccache -M 50G
```

---

## 📱 Device Compatibility Guide

### Flagship Tier (Full Feature Support)
- **OnePlus 7/7 Pro/7T series**: Complete NetHunter OS support
- **Google Pixel 3/4/5 series**: Excellent LineageOS integration  
- **Samsung Galaxy S9/S10 series**: Mature custom ROM support
- **Nothing Phone (2)**: Latest Android features with clean design

### Performance Tier (Great for Daily Use)
- **OnePlus 6/6T**: Proven custom ROM reliability
- **Google Pixel 2/XL**: Strong community development
- **Samsung Galaxy S8+**: Stable LineageOS builds
- **Fairphone 4/5**: Privacy-focused sustainable hardware

### Security Research Tier (NetHunter Focus)
- **OnePlus One**: Classic NetHunter OS with full tool support
- **OnePlus 5/5T**: Excellent wireless driver compatibility
- **Google Nexus 5X/6P**: Proven security research platform
- **Samsung Galaxy S7/S8**: Broad NetHunter tool compatibility

### Privacy Tier (FOSS-First)
- **Fairphone series**: Ethical hardware with strong privacy features
- **PinePhone Pro**: Ultimate privacy with hardware switches
- **LineageOS without GApps**: Any supported device with microG

---

## 🚨 Troubleshooting Guide

### Common Build Issues

#### "Device not found" Error
**Cause**: Device not in supported list or incorrect codename
**Solution**: 
1. Verify device in [Complete Device List](complete-device-list.md)
2. Check official LineageOS support
3. Ensure correct codename selection

#### WSL2 Installation Problems
**Cause**: Windows features not enabled or outdated kernel
**Solution**:
1. Enable "Windows Subsystem for Linux" in Windows Features
2. Download WSL2 kernel update from Microsoft
3. Set default version: `wsl --set-default-version 2`
4. Install Ubuntu 22.04: `wsl --install -d Ubuntu-22.04`

#### Build Failures
**Cause**: Insufficient resources or corrupted downloads
**Solution**:
1. Check available disk space (minimum 100GB)
2. Verify RAM allocation (16GB minimum)  
3. Clean build environment: `make clean && make clobber`
4. Re-download sources if corruption suspected

#### ROM Boot Issues
**Cause**: Incorrect device build or missing firmware
**Solution**:
1. Verify exact device model and codename
2. Flash correct vendor firmware version
3. Wipe data partition before flashing ROM
4. Use latest TWRP recovery for your device

### Build Environment Issues

#### Slow Build Performance
**Optimization Steps**:
1. Allocate more RAM to WSL2 (24GB+ recommended)
2. Use SSD storage for build directory
3. Enable build parallelization: `make -j$(nproc)`
4. Configure ccache for faster rebuilds

#### Network Download Failures  
**Solutions**:
1. Use stable wired internet connection
2. Configure download resume: `repo sync -c --force-sync`
3. Use local mirrors if available
4. Increase download timeout values

---

## 📊 Build Statistics & Monitoring

### Real-Time Progress Tracking
- **Download Phase**: Source code and dependencies (10-30 minutes)
- **Configuration**: Device setup and feature integration (5 minutes)
- **Compilation**: Main build process (30-90 minutes depending on hardware)
- **Packaging**: Creating flashable ZIP (5-10 minutes)

### Build Logs Analysis
Monitor logs for:
- **Warning Messages**: Usually safe to ignore
- **Error Messages**: Build stoppers requiring attention  
- **Progress Indicators**: Current build stage and completion percentage
- **Resource Usage**: RAM and disk space consumption

### Success Indicators
- **Clean Compilation**: No error messages in final build stages
- **Packaging Complete**: Flashable ZIP file created successfully
- **Size Validation**: ROM size appropriate for device storage
- **Checksum Verification**: File integrity confirmed

---

## 🎯 Advanced Features

### Custom Boot Animations
1. Upload boot animation ZIP file (bootanimation.zip format)
2. Animation automatically integrated during ROM build
3. Test on device after flashing for proper display
4. Create custom animations using animation studio tools

### System Sound Replacement
1. Upload sound files in OGG or MP3 format
2. Replace notification sounds, ringtones, alarm tones
3. System sounds automatically converted to appropriate format
4. Volume levels normalized for consistent experience

### Font Integration
1. Upload TTF or OTF font files  
2. Fonts installed to system font directory
3. Available in system font selection after ROM installation
4. Support for multiple language character sets

### Substratum Theme Support
1. Enable Substratum compatibility during build
2. Install theme engine for advanced customization
3. Support for icon packs, accent colors, system-wide theming
4. Compatible with popular theme collections

---

## 📖 Additional Resources

### Video Tutorials
- **Complete ROM Building Walkthrough**: 45-minute comprehensive guide
- **Windows Installation Tutorial**: Step-by-step desktop app setup
- **NetHunter Security Features**: Advanced kernel customization
- **APK Management Demonstration**: Custom app integration tutorial

### Community Resources
- **GitHub Repository**: Source code and issue tracking
- **XDA Developers Thread**: Community discussion and support
- **Reddit Community**: User experiences and tips
- **Discord Server**: Real-time chat and assistance

### Documentation Library
- [📋 Installation Guide](installation-guide.md)
- [🏗️ ROM Building Tutorial](rom-building-guide.md)
- [🔐 NetHunter Setup Guide](nethunter-setup-guide.md)
- [💻 Windows Executable Guide](windows-executable-guide.md)
- [📱 Device-Specific Instructions](devices/)

---

## 🤝 Getting Help

### Self-Help Resources
1. **Check Documentation**: Comprehensive guides for common tasks
2. **Search Issues**: GitHub issues for known problems
3. **Review Logs**: Build logs contain detailed error information  
4. **Test Environment**: Verify system requirements and setup

### Community Support
1. **GitHub Issues**: Report bugs and request features
2. **Discussion Forums**: General questions and experiences
3. **Video Tutorials**: Visual step-by-step instructions
4. **Community Wiki**: User-contributed guides and tips

### Professional Support
For enterprise deployments or custom development:
- **Custom Feature Development**: Tailored functionality
- **Training Services**: Team training and workshops
- **Deployment Assistance**: Large-scale installation support
- **Priority Support**: Dedicated technical assistance

---

*Android Customizer User Guide v2.1.0 - Making Android development accessible to everyone*

**Last Updated**: July 21, 2025  
**Support**: GitHub Issues and Community Forums  
**Developer**: FiveO (@FiveOs)