// Use basic-server.ts instead due to Express path-to-regexp issues
// Import basic-server.ts with correct ESM resolution
const basicServerPath = new URL('./basic-server.ts', import.meta.url);
await import(basicServerPath.href);