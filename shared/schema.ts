import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username").unique().notNull(),
  password: varchar("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  
  // Build Process & Toolchain Configuration
  toolchainConfig: jsonb("toolchain_config").$type<{
    compiler: "gcc" | "clang";
    gccVersion: string;
    clangVersion: string;
    enableCcache: boolean;
    ccacheSize: string;
    enableLto: boolean;
    optimizationLevel: "O2" | "O3" | "Os" | "Oz";
    enableDebugInfo: boolean;
  }>().notNull().default({
    compiler: "gcc",
    gccVersion: "12.1.0",
    clangVersion: "15.0.0",
    enableCcache: true,
    ccacheSize: "5G",
    enableLto: false,
    optimizationLevel: "O2",
    enableDebugInfo: false
  }),
  
  // Build Output Configuration
  buildOutputConfig: jsonb("build_output_config").$type<{
    outputFormat: "boot_img" | "kernel_only" | "kernel_modules" | "full_package";
    compressionType: "gzip" | "lz4" | "xz" | "zstd";
    signKernel: boolean;
    signatureKey: string;
    enableVerifiedBoot: boolean;
    customBootArgs: string[];
  }>().notNull().default({
    outputFormat: "boot_img",
    compressionType: "gzip",
    signKernel: false,
    signatureKey: "",
    enableVerifiedBoot: true,
    customBootArgs: []
  }),
  
  // Device Tree Configuration
  deviceTreeConfig: jsonb("device_tree_config").$type<{
    enableDeviceTree: boolean;
    dtbPath: string;
    customDtOverlays: string[];
    hardwareVariant: string;
    boardRevision: string;
  }>().notNull().default({
    enableDeviceTree: true,
    dtbPath: "",
    customDtOverlays: [],
    hardwareVariant: "",
    boardRevision: ""
  }),
  
  // Hardware Driver Configuration
  hardwareConfig: jsonb("hardware_config").$type<{
    cameraDrivers: {
      enableCamera: boolean;
      drivers: string[];
      customConfigs: string[];
    };
    displayDrivers: {
      enableDisplay: boolean;
      panelType: string;
      resolution: string;
      refreshRate: number;
    };
    sensorDrivers: {
      enableSensors: boolean;
      accelerometer: boolean;
      gyroscope: boolean;
      magnetometer: boolean;
      proximity: boolean;
      ambient: boolean;
    };
    audioDrivers: {
      enableAudio: boolean;
      codecType: string;
      customConfigs: string[];
    };
  }>().notNull().default({
    cameraDrivers: { enableCamera: true, drivers: [], customConfigs: [] },
    displayDrivers: { enableDisplay: true, panelType: "", resolution: "", refreshRate: 60 },
    sensorDrivers: { enableSensors: true, accelerometer: true, gyroscope: true, magnetometer: true, proximity: true, ambient: true },
    audioDrivers: { enableAudio: true, codecType: "", customConfigs: [] }
  }),
  
  // Performance Optimization
  performanceConfig: jsonb("performance_config").$type<{
    cpuGovernors: {
      defaultGovernor: string;
      availableGovernors: string[];
      customTuning: Record<string, any>;
    };
    memoryManagement: {
      enableZram: boolean;
      zramSize: string;
      swappiness: number;
      enableKsm: boolean;
    };
    ioScheduler: {
      defaultScheduler: string;
      availableSchedulers: string[];
      customTuning: Record<string, any>;
    };
    thermalManagement: {
      enableThermalControl: boolean;
      throttleTemps: Record<string, number>;
      customZones: string[];
    };
  }>().notNull().default({
    cpuGovernors: { defaultGovernor: "schedutil", availableGovernors: ["ondemand", "performance", "powersave", "conservative", "schedutil"], customTuning: {} },
    memoryManagement: { enableZram: true, zramSize: "1G", swappiness: 60, enableKsm: false },
    ioScheduler: { defaultScheduler: "mq-deadline", availableSchedulers: ["noop", "deadline", "cfq", "mq-deadline"], customTuning: {} },
    thermalManagement: { enableThermalControl: true, throttleTemps: {}, customZones: [] }
  }),
  
  // Security Configuration
  securityConfig: jsonb("security_config").$type<{
    kernelSigning: {
      enableSigning: boolean;
      keyPath: string;
      certPath: string;
      algorithm: string;
    };
    securityPatches: {
      enablePatching: boolean;
      patchLevel: string;
      customPatches: string[];
    };
    vulnerabilityScanning: {
      enableScanning: boolean;
      scanTools: string[];
    };
    buildReproducibility: {
      enableReproducible: boolean;
      timestamp: string;
      buildId: string;
    };
  }>().notNull().default({
    kernelSigning: { enableSigning: false, keyPath: "", certPath: "", algorithm: "sha256" },
    securityPatches: { enablePatching: true, patchLevel: "latest", customPatches: [] },
    vulnerabilityScanning: { enableScanning: false, scanTools: [] },
    buildReproducibility: { enableReproducible: false, timestamp: "", buildId: "" }
  }),
  
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

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
export type InsertKernelConfiguration = z.infer<typeof insertKernelConfigurationSchema>;
export type KernelConfiguration = typeof kernelConfigurations.$inferSelect;
export type InsertBuildJob = z.infer<typeof insertBuildJobSchema>;
export type BuildJob = typeof buildJobs.$inferSelect;

// Device presets organized by manufacturer and series
export const devicePresets = {
  // OnePlus One
  oneplus_one: {
    device: "OnePlus One",
    codename: "bacon",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_msm8974.git",
    kernelBranch: "oneplus/QC8974_KK_3.4",
    kernelArch: "arm",
    kernelCrossCompile: "arm-linux-gnueabihf-",
    defconfigFilenameTemplate: "arch/arm/configs/{codename}_defconfig",
    category: "OnePlus Legacy",
  },

  // OnePlus 2 Series
  oneplus_2: {
    device: "OnePlus 2",
    codename: "oneplus2",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_msm8994.git",
    kernelBranch: "oneplus/QC8994_M_6.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 2 Series",
  },

  // OnePlus 3 Series
  oneplus_3: {
    device: "OnePlus 3",
    codename: "oneplus3",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_msm8996.git",
    kernelBranch: "oneplus/QC8996_N_7.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 3 Series",
  },
  oneplus_3t: {
    device: "OnePlus 3T",
    codename: "oneplus3t",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_msm8996.git",
    kernelBranch: "oneplus/QC8996_N_7.0_3T",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 3 Series",
  },

  // OnePlus 5 Series
  oneplus_5: {
    device: "OnePlus 5",
    codename: "cheeseburger",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_msm8998.git",
    kernelBranch: "oneplus/QC8998_O_8.1_Beta",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 5 Series",
  },
  oneplus_5t: {
    device: "OnePlus 5T",
    codename: "dumpling",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_msm8998.git",
    kernelBranch: "oneplus/QC8998_O_8.1_5T",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 5 Series",
  },

  // OnePlus 6 Series
  oneplus_6: {
    device: "OnePlus 6",
    codename: "enchilada",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sdm845.git",
    kernelBranch: "oneplus/SM8150_Q_10.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 6 Series",
  },
  oneplus_6t: {
    device: "OnePlus 6T",
    codename: "fajita",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sdm845.git",
    kernelBranch: "oneplus/SM8150_Q_10.0_6T",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 6 Series",
  },

  // OnePlus 7 Series
  oneplus_7: {
    device: "OnePlus 7",
    codename: "guacamoleb",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm8150.git",
    kernelBranch: "oneplus/SM8150_Q_10.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 7 Series",
  },
  oneplus_7_pro: {
    device: "OnePlus 7 Pro",
    codename: "guacamole",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm8150.git",
    kernelBranch: "oneplus/SM8150_Q_10.0_7Pro",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 7 Series",
  },
  oneplus_7t: {
    device: "OnePlus 7T",
    codename: "hotdogb",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm8150.git",
    kernelBranch: "oneplus/SM8150_Q_10.0_7T",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 7 Series",
  },
  oneplus_7t_pro: {
    device: "OnePlus 7T Pro",
    codename: "hotdog",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm8150.git",
    kernelBranch: "oneplus/SM8150_Q_10.0_7TPro",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 7 Series",
  },

  // OnePlus 8 Series
  oneplus_8: {
    device: "OnePlus 8",
    codename: "instantnoodle",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm8250.git",
    kernelBranch: "oneplus/SM8250_R_11.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 8 Series",
  },
  oneplus_8_pro: {
    device: "OnePlus 8 Pro",
    codename: "instantnoodlep",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm8250.git",
    kernelBranch: "oneplus/SM8250_R_11.0_8Pro",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 8 Series",
  },
  oneplus_8t: {
    device: "OnePlus 8T",
    codename: "kebab",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm8250.git",
    kernelBranch: "oneplus/SM8250_R_11.0_8T",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 8 Series",
  },

  // OnePlus 9 Series
  oneplus_9: {
    device: "OnePlus 9",
    codename: "lemonade",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm8350.git",
    kernelBranch: "oneplus/SM8350_S_12.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 9 Series",
  },
  oneplus_9_pro: {
    device: "OnePlus 9 Pro",
    codename: "lemonadep",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm8350.git",
    kernelBranch: "oneplus/SM8350_S_12.0_9Pro",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 9 Series",
  },
  oneplus_9rt: {
    device: "OnePlus 9RT",
    codename: "martini",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm8350.git",
    kernelBranch: "oneplus/SM8350_S_12.0_9RT",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 9 Series",
  },

  // OnePlus 10 Series
  oneplus_10_pro: {
    device: "OnePlus 10 Pro",
    codename: "ovaltine",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm8450.git",
    kernelBranch: "oneplus/SM8450_T_13.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 10 Series",
  },
  oneplus_10t: {
    device: "OnePlus 10T",
    codename: "cupida",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm8450.git",
    kernelBranch: "oneplus/SM8450_T_13.0_10T",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 10 Series",
  },

  // OnePlus 11 Series
  oneplus_11: {
    device: "OnePlus 11",
    codename: "salami",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm8550.git",
    kernelBranch: "oneplus/SM8550_U_14.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 11 Series",
  },

  // OnePlus 12 Series
  oneplus_12: {
    device: "OnePlus 12",
    codename: "pineapple",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm8650.git",
    kernelBranch: "oneplus/SM8650_U_14.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus 12 Series",
  },

  // OnePlus Nord Series
  oneplus_nord: {
    device: "OnePlus Nord",
    codename: "avicii",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm7250.git",
    kernelBranch: "oneplus/SM7250_R_11.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus Nord Series",
  },
  oneplus_nord_2: {
    device: "OnePlus Nord 2",
    codename: "denniz",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_mt6893.git",
    kernelBranch: "oneplus/MT6893_S_12.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus Nord Series",
  },
  oneplus_nord_2t: {
    device: "OnePlus Nord 2T",
    codename: "dre",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_mt6893.git",
    kernelBranch: "oneplus/MT6893_S_12.0_2T",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus Nord Series",
  },
  oneplus_nord_3: {
    device: "OnePlus Nord 3",
    codename: "larry",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_mt6983.git",
    kernelBranch: "oneplus/MT6983_T_13.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "OnePlus Nord Series",
  },

  // Nothing Phone Series
  nothing_phone_1: {
    device: "Nothing Phone (1)",
    codename: "spacewar",
    kernelRepo: "https://github.com/Nothing-Developer-Programme/android_kernel_nothing_sm7325.git",
    kernelBranch: "nothing/SM7325_S_12.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "Nothing Phone Series",
  },
  nothing_phone_2: {
    device: "Nothing Phone (2)",
    codename: "pong",
    kernelRepo: "https://github.com/Nothing-Developer-Programme/android_kernel_nothing_sm8550.git",
    kernelBranch: "nothing/SM8550_T_13.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "Nothing Phone Series",
  },
  nothing_phone_2a: {
    device: "Nothing Phone (2a)",
    codename: "pacman",
    kernelRepo: "https://github.com/Nothing-Developer-Programme/android_kernel_nothing_mt6886.git",
    kernelBranch: "nothing/MT6886_U_14.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "Nothing Phone Series",
  },

  // Fairphone Series
  fairphone_4: {
    device: "Fairphone 4",
    codename: "FP4",
    kernelRepo: "https://github.com/FairphoneMirrors/android_kernel_fairphone_sm7225.git",
    kernelBranch: "fairphone/SM7225_R_11.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "Fairphone Series",
  },
  fairphone_5: {
    device: "Fairphone 5",
    codename: "FP5",
    kernelRepo: "https://github.com/FairphoneMirrors/android_kernel_fairphone_qcm6490.git",
    kernelBranch: "fairphone/QCM6490_T_13.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "Fairphone Series",
  },

  // PinePhone Series
  pinephone: {
    device: "PinePhone",
    codename: "pinephone",
    kernelRepo: "https://github.com/megous/linux.git",
    kernelBranch: "orange-pi-6.1",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "PinePhone Series",
  },
  pinephone_pro: {
    device: "PinePhone Pro",
    codename: "pinephonepro",
    kernelRepo: "https://github.com/megous/linux.git",
    kernelBranch: "pp-6.4",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "PinePhone Series",
  },

  // LineageOS Targets (Popular devices with LineageOS support)
  lineage_bacon: {
    device: "OnePlus One (LineageOS)",
    codename: "bacon",
    kernelRepo: "https://github.com/LineageOS/android_kernel_oneplus_msm8974.git",
    kernelBranch: "lineage-18.1",
    kernelArch: "arm",
    kernelCrossCompile: "arm-linux-gnueabihf-",
    defconfigFilenameTemplate: "arch/arm/configs/{codename}_defconfig",
    category: "LineageOS Database",
  },
  lineage_enchilada: {
    device: "OnePlus 6 (LineageOS)",
    codename: "enchilada",
    kernelRepo: "https://github.com/LineageOS/android_kernel_oneplus_sdm845.git",
    kernelBranch: "lineage-20.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "LineageOS Database",
  },
  lineage_fajita: {
    device: "OnePlus 6T (LineageOS)",
    codename: "fajita",
    kernelRepo: "https://github.com/LineageOS/android_kernel_oneplus_sdm845.git",
    kernelBranch: "lineage-20.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "LineageOS Database",
  },
  lineage_guacamole: {
    device: "OnePlus 7 Pro (LineageOS)",
    codename: "guacamole",
    kernelRepo: "https://github.com/LineageOS/android_kernel_oneplus_sm8150.git",
    kernelBranch: "lineage-20.0",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "LineageOS Database",
  },

  // Custom entry for manual configuration
  custom: {
    device: "",
    codename: "",
    kernelRepo: "",
    kernelBranch: "",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    category: "Custom",
  }
} as const;

export type DevicePreset = keyof typeof devicePresets;
