const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { addDoctorController } = require("../controllers/adminController");

// router object
const router = express.Router();

// routes
// apply doctor post route
router.post("/add-doctor", addDoctorController);

module.exports = router;
