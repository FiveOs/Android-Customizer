import { spawn, ChildProcess } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";

export interface DeviceInfo {
  model: string;
  androidVersion: string;
  buildId: string;
  securityPatch: string;
  kernelVersion: string;
  bootloader: string;
  isRooted: boolean;
  bootloaderUnlocked: boolean;
}

export interface KernelTweakParams {
  cpuGovernor?: string;
  ioScheduler?: string;
  tcpCongestion?: string;
}

export interface AndroidToolConfig {
  adbPath: string;
  fastbootPath: string;
  toolsDir: string;
  outputDir: string;
}

export class AndroidToolService {
  private config: AndroidToolConfig;
  private wss: WebSocketServer;
  private activeOperations = new Map<string, ChildProcess>();

  constructor(wss: WebSocketServer) {
    this.wss = wss;
    this.config = {
      adbPath: "adb",
      fastbootPath: "fastboot",
      toolsDir: path.join(process.cwd(), "tools"),
      outputDir: path.join(process.cwd(), "output")
    };
    
    // Ensure directories exist
    this.ensureDirectories();
  }

  private async ensureDirectories() {
    try {
      await fs.mkdir(this.config.toolsDir, { recursive: true });
      await fs.mkdir(this.config.outputDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create directories:", error);
    }
  }

  private broadcastUpdate(operationId: string, update: any) {
    this.wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: "android_tool_update",
          operationId,
          ...update
        }));
      }
    });
  }

  private async runCommand(command: string[], operationId?: string): Promise<{ success: boolean; output: string }> {
    return new Promise((resolve) => {
      const process = spawn(command[0], command.slice(1), {
        stdio: ["pipe", "pipe", "pipe"]
      });

      if (operationId) {
        this.activeOperations.set(operationId, process);
      }

      let stdout = "";
      let stderr = "";

      process.stdout?.on("data", (data: Buffer) => {
        const output = data.toString();
        stdout += output;
        if (operationId) {
          this.broadcastUpdate(operationId, {
            type: "output",
            data: output
          });
        }
      });

      process.stderr?.on("data", (data: Buffer) => {
        const error = data.toString();
        stderr += error;
        if (operationId) {
          this.broadcastUpdate(operationId, {
            type: "error",
            data: error
          });
        }
      });

      process.on("close", (code) => {
        if (operationId) {
          this.activeOperations.delete(operationId);
        }
        resolve({
          success: code === 0,
          output: stdout.trim() || stderr.trim()
        });
      });

      process.on("error", (error) => {
        if (operationId) {
          this.activeOperations.delete(operationId);
        }
        resolve({
          success: false,
          output: error.message
        });
      });
    });
  }

  async checkDeviceConnectivity(mode: "adb" | "fastboot"): Promise<boolean> {
    const command = mode === "fastboot" ? 
      [this.config.fastbootPath, "devices"] : 
      [this.config.adbPath, "devices"];
    
    const result = await this.runCommand(command);
    return result.success && result.output.length > 0;
  }

  async getDeviceInfo(): Promise<DeviceInfo | null> {
    if (!await this.checkDeviceConnectivity("adb")) {
      return null;
    }

    const props = {
      model: "ro.product.model",
      androidVersion: "ro.build.version.release",
      buildId: "ro.build.display.id",
      securityPatch: "ro.build.version.security_patch",
      bootloader: "ro.bootloader"
    };

    const info: any = {};
    
    for (const [key, prop] of Object.entries(props)) {
      const result = await this.runCommand([this.config.adbPath, "shell", "getprop", prop]);
      info[key] = result.success ? result.output : "Unknown";
    }

    // Get kernel version
    const kernelResult = await this.runCommand([this.config.adbPath, "shell", "uname", "-r"]);
    info.kernelVersion = kernelResult.success ? kernelResult.output : "Unknown";

    // Check root access
    const rootResult = await this.runCommand([this.config.adbPath, "shell", "su", "-c", "whoami"]);
    info.isRooted = rootResult.success && rootResult.output.includes("root");

    // Check bootloader status (requires fastboot mode)
    info.bootloaderUnlocked = false; // Default to false, would need fastboot check

    return info as DeviceInfo;
  }

  async tweakKernel(params: KernelTweakParams, operationId: string): Promise<boolean> {
    this.broadcastUpdate(operationId, {
      type: "status",
      message: "Starting kernel tweaking..."
    });

    const deviceInfo = await this.getDeviceInfo();
    if (!deviceInfo?.isRooted) {
      this.broadcastUpdate(operationId, {
        type: "error",
        message: "Root access required for kernel tweaking"
      });
      return false;
    }

    const tweaks = [];
    
    if (params.cpuGovernor) {
      tweaks.push({
        name: "CPU Governor",
        path: "/sys/devices/system/cpu/cpu0/cpufreq/scaling_governor",
        value: params.cpuGovernor
      });
    }

    if (params.ioScheduler) {
      tweaks.push({
        name: "I/O Scheduler",
        path: "/sys/block/mmcblk0/queue/scheduler",
        value: params.ioScheduler
      });
    }

    if (params.tcpCongestion) {
      tweaks.push({
        name: "TCP Congestion Control",
        path: "/proc/sys/net/ipv4/tcp_congestion_control",
        value: params.tcpCongestion
      });
    }

    let success = true;
    for (const tweak of tweaks) {
      this.broadcastUpdate(operationId, {
        type: "status",
        message: `Setting ${tweak.name} to ${tweak.value}...`
      });

      const result = await this.runCommand([
        this.config.adbPath, "shell", "su", "-c", 
        `echo ${tweak.value} > ${tweak.path}`
      ], operationId);

      if (result.success) {
        this.broadcastUpdate(operationId, {
          type: "success",
          message: `✅ ${tweak.name} set to ${tweak.value}`
        });
      } else {
        this.broadcastUpdate(operationId, {
          type: "error",
          message: `❌ Failed to set ${tweak.name}`
        });
        success = false;
      }
    }

    return success;
  }

  async flashRecovery(recoveryImagePath: string, operationId: string): Promise<boolean> {
    this.broadcastUpdate(operationId, {
      type: "status",
      message: "Rebooting to bootloader..."
    });

    // Reboot to bootloader
    await this.runCommand([this.config.adbPath, "reboot", "bootloader"]);
    
    // Wait for fastboot mode
    await new Promise(resolve => setTimeout(resolve, 5000));

    if (!await this.checkDeviceConnectivity("fastboot")) {
      this.broadcastUpdate(operationId, {
        type: "error",
        message: "Device not detected in fastboot mode"
      });
      return false;
    }

    this.broadcastUpdate(operationId, {
      type: "status",
      message: "Flashing recovery image..."
    });

    const result = await this.runCommand([
      this.config.fastbootPath, "flash", "recovery", recoveryImagePath
    ], operationId);

    if (result.success) {
      this.broadcastUpdate(operationId, {
        type: "success",
        message: "✅ Recovery flashed successfully"
      });
      
      // Reboot back to system
      await this.runCommand([this.config.fastbootPath, "reboot"]);
      return true;
    } else {
      this.broadcastUpdate(operationId, {
        type: "error",
        message: "❌ Failed to flash recovery"
      });
      return false;
    }
  }

  async patchBootImage(bootImagePath: string, magiskBootPath: string, operationId: string): Promise<string | null> {
    this.broadcastUpdate(operationId, {
      type: "status",
      message: "Starting boot image patching with Magisk..."
    });

    const tempDir = path.join(this.config.outputDir, `patch_${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // Copy files to temp directory
      const tempBootImage = path.join(tempDir, "boot.img");
      const tempMagiskBoot = path.join(tempDir, "magiskboot");
      
      await fs.copyFile(bootImagePath, tempBootImage);
      await fs.copyFile(magiskBootPath, tempMagiskBoot);

      // Make magiskboot executable (Linux/macOS)
      if (process.platform !== "win32") {
        await this.runCommand(["chmod", "+x", tempMagiskBoot]);
      }

      this.broadcastUpdate(operationId, {
        type: "status",
        message: "Unpacking boot image..."
      });

      // Unpack boot image
      const unpackResult = await this.runCommand([
        tempMagiskBoot, "unpack", tempBootImage
      ], operationId);

      if (!unpackResult.success) {
        throw new Error("Failed to unpack boot image");
      }

      this.broadcastUpdate(operationId, {
        type: "status",
        message: "Repacking with Magisk patches..."
      });

      // Repack boot image
      const repackResult = await this.runCommand([
        tempMagiskBoot, "repack", tempBootImage
      ], operationId);

      if (!repackResult.success) {
        throw new Error("Failed to repack boot image");
      }

      // Move patched image to output
      const patchedImageName = `patched-boot-${Date.now()}.img`;
      const patchedImagePath = path.join(this.config.outputDir, patchedImageName);
      const newBootImage = path.join(tempDir, "new-boot.img");
      
      await fs.copyFile(newBootImage, patchedImagePath);

      this.broadcastUpdate(operationId, {
        type: "success",
        message: `✅ Boot image patched successfully: ${patchedImageName}`
      });

      // Cleanup temp directory
      await fs.rm(tempDir, { recursive: true, force: true });

      return patchedImagePath;
    } catch (error) {
      this.broadcastUpdate(operationId, {
        type: "error",
        message: `❌ Patching failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      
      // Cleanup temp directory
      await fs.rm(tempDir, { recursive: true, force: true });
      return null;
    }
  }

  async sideloadMagisk(magiskZipPath: string, operationId: string): Promise<boolean> {
    this.broadcastUpdate(operationId, {
      type: "status",
      message: "Rebooting to recovery for sideloading..."
    });

    // Reboot to recovery
    await this.runCommand([this.config.adbPath, "reboot", "recovery"]);
    
    // Wait for recovery mode
    await new Promise(resolve => setTimeout(resolve, 10000));

    this.broadcastUpdate(operationId, {
      type: "status",
      message: "Sideloading Magisk ZIP..."
    });

    const result = await this.runCommand([
      this.config.adbPath, "sideload", magiskZipPath
    ], operationId);

    if (result.success) {
      this.broadcastUpdate(operationId, {
        type: "success",
        message: "✅ Magisk ZIP sideloaded successfully"
      });
      return true;
    } else {
      this.broadcastUpdate(operationId, {
        type: "error",
        message: "❌ Failed to sideload Magisk ZIP"
      });
      return false;
    }
  }

  async dumpBootImage(operationId: string): Promise<string | null> {
    const deviceInfo = await this.getDeviceInfo();
    if (!deviceInfo?.isRooted) {
      this.broadcastUpdate(operationId, {
        type: "error",
        message: "Root access required to dump boot image"
      });
      return null;
    }

    this.broadcastUpdate(operationId, {
      type: "status",
      message: "Dumping boot image from device..."
    });

    // Dump boot partition to SD card
    const dumpResult = await this.runCommand([
      this.config.adbPath, "shell", "su", "-c",
      "dd if=/dev/block/bootdevice/by-name/boot of=/sdcard/boot.img"
    ], operationId);

    if (!dumpResult.success) {
      this.broadcastUpdate(operationId, {
        type: "error",
        message: "❌ Failed to dump boot image"
      });
      return null;
    }

    // Pull boot image to tools directory
    const bootImagePath = path.join(this.config.toolsDir, "dumped-boot.img");
    const pullResult = await this.runCommand([
      this.config.adbPath, "pull", "/sdcard/boot.img", bootImagePath
    ], operationId);

    if (pullResult.success) {
      this.broadcastUpdate(operationId, {
        type: "success",
        message: `✅ Boot image dumped to: ${bootImagePath}`
      });
      return bootImagePath;
    } else {
      this.broadcastUpdate(operationId, {
        type: "error",
        message: "❌ Failed to pull boot image"
      });
      return null;
    }
  }

  cancelOperation(operationId: string): boolean {
    const process = this.activeOperations.get(operationId);
    if (process) {
      process.kill();
      this.activeOperations.delete(operationId);
      this.broadcastUpdate(operationId, {
        type: "cancelled",
        message: "Operation cancelled"
      });
      return true;
    }
    return false;
  }
}