# Android Customizer - Compatibility Guide

**Last Updated:** July 21, 2025  
**Version:** v2.1.0 BETA  
**Author:** FiveO (https://github.com/FiveOs)  

## Comprehensive Compatibility Matrix

### 🔑 Root Solutions Compatibility

#### KernelSU
- **Supported Devices:** All devices with kernel sources available
- **Android Versions:** Android 5.0 - Android 14
- **LineageOS Support:** Full compatibility with LineageOS 17.1 - 21
- **NetHunter Compatibility:** ✅ Recommended for security research
- **Installation Method:** Integrated during kernel build
- **Official Repository:** https://github.com/tiann/KernelSU

#### Magisk
- **Supported Devices:** 100% device compatibility
- **Android Versions:** Android 5.0+ (API 21+)
- **LineageOS Support:** Full compatibility with all versions
- **NetHunter Compatibility:** ✅ Full support with modules
- **Installation Method:** Post-ROM flash or integrated
- **Official Repository:** https://github.com/topjohnwu/Magisk

#### SuperSU (Legacy)
- **Supported Devices:** Older devices (pre-2019)
- **Android Versions:** Android 2.3 - Android 10
- **LineageOS Support:** Limited to LineageOS 17.1 and below
- **NetHunter Compatibility:** ⚠️ Limited support
- **Installation Method:** ROM integration only

### 📱 ROM Compatibility

#### LineageOS Versions
| Version | Android Version | API Level | Device Support | Status |
|---------|-----------------|-----------|----------------|---------|
| **21** | Android 14 | API 34 | Latest devices | ✅ Stable |
| **20** | Android 13 | API 33 | 2021+ devices | ✅ Stable |
| **19.1** | Android 12.1 | API 32 | 2020+ devices | ✅ Stable |
| **18.1** | Android 11 | API 30 | 2018+ devices | ✅ Stable |

#### Device-Specific LineageOS Support
- **OnePlus Series:** Full support (OnePlus One to OnePlus 12)
- **Google Pixel/Nexus:** Complete coverage (all models)
- **Samsung Galaxy S:** S8 to S24 Ultra fully supported
- **Nothing Phone:** All models (1, 2, 2a) supported
- **Fairphone:** 2-5 with official LineageOS builds
- **Pine64:** PinePhone/Pro with mainline kernel support

### 🛡️ NetHunter Compatibility

#### Full NetHunter OS Support
Devices with complete NetHunter OS images:
- **OnePlus One** (bacon) - Android 7.1.2
- **OnePlus 7/7 Pro** - Android 10
- **OnePlus Nord** - Android 11
- **Nexus 5** (hammerhead) - Android 6.0.1
- **Nexus 6P** (angler) - Android 8.1
- **Google Pixel Series** - Via kernel injection

#### NetHunter Features by Device Class
| Feature | Flagship | Mid-Range | Budget | Notes |
|---------|----------|-----------|---------|--------|
| WiFi Injection | ✅ | ✅ | ⚠️ | Requires external adapter on some |
| HID Attacks | ✅ | ✅ | ✅ | All devices with OTG |
| BadUSB | ✅ | ✅ | ✅ | Kernel support required |
| Bluetooth Arsenal | ✅ | ⚠️ | ❌ | BT 4.0+ recommended |
| External WiFi | ✅ | ✅ | ✅ | RTL8812AU recommended |

### 🔧 Kernel Compatibility

#### Supported Kernel Versions
- **Linux 3.10+** - Legacy device support
- **Linux 4.4** - Stable, widespread support
- **Linux 4.9** - Recommended minimum
- **Linux 4.14** - Optimal for features
- **Linux 4.19+** - Latest devices
- **Linux 5.x** - Mainline kernel devices

#### Compiler Compatibility
| Compiler | Kernel Versions | Optimization | Notes |
|----------|-----------------|--------------|--------|
| **Clang 17** | 4.4+ | Excellent | Recommended |
| **Clang 16** | 4.4+ | Excellent | Stable |
| **GCC 12** | 3.10+ | Good | Traditional |
| **GCC 11** | 3.10+ | Good | Legacy support |

### 🔄 Cross-Feature Compatibility

#### GApps + Root Combinations
| Configuration | Compatibility | Notes |
|---------------|---------------|--------|
| **Pico GApps + Magisk** | ✅ Perfect | Most popular combo |
| **No GApps + KernelSU** | ✅ Perfect | Maximum privacy |
| **Full GApps + Magisk** | ✅ Works | Hide root from Google |
| **microG + KernelSU** | ✅ Excellent | FOSS alternative |

#### NetHunter + ROM Combinations
| ROM Type | NetHunter Support | Best Use Case |
|----------|-------------------|---------------|
| **LineageOS + NetHunter** | ✅ Full | Security research |
| **Stock ROM + NetHunter** | ⚠️ Limited | Device-dependent |
| **Custom Kernel Only** | ✅ Good | Advanced users |

### 📊 Hardware Requirements

#### Minimum System Requirements
- **RAM:** 3GB minimum, 4GB+ recommended
- **Storage:** 32GB minimum, 64GB+ for development
- **CPU:** Snapdragon 600+, Exynos 7000+, or equivalent
- **Android:** 7.0+ for full features

#### Build System Requirements
- **Host OS:** Windows 10/11 with WSL2
- **WSL RAM:** 8GB minimum, 16GB recommended
- **Disk Space:** 100GB for full builds
- **CPU:** 4+ cores recommended

### 🔗 Important Links

#### Official Resources
- **LineageOS Wiki:** https://wiki.lineageos.org/
- **Magisk Documentation:** https://topjohnwu.github.io/Magisk/
- **KernelSU Guide:** https://kernelsu.org/guide/what-is-kernelsu.html
- **NetHunter Docs:** https://www.kali.org/docs/nethunter/
- **XDA Thread:** https://forum.xda-developers.com/t/android-customizer-v2-1-0.xxxxxx

#### Community Support
- **GitHub Issues:** https://github.com/FiveOs/android-kernel-customizer/issues
- **Discord Server:** [Join our community](https://discord.gg/androidcustomizer)
- **Telegram Group:** https://t.me/androidcustomizer
- **Reddit:** r/AndroidCustomizer

### ⚠️ Important Compatibility Notes

1. **Treble Devices:** Full compatibility with Project Treble devices
2. **A/B Partitions:** Supported with proper slot management
3. **Encryption:** FBE (File-Based Encryption) fully supported
4. **SafetyNet:** Use Magisk Hide or Zygisk for banking apps
5. **Warranty:** Custom ROMs void warranty - proceed at own risk

### 🆘 Troubleshooting Common Issues

#### Boot Loops
- Ensure correct device codename selection
- Verify kernel matches ROM Android version
- Check GApps architecture compatibility

#### WiFi/Bluetooth Issues
- Flash correct vendor firmware
- Ensure kernel has proper driver support
- Check for device-specific patches

#### Root Detection
- Enable Magisk Hide for sensitive apps
- Use Work Profile for banking apps
- Consider microG for Google-free experience

---

**Document Version:** 1.0  
**Last Verified:** July 21, 2025  
**Maintainer:** FiveO (@FiveOs)