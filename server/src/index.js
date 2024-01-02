const http = require("http");
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const connectToDatabase = require("../database");
const studentRoutes = require("./routes/studentRoutes");
const user_typeRoutes = require("./routes/user_typeRoutes");
const userRoutes = require("./routes/userRoutes");
const leadRoutes = require('./routes/leadRoutes')
const branchRoutes = require('./routes/branchRoutes')
const courseRoutes = require('./routes/courseRoutes')
const statusRoutes = require('./routes/statusRoutes')
const folowUpRoutes = require('./routes/folowUpRoutes')

const app = express();
app.use(cors());

const port = 8080;

// Use body-parser middleware
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
app.use("/api", user_typeRoutes);
app.use("/api", studentRoutes);
app.use("/api", userRoutes);
app.use("/api", leadRoutes);
app.use('/api', branchRoutes);
app.use('/api', courseRoutes)
app.use('/api', statusRoutes)
app.use('/api', folowUpRoutes)

// Create an HTTP server and listen on the specified port
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
