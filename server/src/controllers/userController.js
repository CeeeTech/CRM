const User = require("../models/user");
const mongoose = require('mongoose');

async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//get one user
async function getUser(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: "No such User" })
  }

  const user = await User.findById({ _id: id })

  if (!user) {
    res.status(400).json({ error: "No such User" })
  }

  res.status(200).json(user)

}

module.exports = {
  getUsers,
  getUser
};
