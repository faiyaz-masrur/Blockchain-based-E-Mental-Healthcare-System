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
    getAllRequestedAccessController,
    getAllAccessController,
    removeAccessController,
    actionRequestedAccessController,
    submitRatingController,
    searchDoctorController,
    confirmAppointmentController,
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

router.post(
    "/search-doctor",
    authMiddleware,
    checkPatientMiddleware,
    searchDoctorController
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

router.get(
    "/get-all-requested-access",
    authMiddleware,
    checkPatientMiddleware,
    getAllRequestedAccessController
);

router.get(
    "/get-all-access",
    authMiddleware,
    checkPatientMiddleware,
    getAllAccessController
);

router.post(
    "/remove-access",
    authMiddleware,
    checkPatientMiddleware,
    removeAccessController
);

router.post(
    "/action-requested-access",
    authMiddleware,
    checkPatientMiddleware,
    actionRequestedAccessController
);

router.post(
    "/submit-rating",
    authMiddleware,
    checkPatientMiddleware,
    submitRatingController
);

router.post(
    "/confirm-appointment/:appointmentId",
    authMiddleware,
    checkPatientMiddleware,
    confirmAppointmentController
);

module.exports = router;
