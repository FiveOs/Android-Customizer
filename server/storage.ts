import { users, kernelConfigurations, buildJobs, type User, type InsertUser, type KernelConfiguration, type InsertKernelConfiguration, type BuildJob, type InsertBuildJob } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Kernel Configurations
  getKernelConfiguration(id: number): Promise<KernelConfiguration | undefined>;
  getKernelConfigurations(): Promise<KernelConfiguration[]>;
  createKernelConfiguration(config: InsertKernelConfiguration): Promise<KernelConfiguration>;
  updateKernelConfiguration(id: number, config: Partial<InsertKernelConfiguration>): Promise<KernelConfiguration | undefined>;
  deleteKernelConfiguration(id: number): Promise<boolean>;

  // Build Jobs
  getBuildJob(id: number): Promise<BuildJob | undefined>;
  getBuildJobs(): Promise<BuildJob[]>;
  getBuildJobsByConfiguration(configurationId: number): Promise<BuildJob[]>;
  createBuildJob(job: InsertBuildJob): Promise<BuildJob>;
  updateBuildJob(id: number, job: Partial<InsertBuildJob>): Promise<BuildJob | undefined>;
  deleteBuildJob(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getKernelConfiguration(id: number): Promise<KernelConfiguration | undefined> {
    const [config] = await db.select().from(kernelConfigurations).where(eq(kernelConfigurations.id, id));
    return config || undefined;
  }

  async getKernelConfigurations(): Promise<KernelConfiguration[]> {
    return await db.select().from(kernelConfigurations);
  }

  async createKernelConfiguration(config: InsertKernelConfiguration): Promise<KernelConfiguration> {
    const [kernelConfig] = await db
      .insert(kernelConfigurations)
      .values(config)
      .returning();
    return kernelConfig;
  }

  async updateKernelConfiguration(id: number, config: Partial<InsertKernelConfiguration>): Promise<KernelConfiguration | undefined> {
    const [updated] = await db
      .update(kernelConfigurations)
      .set({ ...config, updatedAt: new Date() })
      .where(eq(kernelConfigurations.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteKernelConfiguration(id: number): Promise<boolean> {
    const result = await db.delete(kernelConfigurations).where(eq(kernelConfigurations.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getBuildJob(id: number): Promise<BuildJob | undefined> {
    const [buildJob] = await db.select().from(buildJobs).where(eq(buildJobs.id, id));
    return buildJob || undefined;
  }

  async getBuildJobs(): Promise<BuildJob[]> {
    return await db.select().from(buildJobs);
  }

  async getBuildJobsByConfiguration(configurationId: number): Promise<BuildJob[]> {
    return await db.select().from(buildJobs).where(eq(buildJobs.configurationId, configurationId));
  }

  async createBuildJob(job: InsertBuildJob): Promise<BuildJob> {
    const [buildJob] = await db
      .insert(buildJobs)
      .values(job)
      .returning();
    return buildJob;
  }

  async updateBuildJob(id: number, job: Partial<InsertBuildJob>): Promise<BuildJob | undefined> {
    const updateData: any = { ...job };
    
    // Set timestamps based on status changes
    if (job.status === "running" && !updateData.startedAt) {
      updateData.startedAt = new Date();
    }
    if ((job.status === "completed" || job.status === "failed" || job.status === "cancelled") && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    const [updated] = await db
      .update(buildJobs)
      .set(updateData)
      .where(eq(buildJobs.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteBuildJob(id: number): Promise<boolean> {
    const result = await db.delete(buildJobs).where(eq(buildJobs.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private kernelConfigurations: Map<number, KernelConfiguration>;
  private buildJobs: Map<number, BuildJob>;
  private currentUserId: number;
  private currentConfigId: number;
  private currentJobId: number;

  constructor() {
    this.users = new Map();
    this.kernelConfigurations = new Map();
    this.buildJobs = new Map();
    this.currentUserId = 1;
    this.currentConfigId = 1;
    this.currentJobId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getKernelConfiguration(id: number): Promise<KernelConfiguration | undefined> {
    return this.kernelConfigurations.get(id);
  }

  async getKernelConfigurations(): Promise<KernelConfiguration[]> {
    return Array.from(this.kernelConfigurations.values());
  }

  async createKernelConfiguration(config: InsertKernelConfiguration): Promise<KernelConfiguration> {
    const id = this.currentConfigId++;
    const now = new Date();
    const kernelConfig: KernelConfiguration = {
      ...config,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.kernelConfigurations.set(id, kernelConfig);
    return kernelConfig;
  }

  async updateKernelConfiguration(id: number, config: Partial<InsertKernelConfiguration>): Promise<KernelConfiguration | undefined> {
    const existing = this.kernelConfigurations.get(id);
    if (!existing) return undefined;

    const updated: KernelConfiguration = {
      ...existing,
      ...config,
      updatedAt: new Date(),
    };
    this.kernelConfigurations.set(id, updated);
    return updated;
  }

  async deleteKernelConfiguration(id: number): Promise<boolean> {
    return this.kernelConfigurations.delete(id);
  }

  async getBuildJob(id: number): Promise<BuildJob | undefined> {
    return this.buildJobs.get(id);
  }

  async getBuildJobs(): Promise<BuildJob[]> {
    return Array.from(this.buildJobs.values());
  }

  async getBuildJobsByConfiguration(configurationId: number): Promise<BuildJob[]> {
    return Array.from(this.buildJobs.values()).filter(
      job => job.configurationId === configurationId
    );
  }

  async createBuildJob(job: InsertBuildJob): Promise<BuildJob> {
    const id = this.currentJobId++;
    const now = new Date();
    const buildJob: BuildJob = {
      ...job,
      id,
      createdAt: now,
      startedAt: null,
      completedAt: null,
    };
    this.buildJobs.set(id, buildJob);
    return buildJob;
  }

  async updateBuildJob(id: number, job: Partial<InsertBuildJob>): Promise<BuildJob | undefined> {
    const existing = this.buildJobs.get(id);
    if (!existing) return undefined;

    const updated: BuildJob = {
      ...existing,
      ...job,
    };

    // Set timestamps based on status changes
    if (job.status === "running" && !existing.startedAt) {
      updated.startedAt = new Date();
    }
    if ((job.status === "completed" || job.status === "failed" || job.status === "cancelled") && !existing.completedAt) {
      updated.completedAt = new Date();
    }

    this.buildJobs.set(id, updated);
    return updated;
  }

  async deleteBuildJob(id: number): Promise<boolean> {
    return this.buildJobs.delete(id);
  }
}

export const storage = new DatabaseStorage();
