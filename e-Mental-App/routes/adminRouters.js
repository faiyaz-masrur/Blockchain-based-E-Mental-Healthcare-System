const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdminMiddleware = require("../middlewares/checkAdminMiddleware");
const {
    addDoctorController,
    getAllDoctorsController,
    getAllPatientsController,
    changeUserStatusController,
} = require("../controllers/adminController");

// router object
const router = express.Router();

// routes
// apply doctor post route
router.post(
    "/add-doctor",
    authMiddleware,
    checkAdminMiddleware,
    addDoctorController
);

// get doctors route
router.get(
    "/get-all-doctors",
    authMiddleware,
    checkAdminMiddleware,
    getAllDoctorsController
);

//get users route
router.get(
    "/get-all-patients",
    authMiddleware,
    checkAdminMiddleware,
    getAllPatientsController
);

// change user status route
router.post(
    "/change-user-status",
    authMiddleware,
    checkAdminMiddleware,
    changeUserStatusController
);

module.exports = router;
