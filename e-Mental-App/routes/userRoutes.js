const express = require("express");
const {
    loginController,
    registerController,
    getUserDataController,
    applyDoctorController,
    getAllNotificationsController,
    markAllNotificationsController,
    deleteAllNotificationsController,
    storeUsersToMDbController,
    getDoctorByIdController,
    applyResearcherController,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// router object
const router = express.Router();

// routes
// login post route
router.post("/login", loginController);

// login post route
router.post("/store-user", storeUsersToMDbController);

// register post route
router.post("/register", registerController);

// apply doctor post route
router.post("/apply-doctor", applyDoctorController);

// apply researcher post route
router.post("/apply-researcher", applyResearcherController);

// authentication post route
router.post("/getUserData", authMiddleware, getUserDataController);

//notification get route
router.get(
    "/get-all-notifications",
    authMiddleware,
    getAllNotificationsController
);

router.post(
    "/mark-all-notifications",
    authMiddleware,
    markAllNotificationsController
);

//notification delete route
router.post(
    "/delete-all-notifications",
    authMiddleware,
    deleteAllNotificationsController
);

router.post("/get-doctor-byId", authMiddleware, getDoctorByIdController);

module.exports = router;
