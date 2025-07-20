import express from "express";
import { storage } from "../storage";

const router = express.Router();

// Get all kernel builds
router.get("/builds", async (req, res) => {
  try {
    const builds = await storage.getAllBuilds();
    res.json(builds);
  } catch (error) {
    console.error("Error fetching builds:", error);
    res.status(500).json({ error: "Failed to fetch builds" });
  }
});

// Start a new kernel build
router.post("/build", async (req, res) => {
  try {
    const configuration = req.body;
    
    // Validate required fields
    if (!configuration.device) {
      return res.status(400).json({ error: "Device is required" });
    }

    // Create build job
    const buildJob = await storage.createBuildJob({
      device: configuration.device,
      buildType: configuration.buildType || "nethunter",
      status: "pending",
      progress: 0,
      currentStep: "Initializing build...",
      logs: "",
      configuration: JSON.stringify(configuration),
    });

    res.json(buildJob);
  } catch (error) {
    console.error("Error starting build:", error);
    res.status(500).json({ error: "Failed to start build" });
  }
});

// Cancel a build
router.post("/build/:id/cancel", async (req, res) => {
  try {
    const buildId = parseInt(req.params.id);
    
    await storage.updateBuildJob(buildId, {
      status: "cancelled",
      currentStep: "Build cancelled by user",
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error cancelling build:", error);
    res.status(500).json({ error: "Failed to cancel build" });
  }
});

// Get build details
router.get("/build/:id", async (req, res) => {
  try {
    const buildId = parseInt(req.params.id);
    const build = await storage.getBuildJob(buildId);
    
    if (!build) {
      return res.status(404).json({ error: "Build not found" });
    }

    res.json(build);
  } catch (error) {
    console.error("Error fetching build:", error);
    res.status(500).json({ error: "Failed to fetch build" });
  }
});

export default router;