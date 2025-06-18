import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertKernelConfigurationSchema, insertBuildJobSchema } from "@shared/schema";
import { KernelBuilderService } from "./services/kernel-builder";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time build updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const kernelBuilder = new KernelBuilderService(wss);

  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
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
      const validatedData = insertKernelConfigurationSchema.parse(req.body);
      const configuration = await storage.createKernelConfiguration(validatedData);
      res.status(201).json(configuration);
    } catch (error) {
      res.status(400).json({ message: "Invalid configuration data" });
    }
  });

  app.post("/api/kernel-configurations", async (req, res) => {
    try {
      const validatedData = insertKernelConfigurationSchema.parse(req.body);
      const configuration = await storage.createKernelConfiguration(validatedData);
      res.status(201).json(configuration);
    } catch (error) {
      res.status(400).json({ message: "Invalid configuration data" });
    }
  });

  app.put("/api/configurations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertKernelConfigurationSchema.partial().parse(req.body);
      const configuration = await storage.updateKernelConfiguration(id, validatedData);
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
      const validatedData = insertBuildJobSchema.parse(req.body);
      const build = await storage.createBuildJob(validatedData);
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

  // WebSocket connection handling
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  return httpServer;
}
