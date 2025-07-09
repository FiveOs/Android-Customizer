import express from "express";

console.log("Starting minimal server...");

const app = express();

console.log("Express app created");

app.get('/', (req, res) => {
  res.send('Hello World!');
});

console.log("Route added");

const port = 5000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Minimal server running on port ${port}`);
});

console.log("Server started");