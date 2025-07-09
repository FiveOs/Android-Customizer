import express from "express";
import session from "express-session";
import helmet from "helmet";
import cors from "cors";

console.log("1. Starting debug server...");

const app = express();

console.log("2. Express app created");

// Test each middleware one by one
console.log("3. Adding helmet...");
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

console.log("4. Adding cors...");
app.use(cors({
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
}));

console.log("5. Adding body parsing...");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log("6. Adding session...");
app.use(session({
  secret: 'test-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  },
  name: 'sessionId'
}));

console.log("7. Adding test route...");
app.get('/', (req, res) => {
  res.json({ message: 'Debug server working!' });
});

console.log("8. Starting server...");
const port = 5000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Debug server running on port ${port}`);
});

console.log("9. Server setup complete");