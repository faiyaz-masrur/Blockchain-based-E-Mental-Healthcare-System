const queryUser = require("../data/queryUser");
const createUser = require("../data/createUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");

const loginController = async (req, res) => {
    try {
        const userString = await queryUser.main({ key: req.body.nid });
        if (userString.length === 0) {
            return res
                .status(200)
                .send({ success: false, message: "User Not Found" });
        }
        const user = JSON.parse(userString);
        const isPasswordMatch = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordMatch) {
            return res.status(200).send({
                success: false,
                message: "Invalid User Id or Password!",
            });
        }
        if (user.status === "blocked") {
            return res.status(200).send({
                success: false,
                message: "Login failed: you are blocked",
            });
        }
        const token = jwt.sign({ key: req.body.nid }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRY,
        });
        res.status(200).send({
            success: true,
            message: "Register Successful",
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Error in Login Controller ${error.message}`,
        });
    }
};

const registerController = async (req, res) => {
    try {
        const existingUser = await queryUser.main({ key: req.body.nid });
        if (existingUser.length !== 0) {
            return res.status(200).send({
                success: false,
                message: "Failed: User Already Exist!",
            });
        }
        const doctorMdb = await doctorModel.findOne({ nid: req.body.nid });
        if (doctorMdb) {
            return res.status(200).send({
                success: false,
                message: "Failed: Nid already used!",
            });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        req.body.userType = "admin";
        await createUser.main(req.body);
        const newUser = await userModel({
            nid: req.body.nid,
            userType: "admin",
            status: "approved",
        });
        await newUser.save();
        res.status(200).send({
            success: true,
            message: "User Registered Successfully.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error : Registering user failed!",
            error,
        });
    }
};

const getUserDataController = async (req, res) => {
    try {
        const userMdb = await userModel.findOne({ nid: req.body.userData.nid });
        res.status(200).send({
            success: true,
            data: {
                ...req.body.userData,
                notificationLength: userMdb.notification.length,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: true,
            message: "External Database Failed!",
            data: {
                ...req.body.userData,
                notificationLength: null,
            },
        });
    }
};

const applyDoctorController = async (req, res) => {
    try {
        const existingUser = await queryUser.main({ key: req.body.nid });
        if (existingUser.length !== 0) {
            return res.status(200).send({
                success: false,
                message: "Failed: Nid already used!",
            });
        }
        const doctorMdb = await doctorModel.findOne({ nid: req.body.nid });
        if (doctorMdb) {
            return res.status(200).send({
                success: false,
                message: "Failed: Nid already used!",
            });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newDoctor = new doctorModel(req.body);
        await newDoctor.save();
        const adminUser = await userModel.findOne({
            userType: "admin",
            status: "approved",
        });
        const notification = adminUser.notification;
        notification.push({
            type: "apply-doctor-request",
            message: `${newDoctor.name} has applied for a doctor account`,
            data: {
                nid: newDoctor.nid,
                name: newDoctor.name,
                onClickPath: "/admin/doctors",
            },
        });
        await userModel.findByIdAndUpdate(adminUser._id, { notification });
        res.status(201).send({
            success: true,
            message:
                "Doctor request sent successfully. Please wait for admin approval.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error : Applying doctor failed!",
            error,
        });
    }
};

const getAllNotificationsController = async (req, res) => {
    try {
        const parsedUser = req.body.userData;
        const user = await userModel.findOne({ nid: parsedUser.nid });
        res.status(200).send({
            success: true,
            message: "All notifications",
            unSeenNotifications: user.notification,
            seenNotifications: user.seenNotification,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error : Failed getting notification",
        });
    }
};

const markAllNotificationsController = async (req, res) => {
    try {
        const parsedUser = req.body.userData;
        const user = await userModel.findOne({ nid: parsedUser.nid });
        const notification = user.notification;
        const seenNotification = user.seenNotification;
        seenNotification.push(...notification);
        user.notification = [];
        user.seenNotification = seenNotification;
        const updatedUser = await user.save();
        res.status(200).send({
            success: true,
            message: "All notification marked as seen.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error : Failed getting notification",
        });
    }
};

const deleteAllNotificationsController = async (req, res) => {
    try {
        const parsedUser = req.body.userData;
        const user = await userModel.findOne({ nid: parsedUser.nid });
        user.seenNotification = [];
        const updatedUser = await user.save();
        res.status(200).send({
            success: true,
            message: "All notification deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error : Failed deleting notifications",
        });
    }
};

const storeUsersToMDbController = async (req, res) => {
    try {
        const usersStr = await queryUser.main({});
        if (usersStr.length === 0) {
            return res
                .status(200)
                .send({ success: false, message: "Failed : Users Not Found" });
        }
        const users = JSON.parse(usersStr);
        for (let i = 0; i < users.length; i++) {
            const newUser = await userModel({
                nid: users[i].nid,
                userType: users[i].userType,
                status: users[i].status,
            });
            await newUser.save();
        }
        res.status(200).send({
            success: true,
            message: "All users add to mdb successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error : Failed adding users to mdb",
            error,
        });
    }
};

module.exports = {
    loginController,
    registerController,
    getUserDataController,
    applyDoctorController,
    getAllNotificationsController,
    markAllNotificationsController,
    deleteAllNotificationsController,
    storeUsersToMDbController,
};
