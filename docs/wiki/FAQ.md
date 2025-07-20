# Frequently Asked Questions

## General Questions

### What is Android Kernel Customizer?
A professional web-based tool for building custom Android kernels with NetHunter security features. It provides an intuitive interface for kernel compilation without requiring command-line expertise.

### Which devices are supported?
Currently supports 40+ devices including:
- **OnePlus Series**: OnePlus One through OnePlus 12 Pro, complete Nord lineup
- **Google Pixel**: Pixel 4, 5, 6, 7, 8 series with GrapheneOS support
- **Samsung Galaxy**: S20, S21, S22, S23 series with Knox integration  
- **Nothing Phone**: Phone (1), Phone (2), Phone (2a) with optimizations
- **Fairphone**: Fairphone 3, 4, 5 with sustainable development focus
- **Pine64**: PinePhone, PinePhone Pro with PostmarketOS support
- **Xiaomi**: Redmi Note series, POCO phones with MIUI compatibility
- **LineageOS**: Complete database with custom ROM compatibility
- **NetHunter OS**: Special ROM packages for OnePlus One, 7 series, Nord

### Is this safe to use?
Yes, when used properly. The tool generates standard kernel builds that can be safely flashed. Always enable kernel signing for production use and test builds thoroughly.

## Installation & Setup

### What are the system requirements?
- Windows 10/11 with WSL2 enabled
- 16GB RAM minimum (32GB recommended)
- 100GB free disk space
- Internet connection for downloads

### Why do I need WSL?
WSL provides a Linux environment necessary for Android kernel compilation. The build tools and cross-compilers require Linux compatibility.

### Can I run this on Linux directly?
Currently designed for Windows with WSL. Native Linux support is planned for v1.1.0.

### How do I enable WSL2?
```bash
# Run as Administrator in PowerShell
wsl --install
# Restart Windows
# Install Ubuntu: wsl --install -d Ubuntu-22.04
```

## Build Process

### How long does a build take?
- Minimal configuration: 20-30 minutes
- Standard NetHunter: 45-60 minutes  
- Full-featured build: 60-90 minutes

### Why did my build fail?
Common causes:
- Insufficient disk space (need 50GB+)
- Network connectivity issues
- WSL environment problems
- Incompatible feature combinations

### Can I pause and resume builds?
No, builds must complete in one session. However, you can save configurations and restart builds later.

### What if I run out of disk space?
- Clear previous build outputs
- Increase WSL disk allocation
- Use external storage for output directory

## Features & Configuration

### What is NetHunter?
Kali NetHunter is a security research platform providing wireless testing tools, packet injection capabilities, and various attack frameworks for Android devices.

### Should I enable all features?
No, only enable features you need. More features increase build time and potential compatibility issues.

### What's the difference between KernelSU and Magisk?
- **KernelSU**: Modern kernel-level root solution with enhanced security
- **Magisk**: Traditional systemless root with extensive module ecosystem

### Can I add custom kernel configurations?
Yes, use the custom kernel configs section to add specific CONFIG options for your needs.

## Device Support

### My device isn't listed, can I add it?
Yes, you can add custom device support. See the [Custom Device Support](Custom-Device-Support.md) guide for instructions.

### How do I know which settings to use?
Start with the device preset, then check LineageOS or manufacturer documentation for specific requirements.

### Can I use this for custom ROMs?
Yes, the tool supports LineageOS and other custom ROM builds. Enable LineageOS compatibility in device configuration.

## Security & Safety

### Is kernel signing necessary?
For production use, yes. Kernel signing ensures boot integrity and is required for many modern devices.

### How do I backup my current kernel?
Before flashing:
```bash
# Boot to fastboot mode
fastboot boot twrp.img
# In TWRP, backup boot partition
```

### What if my device won't boot?
- Flash original kernel/ROM
- Use fastboot recovery mode
- Contact device community for specific recovery procedures

### Are there any warranty implications?
Yes, modifying kernels typically voids manufacturer warranties. Proceed at your own risk.

## Performance & Optimization

### How can I speed up builds?
- Enable ccache for incremental builds
- Use SSD storage
- Allocate more RAM to WSL
- Close unnecessary applications

### Which compiler should I use?
- **GCC**: More stable, better compatibility
- **Clang**: Faster builds, modern optimizations

### What optimization level is recommended?
- **O2**: Balanced performance and compatibility (recommended)
- **O3**: Maximum performance but may cause issues
- **Os**: Size optimization for space-constrained devices

## Troubleshooting

### "WSL not found" error
1. Verify WSL is installed: `wsl --version`
2. Check if distributions are available: `wsl --list`
3. Restart WSL service: `wsl --shutdown`

### Database connection errors
```bash
# Check PostgreSQL status
sudo systemctl status postgresql
# Restart if needed
sudo systemctl restart postgresql
```

### Node.js issues
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build process hangs
- Check available memory and disk space
- Restart WSL environment
- Reduce concurrent processes

### Permission denied errors
```bash
# Fix file permissions
chmod +x kernel_customizer.py
# Check WSL file system permissions
```

## Advanced Topics

### Can I modify the build script?
Yes, `kernel_customizer.py` can be customized for specific needs. Keep backups of working versions.

### How do I add new wireless drivers?
1. Add driver source to patches directory
2. Include in NetHunter feature configuration
3. Add corresponding kernel config options

### Can I build for multiple devices simultaneously?
Currently no, but build queue management is planned for v1.1.0.

### How do I contribute device support?
See [Contributing Guide](../CONTRIBUTING.md) for device submission process.

## API & Integration

### Is there an API for automation?
Yes, comprehensive REST API is available. See [API Reference](API-Reference.md) for documentation.

### Can I integrate with CI/CD?
Yes, the API supports automated builds. WebSocket connections provide real-time status updates.

### How do I export/import configurations?
Use the export/import buttons in the interface, or access configurations via `/api/kernel-configurations` endpoint.

## Getting Help

### Where can I get support?
1. Check this FAQ first
2. Review [Common Issues](Common-Issues.md)
3. Search GitHub issues
4. Create new issue with detailed information

### What information should I include in bug reports?
- Operating system and version
- WSL distribution and version
- Target device and configuration
- Complete error logs
- Steps to reproduce

### How do I request new features?
Create a GitHub issue with:
- Clear description of requested feature
- Use case explanation
- Expected behavior
- Any relevant examples or references

### Is there a community forum?
GitHub Discussions provides community support and feature discussions.

## Licensing & Legal

### What license is this released under?
MIT License - see LICENSE file for details.

### Can I use this commercially?
Yes, MIT license permits commercial use with proper attribution.

### Are there any export restrictions?
Check your local laws regarding security research tools and encryption software.

### What about NetHunter licensing?
NetHunter components maintain their original licenses. Ensure compliance with all applicable terms.

---

*Still have questions? Check our [troubleshooting guide](Common-Issues.md) or create an issue on GitHub.*