const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/users", userController.getUsers);
router.post("/users/add-new", userController.createUser);
router.post("/login", userController.login);

module.exports = router;
