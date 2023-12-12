const mongoose = require("mongoose");

async function connectToDatabase() {
  const connectionString =
    "mongodb+srv://techceee:BWB8zIPsDxHi6v6Q@crm.oe1aqip.mongodb.net/?retryWrites=true&w=majority";

  try {
    await mongoose.connect(connectionString, {
    // await mongoose.connect("mongodb://localhost:27017/school", {
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
