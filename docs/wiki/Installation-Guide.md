# Installation Guide

Complete setup instructions for Android Kernel Customizer on Windows with WSL2.

## System Requirements

### Windows Requirements
- Windows 10 version 2004+ or Windows 11
- 16GB RAM (32GB recommended for large builds)
- 100GB free disk space
- Administrator privileges for WSL setup

### WSL Requirements
- WSL2 enabled
- Ubuntu 22.04 LTS or Kali Linux distribution
- Internet connection for package downloads

## Step 1: Enable WSL2

### Option A: Automatic Installation (Windows 11)
```powershell
# Run as Administrator
wsl --install
```

### Option B: Manual Installation (Windows 10)
```powershell
# Enable WSL feature
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Enable Virtual Machine Platform
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Restart Windows
# Download and install WSL2 kernel update
# Set WSL2 as default
wsl --set-default-version 2
```

## Step 2: Install Linux Distribution

### Ubuntu 22.04 LTS (Recommended)
```powershell
wsl --install -d Ubuntu-22.04
```

### Kali Linux (For Security Research)
```powershell
wsl --install -d kali-linux
```

### First Setup
1. Create username and password
2. Update system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

## Step 3: Configure WSL Environment

### Install Build Dependencies
```bash
# Essential build tools
sudo apt install -y build-essential git curl wget

# Kernel build requirements
sudo apt install -y bc bison flex libssl-dev libelf-dev

# Cross-compilation tools
sudo apt install -y gcc-aarch64-linux-gnu gcc-arm-linux-gnueabihf

# Additional utilities
sudo apt install -y python3 python3-pip ccache
```

### Configure Git
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Optimize WSL Performance
Create `/etc/wsl.conf`:
```ini
[boot]
systemd=true

[user]
default=yourusername

[interop]
enabled=true
appendWindowsPath=true

[network]
generateHosts=true
generateResolvConf=true
```

## Step 4: Download Application

### Option A: Download Release
1. Visit GitHub releases page
2. Download latest `android-kernel-customizer-v1.0.0.zip`
3. Extract to desired location

### Option B: Clone Repository
```bash
git clone https://github.com/yourusername/android-kernel-customizer.git
cd android-kernel-customizer
```

## Step 5: Install Node.js Dependencies

### Install Node.js 20
```bash
# Install Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Install Application Dependencies
```bash
npm install
```

## Step 6: Database Setup

### Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
```

### Configure Database
```bash
# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database user
sudo -u postgres createuser --createdb --pwprompt kernel_user

# Create database
sudo -u postgres createdb -O kernel_user kernel_customizer
```

### Initialize Database Schema
```bash
npm run db:push
```

## Step 7: Environment Configuration

Create `.env` file:
```env
DATABASE_URL="postgresql://kernel_user:password@localhost:5432/kernel_customizer"
NODE_ENV=development
```

## Step 8: Start Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## Step 9: Verify Installation

1. Open browser to `http://localhost:5000`
2. Check WSL status indicator
3. Verify device library loads
4. Test configuration save/load

## Troubleshooting

### WSL Issues
```bash
# Check WSL version
wsl --version

# List installed distributions
wsl --list --verbose

# Restart WSL
wsl --shutdown
wsl
```

### Database Connection
```bash
# Test PostgreSQL connection
psql -h localhost -U kernel_user -d kernel_customizer

# Check database status
sudo systemctl status postgresql
```

### Node.js Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :5000

# Kill process using port
sudo fuser -k 5000/tcp
```

## Performance Optimization

### WSL Memory Allocation
Create `.wslconfig` in Windows user directory:
```ini
[wsl2]
memory=16GB
processors=8
swap=4GB
localhostForwarding=true
```

### Build Performance
```bash
# Configure ccache
export CCACHE_DIR=/home/$USER/.ccache
export CCACHE_MAX_SIZE=10G
ccache --set-config=max_size=10G
```

## Security Considerations

### File Permissions
```bash
# Set proper permissions
chmod 755 kernel_customizer.py
chmod 600 .env
```

### Firewall Configuration
```bash
# Allow local connections only
sudo ufw allow from 127.0.0.1 to any port 5000
```

## Next Steps

- [Quick Start Guide](Quick-Start.md) - Build your first kernel
- [How to Use](How-to-Use.md) - Detailed usage instructions
- [Device Selection](Device-Selection.md) - Choose your target device

## Support

For installation issues:
1. Check [Common Issues](Common-Issues.md)
2. Review [FAQ](FAQ.md)
3. Create GitHub issue with system details