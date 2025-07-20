import { EventEmitter } from "events";

export interface TWRPBuildConfig {
  deviceCodename: string;
  theme: string;
  version: string;
  colorScheme: string;
  buildName?: string;
  features: {
    encryption: boolean;
    mtp: boolean;
    adb: boolean;
    terminal: boolean;
    fastboot: boolean;
    magisk: boolean;
    backup: boolean;
    customCommands: boolean;
  };
  customFlags?: string[];
}

export interface TWRPBuildJob {
  id: string;
  config: TWRPBuildConfig;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  currentStep: string;
  progress: number;
  logs: string;
  errorMessage?: string;
  startedAt?: Date;
  completedAt?: Date;
  outputFiles?: string[];
}

export class TWRPBuilder extends EventEmitter {
  private builds = new Map<string, TWRPBuildJob>();

  async startBuild(config: TWRPBuildConfig): Promise<string> {
    const buildId = `twrp_${config.deviceCodename}_${Date.now()}`;
    
    const job: TWRPBuildJob = {
      id: buildId,
      config,
      status: "pending",
      currentStep: "Initializing",
      progress: 0,
      logs: "",
      startedAt: new Date()
    };

    this.builds.set(buildId, job);
    this.emit("buildCreated", job);

    // Start build process asynchronously
    this.processBuild(buildId);

    return buildId;
  }

  private async processBuild(buildId: string): Promise<void> {
    const job = this.builds.get(buildId);
    if (!job) return;

    try {
      // Update status to running
      job.status = "running";
      this.emit("buildUpdated", job);

      // Simulate TWRP build steps
      const steps = [
        { name: "Setting up build environment", duration: 5000 },
        { name: "Cloning TWRP source", duration: 8000 },
        { name: "Applying device-specific patches", duration: 3000 },
        { name: "Configuring build flags", duration: 2000 },
        { name: "Applying theme customizations", duration: 4000 },
        { name: "Compiling recovery image", duration: 15000 },
        { name: "Packaging output files", duration: 3000 },
        { name: "Finalizing build", duration: 2000 }
      ];

      let totalProgress = 0;
      const progressIncrement = 100 / steps.length;

      for (const step of steps) {
        job.currentStep = step.name;
        job.logs += `[${new Date().toISOString()}] Starting: ${step.name}\n`;
        this.emit("buildUpdated", job);

        // Simulate step execution
        await this.delay(step.duration);

        totalProgress += progressIncrement;
        job.progress = Math.round(totalProgress);
        job.logs += `[${new Date().toISOString()}] Completed: ${step.name}\n`;
        this.emit("buildUpdated", job);
      }

      // Complete the build
      job.status = "completed";
      job.currentStep = "Build completed successfully";
      job.progress = 100;
      job.completedAt = new Date();
      job.outputFiles = [
        `${job.config.deviceCodename}_twrp_${job.config.version}.img`,
        `${job.config.deviceCodename}_twrp_${job.config.version}.zip`
      ];
      job.logs += `[${new Date().toISOString()}] Build completed successfully!\n`;
      job.logs += `Output files: ${job.outputFiles.join(", ")}\n`;

      this.emit("buildCompleted", job);

    } catch (error) {
      job.status = "failed";
      job.errorMessage = error instanceof Error ? error.message : "Unknown error";
      job.completedAt = new Date();
      job.logs += `[${new Date().toISOString()}] ERROR: ${job.errorMessage}\n`;
      this.emit("buildFailed", job);
    }
  }

  async cancelBuild(buildId: string): Promise<boolean> {
    const job = this.builds.get(buildId);
    if (!job || job.status === "completed" || job.status === "failed") {
      return false;
    }

    job.status = "cancelled";
    job.currentStep = "Build cancelled by user";
    job.completedAt = new Date();
    job.logs += `[${new Date().toISOString()}] Build cancelled by user\n`;
    
    this.emit("buildCancelled", job);
    return true;
  }

  getBuildStatus(buildId: string): TWRPBuildJob | undefined {
    return this.builds.get(buildId);
  }

  getAllBuilds(): TWRPBuildJob[] {
    return Array.from(this.builds.values()).sort(
      (a, b) => (b.startedAt?.getTime() || 0) - (a.startedAt?.getTime() || 0)
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const twrpBuilder = new TWRPBuilder();