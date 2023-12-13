const http = require("http");
const express = require("express");
const connectToDatabase = require("../database");
const studentRoutes = require("./routes/studentRoutes");
const userRoutes = require("./routes/userRoutes");
const leadRoutes = require('./routes/leadRoutes')

const app = express();
const port = 8080;

connectToDatabase();

// Set up your routes here
app.get("/", (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello, world!");
});

// Use the student routes
app.use("/api", studentRoutes);
app.use("/api", userRoutes);
app.use("/api", leadRoutes);

// Create an HTTP server and listen on the specified port
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
