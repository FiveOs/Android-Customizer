import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import bcrypt from "bcrypt";
import { storage } from "./storage";
// import { insertKernelConfigurationSchema, insertBuildJobSchema } from "@shared/schema";
import { KernelBuilderService } from "./services/kernel-builder";
import { AndroidToolService } from "./services/android-tool";
export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time build updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const kernelBuilder = new KernelBuilderService(wss);
  const androidTool = new AndroidToolService(wss);

  // Basic auth middleware
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.session?.userId) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  // Auth routes
  app.post('/api/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash password with bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const user = await storage.createUser({ username, password: hashedPassword });
      (req.session as any).userId = user.id;
      res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Compare password with bcrypt
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      (req.session as any).userId = user.id;
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/logout', (req, res) => {
    req.session?.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get('/api/user', async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Kernel Configuration routes
  app.get("/api/configurations", async (req, res) => {
    try {
      const configurations = await storage.getKernelConfigurations();
      res.json(configurations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch configurations" });
    }
  });

  app.get("/api/kernel-configurations", async (req, res) => {
    try {
      const configurations = await storage.getKernelConfigurations();
      res.json(configurations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch configurations" });
    }
  });

  app.get("/api/configurations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const configuration = await storage.getKernelConfiguration(id);
      if (!configuration) {
        return res.status(404).json({ message: "Configuration not found" });
      }
      res.json(configuration);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch configuration" });
    }
  });

  app.post("/api/configurations", async (req, res) => {
    try {
      // TODO: Add validation when drizzle-zod is available
      const configuration = await storage.createKernelConfiguration(req.body);
      res.status(201).json(configuration);
    } catch (error) {
      res.status(400).json({ message: "Invalid configuration data" });
    }
  });

  app.post("/api/kernel-configurations", async (req, res) => {
    try {
      // TODO: Add validation when drizzle-zod is available
      const configuration = await storage.createKernelConfiguration(req.body);
      res.status(201).json(configuration);
    } catch (error) {
      res.status(400).json({ message: "Invalid configuration data" });
    }
  });

  app.put("/api/configurations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // TODO: Add validation when drizzle-zod is available
      const configuration = await storage.updateKernelConfiguration(id, req.body);
      if (!configuration) {
        return res.status(404).json({ message: "Configuration not found" });
      }
      res.json(configuration);
    } catch (error) {
      res.status(400).json({ message: "Invalid configuration data" });
    }
  });

  app.delete("/api/configurations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteKernelConfiguration(id);
      if (!deleted) {
        return res.status(404).json({ message: "Configuration not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete configuration" });
    }
  });

  // Build Job routes
  app.get("/api/builds", async (req, res) => {
    try {
      const builds = await storage.getBuildJobs();
      res.json(builds);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch builds" });
    }
  });

  app.get("/api/build-jobs", async (req, res) => {
    try {
      const builds = await storage.getBuildJobs();
      res.json(builds);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch builds" });
    }
  });

  app.get("/api/builds/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const build = await storage.getBuildJob(id);
      if (!build) {
        return res.status(404).json({ message: "Build not found" });
      }
      res.json(build);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch build" });
    }
  });

  app.post("/api/builds", async (req, res) => {
    try {
      // TODO: Add validation when drizzle-zod is available
      const build = await storage.createBuildJob(req.body);
      res.status(201).json(build);
    } catch (error) {
      res.status(400).json({ message: "Invalid build data" });
    }
  });

  app.post("/api/build-jobs", async (req, res) => {
    try {
      const validatedData = insertBuildJobSchema.parse(req.body);
      const build = await storage.createBuildJob(validatedData);
      res.status(201).json(build);
    } catch (error) {
      res.status(400).json({ message: "Invalid build data" });
    }
  });

  // Start a kernel build
  app.post("/api/builds/:id/start", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const build = await storage.getBuildJob(id);
      if (!build) {
        return res.status(404).json({ message: "Build not found" });
      }

      const configuration = await storage.getKernelConfiguration(build.configurationId);
      if (!configuration) {
        return res.status(404).json({ message: "Configuration not found" });
      }

      await kernelBuilder.startBuild(build, configuration);
      res.json({ message: "Build started" });
    } catch (error) {
      res.status(500).json({ message: "Failed to start build" });
    }
  });

  // Cancel a kernel build
  app.post("/api/builds/:id/cancel", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await kernelBuilder.cancelBuild(id);
      res.json({ message: "Build cancelled" });
    } catch (error) {
      res.status(500).json({ message: "Failed to cancel build" });
    }
  });

  // Export configuration as JSON
  app.get("/api/configurations/:id/export", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const configuration = await storage.getKernelConfiguration(id);
      if (!configuration) {
        return res.status(404).json({ message: "Configuration not found" });
      }

      // Convert to Python script format
      const pythonConfig = {
        device: configuration.device,
        codename: configuration.codename,
        kernel_repo: configuration.kernelRepo,
        kernel_branch: configuration.kernelBranch,
        nethunter_patches_repo: configuration.nethunterPatchesRepo,
        nethunter_patches_branch: configuration.nethunterPatchesBranch,
        nethunter_patches_dir_relative: configuration.nethunterPatchesDirRelative,
        git_patch_level: configuration.gitPatchLevel,
        output_dir: configuration.outputDir,
        defconfig_filename_template: configuration.defconfigFilenameTemplate,
        kernel_arch: configuration.kernelArch,
        kernel_cross_compile: configuration.kernelCrossCompile,
        kernel_image_name_patterns: configuration.kernelImageNamePatterns,
        features: {
          wifi_monitor_mode: configuration.features.wifiMonitorMode,
          usb_gadget: configuration.features.usbGadget,
          hid_support: configuration.features.hidSupport,
          rtl8812au_driver: configuration.features.rtl8812auDriver,
        },
        custom_kernel_configs: configuration.customKernelConfigs,
        wsl_distro_name: configuration.wslDistroName,
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${configuration.name}_config.json"`);
      res.json(pythonConfig);
    } catch (error) {
      res.status(500).json({ message: "Failed to export configuration" });
    }
  });

  // WSL environment check
  app.get("/api/wsl/status", async (req, res) => {
    try {
      const status = await kernelBuilder.checkWSLStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to check WSL status" });
    }
  });

  // Android Tool API routes
  
  // Check device connectivity
  app.get("/api/android/device/connectivity", async (req, res) => {
    try {
      const mode = req.query.mode as "adb" | "fastboot" || "adb";
      const connected = await androidTool.checkDeviceConnectivity(mode);
      res.json({ connected, mode });
    } catch (error) {
      res.status(500).json({ message: "Failed to check device connectivity" });
    }
  });

  // Get device information
  app.get("/api/android/device/info", async (req, res) => {
    try {
      const deviceInfo = await androidTool.getDeviceInfo();
      if (!deviceInfo) {
        return res.status(404).json({ message: "No device found" });
      }
      res.json(deviceInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to get device info" });
    }
  });

  // Tweak kernel parameters
  app.post("/api/android/kernel/tweak", async (req, res) => {
    try {
      const { cpuGovernor, ioScheduler, tcpCongestion } = req.body;
      const operationId = `tweak_${Date.now()}`;
      
      const success = await androidTool.tweakKernel({
        cpuGovernor,
        ioScheduler,
        tcpCongestion
      }, operationId);
      
      res.json({ success, operationId });
    } catch (error) {
      res.status(500).json({ message: "Failed to tweak kernel" });
    }
  });

  // Flash recovery image
  app.post("/api/android/recovery/flash", async (req, res) => {
    try {
      const { recoveryImagePath } = req.body;
      const operationId = `flash_recovery_${Date.now()}`;
      
      const success = await androidTool.flashRecovery(recoveryImagePath, operationId);
      res.json({ success, operationId });
    } catch (error) {
      res.status(500).json({ message: "Failed to flash recovery" });
    }
  });

  // Patch boot image with Magisk
  app.post("/api/android/boot/patch", async (req, res) => {
    try {
      const { bootImagePath, magiskBootPath } = req.body;
      const operationId = `patch_boot_${Date.now()}`;
      
      const patchedImagePath = await androidTool.patchBootImage(
        bootImagePath, 
        magiskBootPath, 
        operationId
      );
      
      res.json({ 
        success: !!patchedImagePath, 
        patchedImagePath,
        operationId 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to patch boot image" });
    }
  });

  // Sideload Magisk ZIP
  app.post("/api/android/magisk/sideload", async (req, res) => {
    try {
      const { magiskZipPath } = req.body;
      const operationId = `sideload_magisk_${Date.now()}`;
      
      const success = await androidTool.sideloadMagisk(magiskZipPath, operationId);
      res.json({ success, operationId });
    } catch (error) {
      res.status(500).json({ message: "Failed to sideload Magisk" });
    }
  });

  // Dump boot image from device
  app.post("/api/android/boot/dump", async (req, res) => {
    try {
      const operationId = `dump_boot_${Date.now()}`;
      const bootImagePath = await androidTool.dumpBootImage(operationId);
      
      res.json({ 
        success: !!bootImagePath, 
        bootImagePath,
        operationId 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to dump boot image" });
    }
  });

  // Cancel Android Tool operation
  app.post("/api/android/operations/:operationId/cancel", async (req, res) => {
    try {
      const operationId = req.params.operationId;
      const success = androidTool.cancelOperation(operationId);
      res.json({ success, message: success ? "Operation cancelled" : "Operation not found" });
    } catch (error) {
      res.status(500).json({ message: "Failed to cancel operation" });
    }
  });

  // Developer mode helpers
  app.post("/api/android/developer-mode/check", async (req, res) => {
    try {
      const operationId = `dev_check_${Date.now()}`;
      const result = await androidTool.checkAndSuggestDeveloperMode(operationId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to check developer mode status" });
    }
  });

  app.get("/api/android/developer-mode/instructions", async (req, res) => {
    try {
      const deviceState = req.query.state as DeviceInfo["deviceState"];
      const instructions = await androidTool.getDeveloperModeInstructions(deviceState);
      res.json(instructions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get developer mode instructions" });
    }
  });

  app.post("/api/android/developer-mode/enable-recovery", async (req, res) => {
    try {
      const operationId = `dev_enable_${Date.now()}`;
      androidTool.enableDeveloperModeViaRecovery(operationId).then(success => {
        androidTool.broadcastUpdate(operationId, {
          type: "complete",
          success,
          message: success ? "Developer mode enabled via recovery" : "Failed to enable developer mode"
        });
      }).catch(error => {
        androidTool.broadcastUpdate(operationId, {
          type: "error",
          message: error.message
        });
      });
      res.json({ operationId });
    } catch (error) {
      res.status(500).json({ message: "Failed to enable developer mode via recovery" });
    }
  });

  // Device unbrick and recovery endpoints
  
  // Analyze device brick status
  app.post("/api/android/device/analyze-brick", async (req, res) => {
    try {
      const operationId = `analyze_brick_${Date.now()}`;
      const brickStatus = await androidTool.detectBrickStatus(operationId);
      res.json({ success: true, brickStatus, operationId });
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze brick status" });
    }
  });

  // Enter special mode (EDL, Download, DSU, etc.)
  app.post("/api/android/unbrick/enter-mode", async (req, res) => {
    try {
      const { deviceMode, unbrickMethod, cableConfiguration, buttonCombo, forceMode } = req.body;
      const operationId = `enter_mode_${Date.now()}`;
      
      const success = await androidTool.enterSpecialMode({
        deviceMode,
        unbrickMethod,
        cableConfiguration,
        buttonCombo,
        forceMode
      }, operationId);
      
      res.json({ success, operationId });
    } catch (error) {
      res.status(500).json({ message: "Failed to enter special mode" });
    }
  });

  // Complete device unbrick procedure
  app.post("/api/android/unbrick/recover", async (req, res) => {
    try {
      const { deviceMode, firmwarePath, unbrickMethod, cableConfiguration, buttonCombo, forceMode } = req.body;
      const operationId = `unbrick_${Date.now()}`;
      
      const success = await androidTool.unbrickDevice({
        deviceMode,
        firmwarePath,
        unbrickMethod,
        cableConfiguration,
        buttonCombo,
        forceMode
      }, operationId);
      
      res.json({ success, operationId });
    } catch (error) {
      res.status(500).json({ message: "Failed to start unbrick procedure" });
    }
  });

  // WebSocket connection handling
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  return httpServer;
}
