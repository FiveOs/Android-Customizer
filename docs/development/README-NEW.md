# Android Kernel Customizer

Android Kernel Customizer is a comprehensive tool for building custom Android kernels with NetHunter security patches and device-specific optimizations. This project brings professional kernel compilation to Windows users through an intuitive web interface.

**Developer**: FiveO ([GitHub](https://github.com/FiveOs))  
**Repository**: [https://github.com/FiveOs/android-kernel-customizer](https://github.com/FiveOs/android-kernel-customizer)  
**License**: MIT

## 🌟 Key Features

### Kernel Building
- **Web-based Interface**: User-friendly web application for kernel configuration and building
- **NetHunter Integration**: Full support for Kali NetHunter security patches and wireless drivers
- **40+ Devices Supported**: Pre-configured support for popular devices including OnePlus, Nothing Phone, Fairphone, and PinePhone
- **Real-time Build Progress**: WebSocket-based live updates during kernel compilation
- **Advanced Toolchain Support**: Multiple GCC/Clang versions with ccache and LTO optimizations
- **Windows WSL Integration**: Seamless integration with Windows Subsystem for Linux

### Android Device Tools
- **Direct Device Control**: Real-time ADB/Fastboot operations via TypeScript service
- **Live Kernel Tweaking**: Runtime CPU governor, I/O scheduler, and TCP congestion control
- **Recovery Management**: TWRP flashing and custom recovery operations
- **Magisk Integration**: Boot image patching, ZIP sideloading, and root management
- **Developer Mode Helper**: Smart assistant for enabling developer mode on any device state
- **Device Unbrick System**: Complete recovery solution for bricked devices with GSM Sources cable support

## 🖥️ System Requirements

- Windows 10/11 with WSL2 enabled
- Ubuntu 22.04 or Kali Linux in WSL
- 16GB RAM minimum (32GB recommended)
- 100GB+ free disk space
- Node.js 18+ and npm
- PostgreSQL database (or use in-memory storage for development)
- Active internet connection

## 🚀 Getting Started

### Prerequisites

1. **Install WSL2** (if not already installed):
   ```powershell
   wsl --install -d Ubuntu-22.04
   ```

2. **Install Node.js** (if not already installed):
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PostgreSQL** (optional, for persistent storage):
   ```bash
   sudo apt-get install postgresql postgresql-contrib
   ```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/FiveOs/android-kernel-customizer.git
   cd android-kernel-customizer
   ```

2. **Copy environment variables**:
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file** with your configuration:
   ```bash
   nano .env
   ```
   Update at minimum:
   - `DATABASE_URL` (if using PostgreSQL)
   - `SESSION_SECRET` (generate a secure random string)

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up database** (if using PostgreSQL):
   ```bash
   npm run db:push
   ```

6. **Start the application**:
   ```bash
   npm run dev
   ```

7. **Access the web interface**:
   Open your browser and navigate to `http://localhost:5000`

## 🏗️ Project Structure

```
android-kernel-customizer/
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions
├── server/              # Express backend server
│   ├── services/        # Business logic services
│   ├── routes.ts        # API route definitions
│   └── storage.ts       # Database abstraction layer
├── shared/              # Shared TypeScript types
│   └── schema.ts        # Database schema definitions
├── docs/                # Documentation files
├── tools/               # Build tools and scripts
└── output/              # Kernel build outputs
```

## 📖 Documentation

- [Full Documentation](docs/README.md)
- [API Documentation](docs/API.md)
- [Build Configuration Guide](docs/BUILD_CONFIG.md)
- [NetHunter Features Guide](docs/NETHUNTER.md)
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
- [Changelog](CHANGELOG.md)
- [Contributing Guidelines](CONTRIBUTING.md)

## 🔒 Security

This application implements several security measures:

- **Helmet.js**: Secure HTTP headers
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configured cross-origin resource sharing
- **Session Security**: Secure cookie configuration
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Parameterized queries via Drizzle ORM

For production deployment:
1. Use HTTPS with a valid SSL certificate
2. Set `NODE_ENV=production`
3. Use strong, unique `SESSION_SECRET`
4. Configure `ALLOWED_ORIGINS` appropriately
5. Enable database SSL connections

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Conventional commits for version control

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Areas

- Device support additions
- NetHunter patch updates
- UI/UX improvements
- Documentation enhancements
- Bug fixes and optimizations

## 📱 Supported Devices

### OnePlus Series
- OnePlus 6/6T (enchilada/fajita)
- OnePlus 7 Pro (guacamole)
- OnePlus 8/8 Pro (instantnoodle/instantnoodlep)
- OnePlus 9/9 Pro (lemonade/lemonadep)
- OnePlus 10 Pro (negroni)
- OnePlus 11 (salami)
- OnePlus Nord series

### Other Popular Devices
- Nothing Phone (1) & (2) (spacewar/pong)
- Fairphone 4 & 5 (FP4/FP5)
- PinePhone/PinePhone Pro
- Google Pixel series
- Xiaomi Poco series
- And many more...

## 🛡️ Security Features

- **Wireless Arsenal**: Monitor mode, packet injection, multiple chipset support
- **USB Arsenal**: HID attacks, BadUSB, mass storage emulation
- **Bluetooth Tools**: BT arsenal, spoofing, monitoring
- **NFC Support**: Card emulation, reader/writer mode
- **SDR Integration**: RTL-SDR, HackRF, USRP support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Credits

**Lead Developer**: FiveO
- GitHub: [https://github.com/FiveOs](https://github.com/FiveOs)
- Website: [netbriq.com](https://netbriq.com)

**Contributors**: See [CONTRIBUTORS.md](CONTRIBUTORS.md)

## 🙏 Acknowledgments

- Kali NetHunter team for security patches
- LineageOS for device trees and kernel sources
- Android kernel community for contributions
- XDA Developers community for testing and feedback

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/FiveOs/android-kernel-customizer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/FiveOs/android-kernel-customizer/discussions)
- **XDA Thread**: [XDA Developers Forum](https://forum.xda-developers.com/)

---

⭐ If you find this project useful, please consider giving it a star on GitHub!

🚀 **Happy Kernel Building!**