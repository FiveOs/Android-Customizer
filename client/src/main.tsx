import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('React main.tsx loading...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('Creating React root...');
const root = createRoot(rootElement);

console.log('Rendering React app...');
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log('React app rendered successfully');