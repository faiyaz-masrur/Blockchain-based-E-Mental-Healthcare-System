const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
    updateProfileController,
    getAllApointmentsController,
    getAllRequestedApointmentsController,
    actionRequestedAppointmentCntroller,
    cancelAppointmentCntroller,
    changeAppointmentStatusHandler,
} = require("../controllers/doctorController");
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

router.get(
    "/get-all-requested-appointments",
    authMiddleware,
    checkDoctorMiddleware,
    getAllRequestedApointmentsController
);

router.get(
    "/get-all-appointments",
    authMiddleware,
    checkDoctorMiddleware,
    getAllApointmentsController
);

router.post(
    "/action-requested-appointment",
    authMiddleware,
    checkDoctorMiddleware,
    actionRequestedAppointmentCntroller
);

router.post(
    "/cancel-appointment",
    authMiddleware,
    checkDoctorMiddleware,
    cancelAppointmentCntroller
);

router.post(
    "/change-appointment-status",
    authMiddleware,
    checkDoctorMiddleware,
    changeAppointmentStatusHandler
);

module.exports = router;
