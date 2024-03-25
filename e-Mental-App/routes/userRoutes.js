const express = require("express");
const {
    loginController,
    registerController,
    authController,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// router object
const router = express.Router();

// routes
// login post route
router.post("/login", loginController);

// register post route
router.post("/register", registerController);

// authentication post route
router.post("/getUserData", authMiddleware, authController);

module.exports = router;
