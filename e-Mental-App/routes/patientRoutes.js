const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const checkPatientMiddleware = require("../middlewares/checkPatientMiddleware");
const {
    getDoctorByIdController,
    getAllDoctorsController,
    bookAppointmentController,
    checkBookingTimeController,
    getAllApointmentsController,
    getAllRequestedApointmentsController,
    cancleRequestedAppointmentController,
    cancleAppointmentController,
    getAllSessionsController,
    getAllRecordsController,
    storeRecordController,
    removeRecordController,
} = require("../controllers/patientController");

// router object
const router = express.Router();

// routes
// get a doctor info
router.post(
    "/get-doctor-byId",
    authMiddleware,
    checkPatientMiddleware,
    getDoctorByIdController
);

//get all the doctor details
router.get(
    "/get-all-doctors",
    authMiddleware,
    checkPatientMiddleware,
    getAllDoctorsController
);

// post appointment to doctor
router.post(
    "/book-appointment",
    authMiddleware,
    checkPatientMiddleware,
    bookAppointmentController
);

// check available appointment time
router.post(
    "/check-booking-time",
    authMiddleware,
    checkPatientMiddleware,
    checkBookingTimeController
);

// get all appointments
router.get(
    "/get-all-appointments",
    authMiddleware,
    checkPatientMiddleware,
    getAllApointmentsController
);

// get all requested appointments
router.get(
    "/get-all-requested-appointments",
    authMiddleware,
    checkPatientMiddleware,
    getAllRequestedApointmentsController
);

router.post(
    "/cancel-appointment",
    authMiddleware,
    checkPatientMiddleware,
    cancleAppointmentController
);

router.post(
    "/cancel-requested-appointment",
    authMiddleware,
    checkPatientMiddleware,
    cancleRequestedAppointmentController
);

router.post(
    "/store-record",
    authMiddleware,
    checkPatientMiddleware,
    storeRecordController
);

router.post(
    "/remove-record",
    authMiddleware,
    checkPatientMiddleware,
    removeRecordController
);

router.get(
    "/get-all-sessions",
    authMiddleware,
    checkPatientMiddleware,
    getAllSessionsController
);

router.get(
    "/get-all-records",
    authMiddleware,
    checkPatientMiddleware,
    getAllRecordsController
);

module.exports = router;
