const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let serverProcess;

// Server management
function startServer() {
  return new Promise((resolve, reject) => {
    const serverPath = path.join(__dirname, '..', 'dist', 'server', 'basic-server.js');
    serverProcess = spawn('node', [serverPath], {
      env: { ...process.env, PORT: '5000' },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    serverProcess.stdout.on('data', (data) => {
      console.log(`Server: ${data}`);
      if (data.toString().includes('running on port')) {
        resolve();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });

    serverProcess.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
    });

    // Timeout fallback
    setTimeout(resolve, 3000);
  });
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    minWidth: 1200,
    minHeight: 800,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    titleBarStyle: 'default',
    show: false
  });

  // Load the app
  const startUrl = isDev ? 'http://localhost:5000' : 'http://localhost:5000';
  
  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Focus on window
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'About Android Kernel Customizer',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About',
              message: 'Android Kernel Customizer v2.1.0',
              detail: 'Comprehensive Android kernel and recovery customization platform\n\nDeveloped by FiveO\nGitHub: https://github.com/FiveOs/android-kernel-customizer'
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Kernel Builder',
          click: () => mainWindow.loadURL('http://localhost:5000/kernel-builder')
        },
        {
          label: 'TWRP Customizer',
          click: () => mainWindow.loadURL('http://localhost:5000/twrp-customizer')
        },
        {
          label: 'Android Tool',
          click: () => mainWindow.loadURL('http://localhost:5000/android-tool')
        },
        {
          label: 'Build History',
          click: () => mainWindow.loadURL('http://localhost:5000/build-history')
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => shell.openExternal('https://github.com/FiveOs/android-kernel-customizer')
        },
        {
          label: 'Report Issue',
          click: () => shell.openExternal('https://github.com/FiveOs/android-kernel-customizer/issues')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(async () => {
  console.log('Starting Android Kernel Customizer...');
  
  // Start the server first
  try {
    await startServer();
    console.log('Server started successfully');
  } catch (error) {
    console.error('Failed to start server:', error);
  }
  
  // Create window and menu
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Kill server process
  if (serverProcess) {
    serverProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Cleanup server process
  if (serverProcess) {
    serverProcess.kill();
  }
});

// Security: Prevent navigation to external websites
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'http://localhost:5000') {
      event.preventDefault();
    }
  });
});