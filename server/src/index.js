const http = require("http");
const express = require("express");
const bodyParser = require('body-parser');
const connectToDatabase = require("../database");
const studentRoutes = require("./routes/studentRoutes"); 
const user_typeRoutes = require("./routes/user_typeRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = 8080;

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectToDatabase();

// Set up your routes here
app.get("/", (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello, world!");
});

// Use the student routes
app.use("/api", studentRoutes);
app.use("/api", user_typeRoutes);
app.use("/api", userRoutes);

// Create an HTTP server and listen on the specified port
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
