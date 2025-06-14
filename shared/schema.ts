import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const kernelConfigurations = pgTable("kernel_configurations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  device: text("device").notNull(),
  codename: text("codename").notNull(),
  kernelRepo: text("kernel_repo").notNull(),
  kernelBranch: text("kernel_branch").notNull(),
  nethunterPatchesRepo: text("nethunter_patches_repo").notNull(),
  nethunterPatchesBranch: text("nethunter_patches_branch").notNull(),
  nethunterPatchesDirRelative: text("nethunter_patches_dir_relative").notNull(),
  gitPatchLevel: text("git_patch_level").notNull().default("1"),
  outputDir: text("output_dir").notNull(),
  defconfigFilenameTemplate: text("defconfig_filename_template").notNull(),
  kernelArch: text("kernel_arch").notNull().default("arm64"),
  kernelCrossCompile: text("kernel_cross_compile").notNull(),
  kernelImageNamePatterns: text("kernel_image_name_patterns").array().notNull(),
  features: jsonb("features").$type<{
    // NetHunter Core Features
    wifiMonitorMode: boolean;
    usbGadget: boolean;
    hidSupport: boolean;
    rtl8812auDriver: boolean;
    
    // Advanced NetHunter Features
    packetInjection: boolean;
    badUSB: boolean;
    wirelessKeylogger: boolean;
    bluetoothArsenal: boolean;
    nfcHacking: boolean;
    sdrSupport: boolean;
    rfAnalyzer: boolean;
    
    // Wireless Drivers
    rtl88xxauDriver: boolean;
    rt2800usbDriver: boolean;
    rt73usbDriver: boolean;
    zd1211rwDriver: boolean;
    ath9kHtcDriver: boolean;
    
    // Root & Security
    kernelSU: boolean;
    magiskIntegration: boolean;
    selinuxPermissive: boolean;
    dmVerityDisable: boolean;
    
    // Performance & Debugging
    kprobeSupport: boolean;
    ftracingSupport: boolean;
    perfCounters: boolean;
    cpuGovernors: boolean;
    
    // Custom Recovery Support
    twrpSupport: boolean;
    recoveryRamdisk: boolean;
  }>().notNull(),
  customKernelConfigs: text("custom_kernel_configs").array().notNull().default([]),
  wslDistroName: text("wsl_distro_name").notNull().default("kali-linux"),
  skipOptions: jsonb("skip_options").$type<{
    skipEnvSetup: boolean;
    skipClone: boolean;
    skipPatches: boolean;
    skipConfigTweaks: boolean;
    skipBuild: boolean;
    cleanOutput: boolean;
  }>().notNull(),
  magiskConfig: jsonb("magisk_config").$type<{
    enabled: boolean;
    version: string;
    hideRoot: boolean;
    zygiskEnabled: boolean;
    denyListEnabled: boolean;
    modules: string[];
  }>().notNull().default({ enabled: false, version: "latest", hideRoot: true, zygiskEnabled: true, denyListEnabled: true, modules: [] }),
  twrpConfig: jsonb("twrp_config").$type<{
    enabled: boolean;
    version: string;
    theme: string;
    encryption: boolean;
    touchSupport: boolean;
    customFlags: string[];
  }>().notNull().default({ enabled: false, version: "latest", theme: "portrait_hdpi", encryption: true, touchSupport: true, customFlags: [] }),
  kernelSUConfig: jsonb("kernelsu_config").$type<{
    enabled: boolean;
    version: string;
    managerApp: boolean;
    webUI: boolean;
    safeMode: boolean;
    logLevel: string;
  }>().notNull().default({ enabled: false, version: "latest", managerApp: true, webUI: false, safeMode: true, logLevel: "info" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const buildJobs = pgTable("build_jobs", {
  id: serial("id").primaryKey(),
  configurationId: integer("configuration_id").references(() => kernelConfigurations.id).notNull(),
  status: text("status", { enum: ["pending", "running", "completed", "failed", "cancelled"] }).notNull().default("pending"),
  currentStep: text("current_step").notNull().default(""),
  progress: integer("progress").notNull().default(0),
  logs: text("logs").notNull().default(""),
  errorMessage: text("error_message"),
  outputFiles: text("output_files").array().notNull().default([]),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertKernelConfigurationSchema = createInsertSchema(kernelConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBuildJobSchema = createInsertSchema(buildJobs).omit({
  id: true,
  createdAt: true,
  startedAt: true,
  completedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertKernelConfiguration = z.infer<typeof insertKernelConfigurationSchema>;
export type KernelConfiguration = typeof kernelConfigurations.$inferSelect;
export type InsertBuildJob = z.infer<typeof insertBuildJobSchema>;
export type BuildJob = typeof buildJobs.$inferSelect;

// Device presets
export const devicePresets = {
  oneplus_nord: {
    device: "oneplus_nord",
    codename: "avicii",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm7250.git",
    kernelBranch: "android-10.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
  },
  pixel_4: {
    device: "pixel_4",
    codename: "flame",
    kernelRepo: "https://github.com/LineageOS/android_kernel_google_msm-4.14.git",
    kernelBranch: "lineage-17.1",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
  },
  custom: {
    device: "",
    codename: "",
    kernelRepo: "",
    kernelBranch: "",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
  }
} as const;

export type DevicePreset = keyof typeof devicePresets;
