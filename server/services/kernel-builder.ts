import { spawn, ChildProcess } from "child_process";
import { WebSocketServer, WebSocket } from "ws";
import path from "path";
import fs from "fs/promises";
import { storage } from "../storage";
import { BuildJob, KernelConfiguration } from "@shared/schema";

export class KernelBuilderService {
  private activeBuilds = new Map<number, ChildProcess>();
  private wss: WebSocketServer;

  constructor(wss: WebSocketServer) {
    this.wss = wss;
  }

  async startBuild(buildJob: BuildJob, configuration: KernelConfiguration): Promise<void> {
    // Update build status to running
    await storage.updateBuildJob(buildJob.id, {
      status: "running",
      currentStep: "Initializing build...",
      progress: 0,
    });

    // Create configuration file
    const configPath = await this.createConfigFile(configuration);

    // Build Python command arguments
    const pythonArgs = [
      path.join(process.cwd(), "kernel_customizer.py"),
      "--config", configPath,
    ];

    // Add skip options based on configuration
    if (configuration.skipOptions.skipEnvSetup) pythonArgs.push("--skip-env-setup");
    if (configuration.skipOptions.skipClone) pythonArgs.push("--skip-clone");
    if (configuration.skipOptions.skipPatches) pythonArgs.push("--skip-patches");
    if (configuration.skipOptions.skipConfigTweaks) pythonArgs.push("--skip-config-tweaks");
    if (configuration.skipOptions.skipBuild) pythonArgs.push("--skip-build");
    if (configuration.skipOptions.cleanOutput) pythonArgs.push("--clean-output");

    try {
      // Spawn Python process
      const pythonProcess = spawn("python3", pythonArgs, {
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env },
      });

      this.activeBuilds.set(buildJob.id, pythonProcess);

      let logBuffer = "";

      // Handle stdout
      pythonProcess.stdout?.on("data", async (data: Buffer) => {
        const output = data.toString();
        logBuffer += output;
        
        // Parse progress and current step from output
        const progress = this.parseProgress(output);
        const currentStep = this.parseCurrentStep(output);

        // Update build job
        await storage.updateBuildJob(buildJob.id, {
          logs: logBuffer,
          progress: progress || buildJob.progress,
          currentStep: currentStep || buildJob.currentStep,
        });

        // Broadcast to WebSocket clients
        this.broadcastBuildUpdate(buildJob.id, {
          logs: output,
          progress: progress || buildJob.progress,
          currentStep: currentStep || buildJob.currentStep,
          status: "running",
        });
      });

      // Handle stderr
      pythonProcess.stderr?.on("data", async (data: Buffer) => {
        const error = data.toString();
        logBuffer += error;

        await storage.updateBuildJob(buildJob.id, {
          logs: logBuffer,
        });

        this.broadcastBuildUpdate(buildJob.id, {
          logs: error,
          status: "running",
        });
      });

      // Handle process completion
      pythonProcess.on("close", async (code: number) => {
        this.activeBuilds.delete(buildJob.id);

        const status = code === 0 ? "completed" : "failed";
        const errorMessage = code !== 0 ? "Build process failed with non-zero exit code" : undefined;

        await storage.updateBuildJob(buildJob.id, {
          status,
          progress: code === 0 ? 100 : buildJob.progress,
          currentStep: code === 0 ? "Build completed successfully" : "Build failed",
          errorMessage,
          logs: logBuffer,
        });

        this.broadcastBuildUpdate(buildJob.id, {
          status,
          progress: code === 0 ? 100 : buildJob.progress,
          currentStep: code === 0 ? "Build completed successfully" : "Build failed",
          errorMessage,
        });

        // Clean up config file
        try {
          await fs.unlink(configPath);
        } catch (error) {
          console.error("Failed to clean up config file:", error);
        }
      });

      // Handle process errors
      pythonProcess.on("error", async (error: Error) => {
        this.activeBuilds.delete(buildJob.id);

        await storage.updateBuildJob(buildJob.id, {
          status: "failed",
          errorMessage: error.message,
          logs: logBuffer + `\nProcess error: ${error.message}`,
        });

        this.broadcastBuildUpdate(buildJob.id, {
          status: "failed",
          errorMessage: error.message,
        });
      });

    } catch (error) {
      await storage.updateBuildJob(buildJob.id, {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });

      this.broadcastBuildUpdate(buildJob.id, {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async cancelBuild(buildJobId: number): Promise<void> {
    const process = this.activeBuilds.get(buildJobId);
    if (process) {
      process.kill("SIGTERM");
      this.activeBuilds.delete(buildJobId);

      await storage.updateBuildJob(buildJobId, {
        status: "cancelled",
        currentStep: "Build cancelled by user",
      });

      this.broadcastBuildUpdate(buildJobId, {
        status: "cancelled",
        currentStep: "Build cancelled by user",
      });
    }
  }

  async checkWSLStatus(): Promise<{ available: boolean; distros: string[]; message: string }> {
    return new Promise((resolve) => {
      const wslProcess = spawn("wsl", ["--list", "--quiet"], { stdio: ["pipe", "pipe", "pipe"] });
      
      let output = "";
      let error = "";

      wslProcess.stdout?.on("data", (data: Buffer) => {
        output += data.toString();
      });

      wslProcess.stderr?.on("data", (data: Buffer) => {
        error += data.toString();
      });

      wslProcess.on("close", (code: number) => {
        if (code === 0) {
          const distros = output
            .split("\n")
            .map(line => line.trim().replace(/\x00/g, ""))
            .filter(line => line.length > 0);

          resolve({
            available: true,
            distros,
            message: `WSL is available with ${distros.length} distribution(s)`,
          });
        } else {
          resolve({
            available: false,
            distros: [],
            message: "WSL is not available or not properly configured",
          });
        }
      });

      wslProcess.on("error", () => {
        resolve({
          available: false,
          distros: [],
          message: "WSL command not found",
        });
      });
    });
  }

  private async createConfigFile(configuration: KernelConfiguration): Promise<string> {
    const config = {
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

    const configPath = path.join(process.cwd(), `kernel_config_${configuration.id}_${Date.now()}.json`);
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    return configPath;
  }

  private parseProgress(output: string): number | null {
    // Look for progress indicators in the output
    const progressMatch = output.match(/(\d+)%/);
    if (progressMatch) {
      return parseInt(progressMatch[1]);
    }

    // Look for step indicators
    if (output.includes("Starting kernel compilation")) return 60;
    if (output.includes("Applying NetHunter patches")) return 40;
    if (output.includes("Cloning kernel repository")) return 20;
    if (output.includes("Setting up WSL environment")) return 10;

    return null;
  }

  private parseCurrentStep(output: string): string | null {
    if (output.includes("Setting up WSL environment")) return "Setting up WSL environment";
    if (output.includes("Cloning kernel repository")) return "Cloning repositories";
    if (output.includes("Applying NetHunter patches")) return "Applying NetHunter patches";
    if (output.includes("Starting kernel compilation")) return "Compiling kernel";
    if (output.includes("Build process completed")) return "Build completed";
    if (output.includes("Build failed")) return "Build failed";

    return null;
  }

  private broadcastBuildUpdate(buildJobId: number, update: any) {
    const message = JSON.stringify({
      type: "buildUpdate",
      buildJobId,
      ...update,
    });

    this.wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
