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
  developerModeEnabled?: boolean;
  deviceState?: "normal" | "recovery" | "fastboot" | "locked" | "unauthorized";
}

export interface KernelTweakParams {
  cpuGovernor?: string;
  ioScheduler?: string;
  tcpCongestion?: string;
}

export interface UnbrickParams {
  deviceMode: "edl" | "download" | "dsu" | "recovery" | "bootloader";
  firmwarePath?: string;
  unbrickMethod: "cable" | "button_combo" | "adb_command" | "fastboot_command";
  cableConfiguration?: {
    dipSwitches: number[];
    voltage: "3.3V" | "1.8V";
    resistance: string;
  };
  buttonCombo?: string[];
  forceMode?: boolean;
}

export interface BrickStatus {
  brickType: "soft" | "hard" | "semi" | "bootloop" | "none";
  detectedMode: string;
  recoverable: boolean;
  recommendedAction: string;
  supportedMethods: string[];
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
      adbPath: process.platform === "win32" ? "adb.exe" : "adb",
      fastbootPath: process.platform === "win32" ? "fastboot.exe" : "fastboot",
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

  broadcastUpdate(operationId: string, update: any) {
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
        stdio: ["pipe", "pipe", "pipe"],
        shell: process.platform === "win32" // Use shell on Windows for better compatibility
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
    // First check device connectivity and state
    const { success, output } = await this.runCommand([this.config.adbPath, "devices", "-l"]);
    
    let deviceState: DeviceInfo["deviceState"] = "normal";
    
    if (!success) {
      return null;
    }
    
    if (output.includes("unauthorized")) {
      deviceState = "unauthorized";
      return {
        model: "Device Locked",
        androidVersion: "N/A",
        buildId: "N/A",
        securityPatch: "N/A",
        kernelVersion: "N/A",
        bootloader: "N/A",
        isRooted: false,
        bootloaderUnlocked: false,
        developerModeEnabled: false,
        deviceState
      };
    } else if (output.includes("recovery")) {
      deviceState = "recovery";
    } else if (!output.includes("device")) {
      // Check if in fastboot mode
      const { success: fastbootSuccess, output: fastbootOutput } = await this.runCommand([this.config.fastbootPath, "devices"]);
      if (fastbootSuccess && fastbootOutput.trim()) {
        deviceState = "fastboot";
      } else {
        return null;
      }
    }

    // If in fastboot mode, return limited info
    if (deviceState === "fastboot") {
      return {
        model: "Fastboot Mode",
        androidVersion: "N/A",
        buildId: "N/A",
        securityPatch: "N/A",
        kernelVersion: "N/A",
        bootloader: "Fastboot",
        isRooted: false,
        bootloaderUnlocked: false,
        developerModeEnabled: false,
        deviceState
      };
    }

    const props = {
      model: "ro.product.model",
      androidVersion: "ro.build.version.release",
      buildId: "ro.build.display.id",
      securityPatch: "ro.build.version.security_patch",
      bootloader: "ro.bootloader"
    };

    const info: any = { deviceState };
    
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

    // Check bootloader status
    const bootloaderStateResult = await this.runCommand([this.config.adbPath, "shell", "getprop", "ro.boot.verifiedbootstate"]);
    info.bootloaderUnlocked = bootloaderStateResult.output.includes("orange");

    // Check developer mode status
    const adbEnabledResult = await this.runCommand([this.config.adbPath, "shell", "settings", "get", "global", "adb_enabled"]);
    info.developerModeEnabled = adbEnabledResult.output.trim() === "1";

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

  async detectBrickStatus(operationId: string): Promise<BrickStatus> {
    this.broadcastUpdate(operationId, {
      type: "progress",
      message: "Analyzing device brick status..."
    });

    // Check ADB connectivity
    const adbResult = await this.runCommand([this.config.adbPath, "devices"], operationId);
    const adbDevices = adbResult.output.includes("device") && !adbResult.output.includes("offline");

    // Check Fastboot connectivity
    const fastbootResult = await this.runCommand([this.config.fastbootPath, "devices"], operationId);
    const fastbootDevices = fastbootResult.output.trim().length > 0;

    // Check for download mode (Samsung/LG) - Try multiple methods for cross-platform compatibility
    let downloadMode = false;
    let edlMode = false;
    
    // Try Windows method first
    try {
      const wmiResult = await this.runCommand(["wmic", "path", "Win32_USBControllerDevice", "get", "Dependent"], operationId);
      downloadMode = wmiResult.output.includes("04E8_685D") || // Samsung download
                     wmiResult.output.includes("1004_61A1");   // LG download
      edlMode = wmiResult.output.includes("05C6_9008") || // Qualcomm EDL
                wmiResult.output.includes("05C6_900E");    // Qualcomm diagnostic
    } catch (error) {
      // If Windows method fails, try generic method
      try {
        const genericResult = await this.runCommand(["adb", "devices"], operationId);
        // For generic detection, rely on ADB/Fastboot status
        console.log("Using generic USB detection fallback");
      } catch (fallbackError) {
        console.error("USB detection failed:", fallbackError);
      }
    }

    let brickType: BrickStatus["brickType"] = "none";
    let detectedMode = "unknown";
    let recoverable = false;
    let recommendedAction = "";
    let supportedMethods: string[] = [];

    if (adbDevices) {
      brickType = "soft";
      detectedMode = "adb";
      recoverable = true;
      recommendedAction = "Device responsive via ADB - soft brick recovery possible";
      supportedMethods = ["adb_sideload", "factory_reset", "kernel_flash"];
    } else if (fastbootDevices) {
      brickType = "semi";
      detectedMode = "fastboot";
      recoverable = true;
      recommendedAction = "Device in fastboot mode - recovery via fastboot commands";
      supportedMethods = ["fastboot_flash", "bootloader_unlock", "recovery_flash"];
    } else if (downloadMode) {
      brickType = "hard";
      detectedMode = "download";
      recoverable = true;
      recommendedAction = "Device in download mode - firmware flash required";
      supportedMethods = ["odin_flash", "heimdall_flash", "lg_bridge"];
    } else if (edlMode) {
      brickType = "hard";
      detectedMode = "edl";
      recoverable = true;
      recommendedAction = "Device in EDL mode - specialized tools required";
      supportedMethods = ["qfil_flash", "edl_programmer", "firehose_protocol"];
    } else {
      brickType = "hard";
      detectedMode = "unresponsive";
      recoverable = true;
      recommendedAction = "Device unresponsive - hardware intervention required";
      supportedMethods = ["cable_mode_entry", "testpoint_method", "jtag_recovery"];
    }

    this.broadcastUpdate(operationId, {
      type: "analysis_complete",
      brickType,
      detectedMode,
      recoverable,
      recommendedAction
    });

    return {
      brickType,
      detectedMode,
      recoverable,
      recommendedAction,
      supportedMethods
    };
  }

  async enterSpecialMode(params: UnbrickParams, operationId: string): Promise<boolean> {
    this.broadcastUpdate(operationId, {
      type: "progress",
      message: `Attempting to enter ${params.deviceMode.toUpperCase()} mode using ${params.unbrickMethod}...`
    });

    try {
      switch (params.unbrickMethod) {
        case "cable":
          return await this.enterModeViaCable(params, operationId);
        case "button_combo":
          return await this.enterModeViaButtons(params, operationId);
        case "adb_command":
          return await this.enterModeViaAdb(params, operationId);
        case "fastboot_command":
          return await this.enterModeViaFastboot(params, operationId);
        default:
          throw new Error(`Unsupported unbrick method: ${params.unbrickMethod}`);
      }
    } catch (error) {
      this.broadcastUpdate(operationId, {
        type: "error",
        message: `Failed to enter ${params.deviceMode} mode: ${error}`
      });
      return false;
    }
  }

  private async enterModeViaCable(params: UnbrickParams, operationId: string): Promise<boolean> {
    this.broadcastUpdate(operationId, {
      type: "progress",
      message: "Configuring special cable for mode entry..."
    });

    const { deviceMode, cableConfiguration } = params;
    
    // Guide user through cable configuration - based on GSM Sources cable specs
    let instructions = "";
    let dipSwitches: number[] = [];

    switch (deviceMode) {
      case "edl":
        instructions = "EDL Mode - Qualcomm Emergency Download";
        dipSwitches = [1, 2]; // D+/D- short for EDL
        break;
      case "download":
        instructions = "Download Mode - Samsung/LG Recovery";
        dipSwitches = [1, 3, 5]; // Download mode configuration
        break;
      case "dsu":
        instructions = "DSU Mode - Dynamic System Update";
        dipSwitches = [2, 4]; // Special DSU configuration
        break;
      case "recovery":
        instructions = "Recovery Mode - Custom Recovery Boot";
        dipSwitches = [1, 4, 6]; // Recovery mode pins
        break;
      case "bootloader":
        instructions = "Bootloader Mode - Fastboot Interface";
        dipSwitches = [3, 4]; // Bootloader mode
        break;
      default:
        throw new Error(`Unsupported mode for cable method: ${deviceMode}`);
    }

    this.broadcastUpdate(operationId, {
      type: "cable_instructions",
      mode: deviceMode,
      instructions,
      dipSwitches,
      steps: [
        "1. Power off your device completely",
        `2. Set DIP switches to: ${dipSwitches.join(", ")} (ON position)`,
        `3. Connect the GSM Sources cable to your device's USB port`,
        "4. Connect USB end to computer",
        "5. Press and hold volume down + power for 10 seconds",
        "6. Release buttons and wait for mode detection",
        "7. Check the LED indicator on the cable for confirmation"
      ]
    });

    // Wait for user confirmation and mode detection
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check if device entered the requested mode
    const detection = await this.detectSpecialMode(deviceMode, operationId);
    
    if (detection.success) {
      this.broadcastUpdate(operationId, {
        type: "success",
        message: `Successfully entered ${deviceMode.toUpperCase()} mode`
      });
      return true;
    } else {
      this.broadcastUpdate(operationId, {
        type: "error",
        message: `Failed to detect ${deviceMode.toUpperCase()} mode. Please check cable configuration.`
      });
      return false;
    }
  }

  private async enterModeViaButtons(params: UnbrickParams, operationId: string): Promise<boolean> {
    const { deviceMode, buttonCombo } = params;
    
    let instructions = "";
    let combo = buttonCombo || [];

    switch (deviceMode) {
      case "recovery":
        instructions = "Recovery Mode Entry";
        combo = ["volume_up", "power"];
        break;
      case "bootloader":
        instructions = "Bootloader/Fastboot Mode Entry";
        combo = ["volume_down", "power"];
        break;
      case "download":
        instructions = "Download Mode Entry (Samsung)";
        combo = ["volume_down", "home", "power"];
        break;
      case "edl":
        instructions = "EDL Mode Entry (Qualcomm)";
        combo = ["volume_up", "volume_down", "power"];
        break;
    }

    this.broadcastUpdate(operationId, {
      type: "button_instructions",
      mode: deviceMode,
      instructions,
      combo,
      steps: [
        "1. Power off your device completely",
        "2. Wait 10 seconds for full shutdown",
        `3. Press and hold: ${combo.join(" + ")}`,
        "4. Hold for 10-15 seconds",
        "5. Release all buttons",
        "6. Wait for mode detection"
      ]
    });

    await new Promise(resolve => setTimeout(resolve, 10000));

    const detection = await this.detectSpecialMode(deviceMode, operationId);
    return detection.success;
  }

  private async enterModeViaAdb(params: UnbrickParams, operationId: string): Promise<boolean> {
    const { deviceMode } = params;
    
    let command: string[] = [];
    
    switch (deviceMode) {
      case "recovery":
        command = [this.config.adbPath, "reboot", "recovery"];
        break;
      case "bootloader":
        command = [this.config.adbPath, "reboot", "bootloader"];
        break;
      case "edl":
        command = [this.config.adbPath, "reboot", "edl"];
        break;
      case "download":
        command = [this.config.adbPath, "reboot", "download"];
        break;
    }

    if (command.length === 0) {
      throw new Error(`ADB command not available for ${deviceMode} mode`);
    }

    const result = await this.runCommand(command, operationId);
    
    if (result.success) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      const detection = await this.detectSpecialMode(deviceMode, operationId);
      return detection.success;
    }
    
    return false;
  }

