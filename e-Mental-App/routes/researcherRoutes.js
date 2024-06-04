const express = require("express");
const {
    getAllPatientsController,
    checkAccessPermissionController,
    getAllRecordsController,
    updateProfileController,
    changeUserStatusController,
} = require("../controllers/researcherController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkResearcherMiddleware = require("../middlewares/checkResearcherMiddleware");

// router object
const router = express.Router();

// routes
//get patients route
router.get(
    "/get-all-patients",
    authMiddleware,
    checkResearcherMiddleware,
    getAllPatientsController
);

router.post(
    "/check-access-permission",
    authMiddleware,
    checkResearcherMiddleware,
    checkAccessPermissionController
);

router.post(
    "/get-all-records",
    authMiddleware,
    checkResearcherMiddleware,
    getAllRecordsController
);

router.post(
    "/update-profile",
    authMiddleware,
    checkResearcherMiddleware,
    updateProfileController
);

router.post(
    "/change-user-status",
    authMiddleware,
    checkResearcherMiddleware,
    changeUserStatusController
);

module.exports = router;
