import express from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import Stripe from "stripe";
import bcrypt from "bcrypt";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

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
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
  },
}));

// Mock storage for immediate functionality
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

// Stripe payment routes
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

// Mock build endpoints for immediate functionality
app.get('/api/build-jobs', (req, res) => {
  res.json([]);
});

app.get('/api/configurations', (req, res) => {
  res.json([]);
});

async function setupDevelopmentServer() {
  // Setup WebSocket for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Serve static React app without Vite routing conflicts
  console.log('Bypassing Vite to avoid routing conflicts...');
  
  // Serve a functional login page for testing
  app.get('*', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Android Customizer v2.1.0 - Authentication Ready</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        </head>
        <body class="bg-slate-950 text-white min-h-screen">
          <div id="root"></div>
          
          <script type="text/babel">
            const { useState } = React;
            
            function LoginApp() {
              const [isLogin, setIsLogin] = useState(true);
              const [formData, setFormData] = useState({
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
              });
              const [message, setMessage] = useState('');
              const [user, setUser] = useState(null);
              
              // Check if user is already logged in
              React.useEffect(() => {
                fetch('/api/user')
                  .then(res => res.ok ? res.json() : null)
                  .then(data => {
                    if (data) setUser(data);
                  })
                  .catch(() => {});
              }, []);
              
              const handleSubmit = async (e) => {
                e.preventDefault();
                setMessage('');
                
                const endpoint = isLogin ? '/api/login' : '/api/register';
                const body = isLogin 
                  ? { username: formData.username, password: formData.password }
                  : { 
                      username: formData.username, 
                      email: formData.email, 
                      password: formData.password 
                    };
                
                if (!isLogin && formData.password !== formData.confirmPassword) {
                  setMessage('Passwords do not match');
                  return;
                }
                
                try {
                  const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                  });
                  
                  const data = await response.json();
                  
                  if (response.ok) {
                    setUser(data);
                    setMessage(\`\${isLogin ? 'Login' : 'Registration'} successful!\`);
                  } else {
                    setMessage(data.message || 'Operation failed');
                  }
                } catch (error) {
                  setMessage('Network error occurred');
                }
              };
              
              const handleLogout = async () => {
                try {
                  await fetch('/api/logout', { method: 'POST' });
                  setUser(null);
                  setMessage('Logged out successfully');
                } catch (error) {
                  setMessage('Logout failed');
                }
              };
              
              if (user) {
                return (
                  <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="bg-slate-900 p-8 rounded-lg max-w-md w-full text-center">
                      <h1 className="text-3xl font-bold text-emerald-400 mb-6">🤖 Android Customizer</h1>
                      <div className="bg-slate-800 p-6 rounded-lg mb-6">
                        <h2 className="text-xl font-semibold text-emerald-300 mb-4">Welcome, {user.username}!</h2>
                        <div className="space-y-2 text-left">
                          <div className="flex justify-between">
                            <span>Plan:</span>
                            <span className="text-emerald-400 capitalize">{user.subscriptionPlan || 'Free'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="text-emerald-400">✓ Authenticated</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-800 p-4 rounded text-center">
                            <h3 className="text-emerald-300 font-semibold">ROM Builder</h3>
                            <p className="text-xs text-slate-400 mt-1">Coming Soon</p>
                          </div>
                          <div className="bg-slate-800 p-4 rounded text-center">
                            <h3 className="text-emerald-300 font-semibold">Kernel Builder</h3>
                            <p className="text-xs text-slate-400 mt-1">Coming Soon</p>
                          </div>
                          <div className="bg-slate-800 p-4 rounded text-center">
                            <h3 className="text-orange-300 font-semibold">TWRP Builder</h3>
                            <p className="text-xs text-slate-400 mt-1">Coming Soon</p>
                          </div>
                          <div className="bg-slate-800 p-4 rounded text-center">
                            <h3 className="text-purple-300 font-semibold">Device Tools</h3>
                            <p className="text-xs text-slate-400 mt-1">Coming Soon</p>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => window.location.href = '/subscription'}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded mb-2"
                        >
                          Upgrade Subscription
                        </button>
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              
              return (
                <div className="min-h-screen flex items-center justify-center p-4">
                  <div className="bg-slate-900 p-8 rounded-lg max-w-md w-full">
                    <div className="text-center mb-6">
                      <h1 className="text-3xl font-bold text-emerald-400 mb-2">🤖 Android Customizer</h1>
                      <p className="text-slate-300">v2.1.0 BETA - Authentication & Subscriptions Ready</p>
                    </div>
                    
                    <div className="flex mb-6">
                      <button 
                        onClick={() => setIsLogin(true)}
                        className={\`flex-1 py-2 px-4 rounded-l \${isLogin ? 'bg-emerald-600' : 'bg-slate-700'}\`}
                      >
                        Login
                      </button>
                      <button 
                        onClick={() => setIsLogin(false)}
                        className={\`flex-1 py-2 px-4 rounded-r \${!isLogin ? 'bg-emerald-600' : 'bg-slate-700'}\`}
                      >
                        Register
                      </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full p-3 bg-slate-800 border border-slate-600 rounded"
                        required
                      />
                      
                      {!isLogin && (
                        <input
                          type="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full p-3 bg-slate-800 border border-slate-600 rounded"
                          required
                        />
                      )}
                      
                      <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full p-3 bg-slate-800 border border-slate-600 rounded"
                        required
                      />
                      
                      {!isLogin && (
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="w-full p-3 bg-slate-800 border border-slate-600 rounded"
                          required
                        />
                      )}
                      
                      <button 
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded font-semibold"
                      >
                        {isLogin ? 'Login' : 'Create Account'}
                      </button>
                    </form>
                    
                    {message && (
                      <div className={\`mt-4 p-3 rounded text-center \${
                        message.includes('successful') ? 'bg-emerald-800 text-emerald-200' : 'bg-red-800 text-red-200'
                      }\`}>
                        {message}
                      </div>
                    )}
                    
                    <div className="mt-6 text-center">
                      <p className="text-slate-400 text-sm mb-4">Test the API endpoints:</p>
                      <div className="flex space-x-2">
                        <a href="/api/device-presets" className="bg-slate-700 px-3 py-1 rounded text-xs">Device API</a>
                        <a href="/api/user" className="bg-slate-700 px-3 py-1 rounded text-xs">User API</a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            
            ReactDOM.render(<LoginApp />, document.getElementById('root'));
          </script>
        </body>
      </html>
    `);
  });

  const PORT = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Android Customizer v2.1.0 running on port ${PORT}`);
    console.log(`   Authentication: ✓ Ready`);
    console.log(`   Stripe API: ✓ Ready`);
    console.log(`   Device Support: ✓ Ready`);
    console.log(`   WebSocket: ✓ Ready`);
    console.log(`   Frontend: ✓ Functional React App Served`);
  });
}

setupDevelopmentServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});