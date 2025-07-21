import express from "express";
import session from "express-session";
import { setupVite, serveStatic, log } from "./vite";
import connectPg from "connect-pg-simple";
import Stripe from "stripe";
import bcrypt from "bcrypt";
import { createServer } from "http";
import { WebSocketServer } from "ws";

const app = express();
const httpServer = createServer(app);

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Trust proxy for Replit
app.set("trust proxy", 1);

// Setup session with database storage
const pgStore = connectPg(session);
const sessionStore = new pgStore({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: true,
  ttl: 7 * 24 * 60 * 60, // 1 week
});

app.use(session({
  secret: process.env.SESSION_SECRET!,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
  },
}));

// Basic auth middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.session?.userId) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Mock storage for now to get the app running
const mockStorage = {
  users: new Map(),
  
  async getUserByUsername(username: string) {
    for (const [id, user] of this.users) {
      if (user.username === username) return { id, ...user };
    }
    return null;
  },
  
  async createUser(userData: any) {
    const id = crypto.randomUUID();
    const user = {
      id,
      username: userData.username,
      password: userData.password,
      email: userData.email || null,
      subscriptionPlan: "free",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  },
  
  async getUser(id: string) {
    const user = this.users.get(id);
    return user ? { id, ...user } : null;
  }
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }
    
    const existingUser = await mockStorage.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await mockStorage.createUser({ 
      username, 
      password: hashedPassword,
      email 
    });
    
    (req.session as any).userId = user.id;
    res.status(201).json({ 
      id: user.id, 
      username: user.username,
      subscriptionPlan: user.subscriptionPlan 
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = await mockStorage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    (req.session as any).userId = user.id;
    res.json({ 
      id: user.id, 
      username: user.username,
      subscriptionPlan: user.subscriptionPlan 
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

app.post('/api/logout', (req, res) => {
  req.session?.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

app.get('/api/user', async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await mockStorage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ 
      id: user.id, 
      username: user.username,
      subscriptionPlan: user.subscriptionPlan 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// Stripe subscription routes
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount, plan } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: { plan },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating payment intent: " + error.message });
  }
});

// Device presets API
app.get('/api/device-presets', (req, res) => {
  const devicePresets = {
    // OnePlus devices
    oneplus_one: { device: "OnePlus One", codename: "bacon", category: "OnePlus Legacy" },
    oneplus_7: { device: "OnePlus 7", codename: "guacamoleb", category: "OnePlus 7 Series" },
    oneplus_7_pro: { device: "OnePlus 7 Pro", codename: "guacamole", category: "OnePlus 7 Series" },
    oneplus_nord: { device: "OnePlus Nord", codename: "avicii", category: "OnePlus Nord Series" },
    
    // Google devices
    pixel_7: { device: "Google Pixel 7", codename: "panther", category: "Google Pixel" },
    pixel_7_pro: { device: "Google Pixel 7 Pro", codename: "cheetah", category: "Google Pixel" },
    
    // Nothing devices
    nothing_phone_1: { device: "Nothing Phone (1)", codename: "spacewar", category: "Nothing" },
    nothing_phone_2: { device: "Nothing Phone (2)", codename: "pong", category: "Nothing" },
    
    // Fairphone
    fairphone_4: { device: "Fairphone 4", codename: "FP4", category: "Fairphone" },
    fairphone_5: { device: "Fairphone 5", codename: "FP5", category: "Fairphone" },
  };
  
  res.json(devicePresets);
});

async function startServer() {
  // Setup WebSocket for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  const PORT = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(PORT, "0.0.0.0", () => {
    log(`Android Customizer v2.1.0 running on port ${PORT}`, "express");
    console.log(`🚀 Server ready with authentication and subscriptions`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});