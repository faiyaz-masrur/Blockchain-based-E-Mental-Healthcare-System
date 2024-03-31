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
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        req.body.userType = "admin";
        await createUser.main(req.body);
        const newUser = await userModel({
            nid: req.body.nid,
            userType: "admin",
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

const authController = async (req, res) => {
    try {
        const userString = await queryUser.main({ key: req.body.key });
        if (userString.length === 0) {
            return res
                .status(200)
                .send({ success: false, message: "User Not Found" });
        }
        const user = JSON.parse(userString);
        const userMdb = await userModel.findOne({ nid: req.body.key });
        if (!userMdb) {
            res.status(200).send({
                success: true,
                data: {
                    key: req.body.key,
                    name: user.name,
                    email: user.email,
                    userType: user.userType,
                    notification: [],
                    seenNotification: [],
                },
            });
        } else {
            res.status(200).send({
                success: true,
                data: {
                    key: req.body.key,
                    name: user.name,
                    email: user.email,
                    userType: user.userType,
                    notification: userMdb.notification,
                    seenNotification: userMdb.seenNotification,
                },
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Authentication Failed!",
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
        const adminUser = await userModel.findOne({ userType: "admin" });
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

const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ nid: req.body.key });
        const notification = user.notification;
        const seenNotification = user.seenNotification;
        seenNotification.push(...notification);
        user.notification = [];
        user.seenNotification = seenNotification;
        const updatedUser = await user.save();
        res.status(200).send({
            success: true,
            message: "All notification marked as read.",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error : Failed getting notification",
            error,
        });
    }
};

const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ nid: req.body.key });
        user.seenNotification = [];
        const updatedUser = await user.save();
        res.status(200).send({
            success: true,
            message: "All notification deleted successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error : Failed deleting notifications",
            error,
        });
    }
};

module.exports = {
    loginController,
    registerController,
    authController,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
};
