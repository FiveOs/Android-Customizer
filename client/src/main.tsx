import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Force cache invalidation
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
}

// Force style refresh
document.documentElement.setAttribute('data-theme-version', '2.1');
document.documentElement.style.setProperty('--cache-bust', Math.random().toString());

createRoot(document.getElementById("root")!).render(<App />);
