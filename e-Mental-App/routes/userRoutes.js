const express = require("express");
const {
    loginController,
    registerController,
    authController,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// router object
const router = express.Router();

// routes
// login post route
router.post("/login", loginController);

// register post route
router.post("/register", registerController);

// apply doctor post route
router.post("/apply-doctor", applyDoctorController);

// authentication post route
router.post("/getUserData", authMiddleware, authController);

//notification get route
router.post(
    "/get-all-notification",
    authMiddleware,
    getAllNotificationController
);

//notification delete route
router.post(
    "/delete-all-notification",
    authMiddleware,
    deleteAllNotificationController
);
module.exports = router;
