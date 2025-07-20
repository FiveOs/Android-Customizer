import { createRoot } from "react-dom/client";
import App from "./App-minimal";
import "./index.css";

// Clear all caches and start fresh
const container = document.getElementById("root");
if (!container) {
  throw new Error("Could not find #root element");
}

// Force fresh render
createRoot(container).render(<App />);
