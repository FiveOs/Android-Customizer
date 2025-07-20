#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Building Android Kernel Customizer for Windows...\n');

// Step 1: Build the server
console.log('📦 Building server bundle...');
try {
  execSync('npx esbuild server/basic-server.ts --platform=node --bundle --format=cjs --outfile=dist/server/basic-server.js', { stdio: 'inherit' });
  console.log('✅ Server built successfully\n');
} catch (error) {
  console.error('❌ Server build failed:', error.message);
  process.exit(1);
}

// Step 2: Create icon if it doesn't exist
const iconPath = path.join(__dirname, '..', 'electron', 'assets', 'icon.ico');
if (!fs.existsSync(iconPath)) {
  console.log('🎨 Creating application icon...');
  // Create a simple SVG that will be converted to ICO
  const svgIcon = `<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
    <rect width="256" height="256" fill="#0f172a"/>
    <rect x="32" y="32" width="192" height="192" rx="32" fill="#10b981"/>
    <text x="128" y="140" text-anchor="middle" fill="white" font-family="Arial" font-size="48" font-weight="bold">AKC</text>
    <text x="128" y="180" text-anchor="middle" fill="#d1fae5" font-family="Arial" font-size="16">Kernel</text>
  </svg>`;
  
  fs.writeFileSync(iconPath.replace('.ico', '.svg'), svgIcon);
  console.log('✅ Icon created\n');
}

// Step 3: Build Electron app
console.log('🔨 Building Electron application...');
try {
  execSync('npx electron-builder --win --config electron-builder.json', { stdio: 'inherit' });
  console.log('✅ Electron build completed successfully!\n');
} catch (error) {
  console.error('❌ Electron build failed:', error.message);
  process.exit(1);
}

// Step 4: Show output information
console.log('🎉 Build completed successfully!');
console.log('\n📁 Output files:');
console.log('   📄 Installer: dist-electron/Android Kernel Customizer Setup.exe');
console.log('   📱 Portable: dist-electron/AndroidKernelCustomizer-Portable-1.0.0.exe');
console.log('\n🎯 Installation Options:');
console.log('   • NSIS Installer (.exe) - Full installation with Start Menu and Desktop shortcuts');
console.log('   • Portable (.exe) - Run directly without installation');
console.log('\n💡 System Requirements:');
console.log('   • Windows 10/11 (64-bit)');
console.log('   • WSL2 enabled');
console.log('   • 16GB+ RAM recommended');
console.log('   • 100GB+ free disk space');