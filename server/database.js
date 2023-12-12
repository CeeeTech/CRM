const mongoose = require("mongoose");

async function connectToDatabase() {
  const connectionString =
    "mongodb://<username>:<password>@<remote-host>:<port>/<database-name>";

  try {
    // await mongoose.connect(connectionString, {
      
    await mongoose.connect("mongodb://localhost:27017/school", {
      // Local connection - testing purposes
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit the process if there's an error
  }
}

module.exports = connectToDatabase;
