# Changelog

## v2.1.0 BETA - July 21, 2025

**Release Time:** 03:45 AM UTC  
**Author:** FiveO (https://github.com/FiveOs)  

### Major Changes
- **Platform Rebrand**: Android Kernel Customizer → Android Customizer
- **ROM Builder**: Complete LineageOS ROM building with GApps integration
- **Device Expansion**: 100+ devices with full manufacturer catalogs
- **Kernel Builder**: Fully functional NetHunter security kernel builder
- **Windows Application**: Native .exe installer and portable versions
- **APK Management**: Comprehensive APK upload and ROM integration
- **Real-time Progress**: WebSocket-based build monitoring

### Documentation Updates
- Complete compatibility guide with KernelSU, Magisk, LineageOS, NetHunter
- Updated XDA forum post template
- Comprehensive user guide with step-by-step instructions
- Fixed all hyperlinks and references
- Added release metadata (date, time, author)

### Technical Improvements
- Fixed device dropdown listings (100+ devices properly loaded)
- Removed "Coming Soon" placeholders - all features functional
- Enhanced error handling and validation
- Optimized build performance with ccache
- Improved WSL2 detection and setup - Android Customizer

All notable changes to Android Customizer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0-beta] - 2025-07-21

### 🚀 Major Changes
- **BREAKING**: Rebranded from "Android Kernel Customizer" to "Android Customizer"
- **NEW**: Complete platform expansion beyond just kernel building
- **NEW**: LineageOS ROM Builder with comprehensive customization
- **NEW**: APK Management System for custom app integration
- **NEW**: Windows Executable with professional installer

### 📱 Added - ROM Builder
- LineageOS support for versions 18.1, 19.1, 20, and 21 (Android 11-14)
- GApps variants from Pico (50MB) to Full (800MB) with detailed descriptions
- F-Droid, Aurora Store, and microG integration for privacy-focused builds
- Root solutions: Magisk, KernelSU, and SuperSU support
- Custom APK injection with drag-and-drop interface
- Advanced customization: boot animations, system sounds, fonts, themes
- Real-time build progress with WebSocket updates
- Build history tracking and management

### 📦 Added - APK Manager  
- Drag-and-drop APK upload interface
- Smart categorization (Essential, Productivity, Security, Development)
- Installation location control (system, privileged, user apps)
- Popular FOSS app integration (Signal, NewPipe, Bromite)
- APK analysis and permission review
- Integration with ROM builds

### 💻 Added - Windows Application
- Native Windows executable with professional NSIS installer
- Portable mode requiring no installation
- WSL2 automatic detection and setup guidance
- Start Menu and Desktop integration
- System requirements validation
- Professional about dialog and branding

### 🔧 Enhanced - Existing Features
- Expanded device support to 100+ devices (from 40+)
- Complete OnePlus lineup (One through 12 series)
- Full Google Pixel/Nexus series support
- Samsung Galaxy S8-S24 comprehensive support
- Nothing Phone, Fairphone, and Pine64 device support
- Enhanced NetHunter integration with complete wireless driver collection
- Improved TWRP customizer with additional themes and features

### 🎨 Changed - User Interface
- Professional developer-focused interface design
- Consistent NetHunter dark theme with emerald accents
- Removed animations for clean, distraction-free experience
- Unified sidebar navigation across all sections
- Enhanced component spacing and visual hierarchy
- Responsive layout optimized for desktop usage

### 🏗️ Changed - Architecture  
- Simplified Node.js HTTP server architecture
- Removed Express.js dependencies for lighter footprint
- Enhanced WebSocket integration for real-time updates
- Comprehensive REST API for all operations
- Mock storage system for development and testing
- TypeScript throughout frontend and backend

### 🐛 Fixed
- Dropdown overlapping issues with proper z-index handling
- Color contrast problems in NetHunter theme
- Navigation inconsistencies across application sections
- Build progress tracking and status updates
- Memory management for large build processes
- Error handling and user feedback systems

### 📚 Added - Documentation
- Complete user guide with step-by-step tutorials
- Comprehensive device compatibility matrix (100+ devices)
- Windows installation and setup guide
- ROM building walkthrough with screenshots
- APK management tutorial
- XDA thread update with new features
- GitHub README overhaul with professional presentation
- Wiki documentation update
- Video tutorial scripts and guides

### 🔐 Enhanced - Security
- Complete NetHunter OS support for compatible devices
- Wireless security driver collection (RTL8812AU, RT2800USB, ATH9K)
- Attack framework integration (BadUSB, HID, Bluetooth)
- Hardware security tool support (NFC, SDR, RF analysis)
- Privacy-focused build options with FOSS app integration
- Transparent, auditable build process

## [2.0.5] - 2025-07-20

### Added
- TWRP customizer interface with theme options
- Enhanced build progress tracking
- Device-specific build configurations

### Fixed
- Build environment setup issues
- UI component alignment problems
- Database connection stability

## [2.0.0] - 2025-07-18

### Added
- Complete project restructure and cleanup
- GitHub-style UI with authentic appearance
- NetHunter theme implementation
- Comprehensive device preset system (40+ devices)
- Professional database schema with PostgreSQL

### Changed
- Upgraded all dependencies to latest versions
- Fixed TypeScript configuration issues
- Improved error handling throughout application

## [1.5.0] - 2025-07-09

### Added
- Android CLI tool integration
- Device management system with ADB/Fastboot operations
- Comprehensive unbrick functionality
- Developer mode helper with smart device detection
- Real-time device control capabilities

## [1.0.0] - 2025-06-28

### Added
- Initial release of Android Kernel Customizer
- Basic kernel building functionality
- NetHunter security features
- Web-based interface
- WSL2 integration for Windows

---

## Upcoming Releases

### [2.2.0] - Planned Q3 2025
- Enhanced TWRP builder with advanced customization
- Cloud build system for remote compilation
- Device unbrick tools with GSM Sources cable support
- Live kernel manager for performance optimization

### [2.3.0] - Planned Q4 2025
- Custom ROM templates for quick builds
- Community sharing platform
- Mobile companion Android app
- Advanced security features and encryption

---

## Support

For questions, issues, or contributions:
- **GitHub Issues**: https://github.com/FiveOs/android-kernel-customizer/issues
- **Discussions**: https://github.com/FiveOs/android-kernel-customizer/discussions
- **Documentation**: See `/docs` directory in repository
- **Developer**: FiveO (@FiveOs on GitHub)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.