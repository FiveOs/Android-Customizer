import express from "express";
import { storage } from "../storage";

const router = express.Router();

// Get all TWRP builds
router.get("/builds", async (req, res) => {
  try {
    const builds = await storage.getAllTWRPBuilds();
    res.json(builds);
  } catch (error) {
    console.error("Error fetching TWRP builds:", error);
    res.status(500).json({ error: "Failed to fetch TWRP builds" });
  }
});

// Start a new TWRP build
router.post("/build", async (req, res) => {
  try {
    const configuration = req.body;
    
    // Validate required fields
    if (!configuration.device) {
      return res.status(400).json({ error: "Device is required" });
    }

    // Create TWRP build job
    const buildJob = await storage.createTWRPBuildJob({
      device: configuration.device,
      theme: configuration.theme || "dark",
      status: "pending",
      progress: 0,
      currentStep: "Initializing TWRP build...",
      logs: "",
      configuration: JSON.stringify(configuration),
    });

    res.json(buildJob);
  } catch (error) {
    console.error("Error starting TWRP build:", error);
    res.status(500).json({ error: "Failed to start TWRP build" });
  }
});

// Cancel a TWRP build
router.post("/build/:id/cancel", async (req, res) => {
  try {
    const buildId = parseInt(req.params.id);
    
    await storage.updateTWRPBuildJob(buildId, {
      status: "cancelled",
      currentStep: "TWRP build cancelled by user",
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error cancelling TWRP build:", error);
    res.status(500).json({ error: "Failed to cancel TWRP build" });
  }
});

export default router;