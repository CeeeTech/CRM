const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  user_type: { type: mongoose.Schema.Types.ObjectId, ref: "User_type" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// Compare this snippet from server/src/models/user_type.js:
