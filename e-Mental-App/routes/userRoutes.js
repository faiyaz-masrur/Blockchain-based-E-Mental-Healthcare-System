const express = require("express");
const {
    loginController,
    registerController,
} = require("../controllers/userController");

// router object
const router = express.Router();

// routes
// login post route
router.post("/login", loginController);

// register post route
router.post("/register", registerController);

module.exports = router;