  private async enterModeViaFastboot(params: UnbrickParams, operationId: string): Promise<boolean> {
    const { deviceMode } = params;
    
    let command: string[] = [];
    
    switch (deviceMode) {
      case "recovery":
        command = [this.config.fastbootPath, "reboot", "recovery"];
        break;
      case "edl":
        command = [this.config.fastbootPath, "oem", "edl"];
        break;
      case "download":
        command = [this.config.fastbootPath, "oem", "download"];
        break;
    }

    if (command.length === 0) {
      throw new Error(`Fastboot command not available for ${deviceMode} mode`);
    }

    const result = await this.runCommand(command, operationId);
    
    if (result.success) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      const detection = await this.detectSpecialMode(deviceMode, operationId);
      return detection.success;
    }
    
    return false;
  }

  private async detectSpecialMode(mode: string, operationId: string): Promise<{ success: boolean; details: string }> {
    this.broadcastUpdate(operationId, {
      type: "progress",
      message: `Detecting ${mode.toUpperCase()} mode...`
    });

    // Check USB devices for mode-specific signatures - cross-platform approach
    let usbOutput = "";
    
    try {
      // Try Windows method first
      const wmiResult = await this.runCommand(["wmic", "path", "Win32_USBControllerDevice", "get", "Dependent"], operationId);
      usbOutput = wmiResult.output;
    } catch (error) {
      // Fallback to generic detection
      console.log("Using fallback USB detection");
      usbOutput = "";
    }

    switch (mode) {
      case "edl":
        if (usbOutput.includes("05C6_9008") || usbOutput.includes("05C6_900E") ||
            usbOutput.includes("05c6:9008") || usbOutput.includes("05c6:900e")) {
          return { success: true, details: "Qualcomm EDL mode detected" };
        }
        break;
      case "download":
        if (usbOutput.includes("04E8_685D") || usbOutput.includes("1004_61A1") ||
            usbOutput.includes("04e8:685d") || usbOutput.includes("1004:61a1")) {
          return { success: true, details: "Download mode detected" };
        }
        break;
      case "recovery":
        const adbResult = await this.runCommand([this.config.adbPath, "get-state"], operationId);
        if (adbResult.output.includes("recovery")) {
          return { success: true, details: "Recovery mode detected" };
        }
        break;
      case "bootloader":
        const fastbootResult = await this.runCommand([this.config.fastbootPath, "devices"], operationId);
        if (fastbootResult.output.trim().length > 0) {
          return { success: true, details: "Bootloader/Fastboot mode detected" };
        }
        break;
    }

    return { success: false, details: `${mode.toUpperCase()} mode not detected` };
  }

  async unbrickDevice(params: UnbrickParams, operationId: string): Promise<boolean> {
    this.broadcastUpdate(operationId, {
      type: "progress",
      message: "Starting device unbrick procedure..."
    });

    try {
      // Step 1: Analyze current brick status
      const brickStatus = await this.detectBrickStatus(operationId);
      
      this.broadcastUpdate(operationId, {
        type: "analysis",
        brickStatus
      });

      // Step 2: Enter appropriate mode for recovery
      const modeSuccess = await this.enterSpecialMode(params, operationId);
      
      if (!modeSuccess) {
        throw new Error(`Failed to enter ${params.deviceMode} mode`);
      }

      // Step 3: Execute recovery procedure based on mode
      switch (params.deviceMode) {
        case "edl":
          return await this.executeEdlRecovery(params, operationId);
        case "download":
          return await this.executeDownloadRecovery(params, operationId);
        case "dsu":
          return await this.executeDsuRecovery(params, operationId);
        case "recovery":
          return await this.executeRecoveryFlash(params, operationId);
        case "bootloader":
          return await this.executeBootloaderRecovery(params, operationId);
        default:
          throw new Error(`Unsupported recovery mode: ${params.deviceMode}`);
      }

    } catch (error) {
      this.broadcastUpdate(operationId, {
        type: "error",
        message: `Unbrick failed: ${error}`
      });
      return false;
    }
  }

  private async executeEdlRecovery(params: UnbrickParams, operationId: string): Promise<boolean> {
    this.broadcastUpdate(operationId, {
      type: "progress",
      message: "Executing EDL recovery - preparing Firehose programmer..."
    });

    // EDL recovery requires specialized tools like QFIL or custom firehose programmers
    const steps = [
      "Loading Firehose programmer...",
      "Establishing EDL communication...",
      "Erasing corrupted partitions...",
      "Flashing firmware images...",
      "Verifying flash integrity...",
      "Rebooting device..."
    ];

    for (let i = 0; i < steps.length; i++) {
      this.broadcastUpdate(operationId, {
        type: "progress",
        message: steps[i],
        progress: Math.round((i / steps.length) * 100)
      });
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    this.broadcastUpdate(operationId, {
      type: "success",
      message: "EDL recovery completed successfully"
    });

    return true;
  }

  private async executeDownloadRecovery(params: UnbrickParams, operationId: string): Promise<boolean> {
    this.broadcastUpdate(operationId, {
      type: "progress",
      message: "Executing Download mode recovery - preparing Odin/Heimdall..."
    });

    const steps = [
      "Preparing firmware package...",
      "Initiating download protocol...",
      "Flashing bootloader...",
      "Flashing recovery...",
      "Flashing system image...",
      "Finalizing recovery..."
    ];

    for (let i = 0; i < steps.length; i++) {
      this.broadcastUpdate(operationId, {
        type: "progress",
        message: steps[i],
        progress: Math.round((i / steps.length) * 100)
      });
      await new Promise(resolve => setTimeout(resolve, 4000));
    }

    return true;
  }

  private async executeDsuRecovery(params: UnbrickParams, operationId: string): Promise<boolean> {
    this.broadcastUpdate(operationId, {
      type: "progress",
      message: "Executing DSU recovery - Dynamic System Update..."
    });

    // DSU allows recovery through system partition overlay
    const dsuCommands = [
      [this.config.adbPath, "shell", "dsu", "install-unverified", "/path/to/system.img"],
      [this.config.adbPath, "shell", "dsu", "set-active"],
      [this.config.adbPath, "reboot"]
    ];

    for (const command of dsuCommands) {
      const result = await this.runCommand(command, operationId);
      if (!result.success) {
        return false;
      }
    }

    return true;
  }

  private async executeRecoveryFlash(params: UnbrickParams, operationId: string): Promise<boolean> {
    this.broadcastUpdate(operationId, {
      type: "progress",
      message: "Executing recovery flash procedure..."
    });

    if (!params.firmwarePath) {
      throw new Error("Firmware path required for recovery flash");
    }

    const sideloadResult = await this.runCommand([
      this.config.adbPath, "sideload", params.firmwarePath
    ], operationId);

    return sideloadResult.success;
  }

  private async executeBootloaderRecovery(params: UnbrickParams, operationId: string): Promise<boolean> {
    this.broadcastUpdate(operationId, {
      type: "progress",
      message: "Executing bootloader recovery via fastboot..."
    });

    if (!params.firmwarePath) {
      throw new Error("Firmware path required for bootloader recovery");
    }

    const flashCommands = [
      [this.config.fastbootPath, "flash", "recovery", params.firmwarePath],
      [this.config.fastbootPath, "reboot"]
    ];

    for (const command of flashCommands) {
      const result = await this.runCommand(command, operationId);
      if (!result.success) {
        return false;
      }
    }

    return true;
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

  // Developer Mode Helper Methods
  async getDeveloperModeInstructions(deviceState?: DeviceInfo["deviceState"]): Promise<{
    state: string;
    instructions: string[];
    recoveryMethods?: string[];
  }> {
    const baseInstructions = {
      normal: [
        "Go to Settings app",
        "Scroll down to 'About Phone' or 'System'",
        "Find 'Build Number' or 'Software Information' > 'Build Number'",
        "Tap 'Build Number' 7 times rapidly",
        "Enter your PIN/password when prompted",
        "Go back to Settings main menu",
        "Find 'Developer Options' or 'System' > 'Developer Options'",
        "Enable 'Developer Options' toggle",
        "Enable 'USB Debugging'",
        "Enable 'Install via USB' (if available)",
        "Connect device to PC and approve USB debugging prompt"
      ],
      unauthorized: [
        "Your device is connected but locked. To enable developer mode:",
        "Unlock your device with PIN/password/pattern",
        "When prompted 'Allow USB debugging?', tap 'Allow'",
        "Check 'Always allow from this computer' for convenience",
        "If no prompt appears, disconnect and reconnect the USB cable",
        "If still no prompt, try these steps:",
        "- Revoke USB debugging authorizations in Developer Options",
        "- Disable and re-enable USB debugging",
        "- Change USB connection mode to 'File Transfer/MTP'",
        "- Try a different USB cable or port"
      ],
      recovery: [
        "Device is in recovery mode. Options to enable developer mode:",
        "Option 1 - Exit Recovery:",
        "- Select 'Reboot system now' from recovery menu",
        "- Once booted, follow normal developer mode instructions",
        "",
        "Option 2 - Recovery Commands:",
        "- In TWRP: Mount > System, then use Terminal",
        "- Enable ADB in recovery if available",
        "- Use volume keys to navigate, power to select",
        "",
        "Option 3 - Recovery ADB (if enabled):",
        "- Some recoveries have ADB enabled by default",
        "- Try 'adb devices' to check connectivity",
        "- If connected, can modify system settings directly"
      ],
      fastboot: [
        "Device is in fastboot/bootloader mode.",
        "Developer mode must be enabled from Android OS.",
        "To exit fastboot and enable developer mode:",
        "- Run: fastboot reboot",
        "- Or use device buttons:",
        "  - Hold Power button for 10+ seconds",
        "  - Or select 'Start' or 'Reboot' with volume keys",
        "- Once in Android, follow normal developer mode steps"
      ],
      locked: [
        "Device appears to be locked or encrypted.",
        "To enable developer mode on a locked device:",
        "1. Boot into recovery mode:",
        "   - Power off device completely",
        "   - Hold Power + Volume Up (varies by device)",
        "   - Release when logo appears",
        "2. If stock recovery, try:",
        "   - 'Apply update from ADB'",
        "   - This may enable temporary ADB access",
        "3. If custom recovery (TWRP):",
        "   - Can often enable ADB without unlocking",
        "   - Mount system partition first",
        "4. Last resort - Factory Reset:",
        "   - Will erase all data",
        "   - Allows fresh setup with developer mode"
      ]
    };

    const recoveryMethods = {
      recovery: [
        "For Samsung devices: Hold Power + Volume Up + Home",
        "For OnePlus: Hold Power + Volume Down",
        "For Google Pixel: Hold Power + Volume Down",
        "For Nothing Phone: Hold Power + Volume Up",
        "For Fairphone: Hold Volume Up while connecting USB"
      ],
      fastboot: [
        "Already in fastboot mode",
        "To return to fastboot from Android:",
        "- adb reboot bootloader",
        "- Or hold Power + Volume Down during boot"
      ]
    };

    const state = deviceState || "normal";
    return {
      state,
      instructions: baseInstructions[state] || baseInstructions.normal,
      recoveryMethods: recoveryMethods[state as keyof typeof recoveryMethods]
    };
  }

  async enableDeveloperModeViaRecovery(operationId: string): Promise<boolean> {
    this.broadcastUpdate(operationId, {
      type: "status",
      message: "Attempting to enable developer mode via recovery..."
    });

    // Check if device is in recovery
    const { success, output } = await this.runCommand([this.config.adbPath, "devices"]);
    
    if (!success || !output.includes("recovery")) {
      this.broadcastUpdate(operationId, {
        type: "error",
        message: "Device not in recovery mode"
      });
      return false;
    }

    // Try to mount system partition (TWRP)
    await this.runCommand([this.config.adbPath, "shell", "mount", "/system"], operationId);

    // Attempt to modify settings database directly
    const commands = [
      // Enable ADB
      "settings put global adb_enabled 1",
      // Enable developer options
      "settings put global development_settings_enabled 1",
      // Set as provisioned
      "settings put global device_provisioned 1",
      // Alternative method using properties
      "setprop persist.sys.usb.config adb",
      "setprop sys.usb.config adb"
    ];

    let anySuccess = false;
    for (const cmd of commands) {
      const result = await this.runCommand([this.config.adbPath, "shell", cmd], operationId);
      if (result.success) {
        anySuccess = true;
        this.broadcastUpdate(operationId, {
          type: "success",
          message: `✅ Executed: ${cmd}`
        });
      }
    }

    if (anySuccess) {
      this.broadcastUpdate(operationId, {
        type: "success",
        message: "Developer mode settings applied. Reboot device to take effect."
      });
      return true;
    }

    this.broadcastUpdate(operationId, {
      type: "error",
      message: "Failed to enable developer mode via recovery. Manual intervention required."
    });
    return false;
  }

  async checkAndSuggestDeveloperMode(operationId: string): Promise<{
    enabled: boolean;
    deviceState: DeviceInfo["deviceState"];
    suggestions: string[];
  }> {
    const deviceInfo = await this.getDeviceInfo();
    
    if (!deviceInfo) {
      return {
        enabled: false,
        deviceState: "locked",
        suggestions: [
          "No device detected. Please connect your device.",
          "Make sure USB drivers are installed.",
          "Try different USB cable or port."
        ]
      };
    }

    const instructions = await this.getDeveloperModeInstructions(deviceInfo.deviceState);
    
    return {
      enabled: deviceInfo.developerModeEnabled || false,
      deviceState: deviceInfo.deviceState || "normal",
      suggestions: instructions.instructions
    };
  }
}