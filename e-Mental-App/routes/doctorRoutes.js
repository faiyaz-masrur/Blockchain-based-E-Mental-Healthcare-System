const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { updateProfileController } = require("../controllers/doctorController");
const checkDoctorMiddleware = require("../middlewares/checkDoctorMiddleware");

// router object
const router = express.Router();

// routes
// update profile route
router.post(
    "/update-profile",
    authMiddleware,
    checkDoctorMiddleware,
    updateProfileController
);

module.exports = router;
