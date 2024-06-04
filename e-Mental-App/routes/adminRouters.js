const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdminMiddleware = require("../middlewares/checkAdminMiddleware");
const {
    addDoctorController,
    getAllDoctorsController,
    getAllPatientsController,
    changeUserStatusController,
    getDoctorByIdController,
    getAllAppliedResearchersController,
    getAllResearchersController,
    changeResearcherStatusController,
    getResearcherByIdController,
    getAppInfoController,
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

// get a doctor info
router.post(
    "/get-doctor-byId",
    authMiddleware,
    checkAdminMiddleware,
    getDoctorByIdController
);

router.post(
    "/get-researcher-byId",
    authMiddleware,
    checkAdminMiddleware,
    getResearcherByIdController
);

router.get(
    "/get-all-applied-researchers",
    authMiddleware,
    checkAdminMiddleware,
    getAllAppliedResearchersController
);

router.get(
    "/get-all-researchers",
    authMiddleware,
    checkAdminMiddleware,
    getAllResearchersController
);

router.post(
    "/change-researcher-status",
    authMiddleware,
    checkAdminMiddleware,
    changeResearcherStatusController
);

router.get(
    "/get-app-info",
    authMiddleware,
    checkAdminMiddleware,
    getAppInfoController
);

module.exports = router;
