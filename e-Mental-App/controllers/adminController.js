const createDoctor = require("../data/createDoctor");
const queryUser = require("../data/queryUser");
const changeUserInfo = require("../data/changeUserInfo");
const bcrypt = require("bcryptjs");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");

const addDoctorController = async (req, res) => {
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
        req.body.createdAt = "";
        await createDoctor.main(req.body);
        const newUser = await userModel({
            nid: req.body.nid,
            userType: "doctor",
            status: "approved",
        });
        await newUser.save();
        res.status(200).send({
            success: true,
            message: "Doctor Added Successfully.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Adding  doctor failed!",
            error,
        });
    }
};

const getAllDoctorsController = async (req, res) => {
    try {
        const allUsersStr = await queryUser.main({});
        const allUsersObj = JSON.parse(allUsersStr);
        const doctors = allUsersObj.filter(
            (user) => user.userType === "doctor"
        );
        const applyDoctor = await doctorModel.find({});
        res.status(200).send({
            success: true,
            message: "All doctors data",
            data: doctors,
            requestData: applyDoctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed getting all doctors data!",
            error,
        });
    }
};

const getAllPatientsController = async (req, res) => {
    try {
        const allUsersStr = await queryUser.main({});
        const allUsersObj = JSON.parse(allUsersStr);
        const patients = allUsersObj.filter(
            (user) => user.userType === "patient"
        );
        res.status(200).send({
            success: true,
            message: "All patients data",
            data: patients,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed getting all patients data!",
            error,
        });
    }
};

const changeUserStatusController = async (req, res) => {
    try {
        const userId = req.body.key;
        const reqDoc = await doctorModel.findOne({ nid: userId });
        if (reqDoc) {
            if (req.body.newStatus === "rejected") {
                await doctorModel.deleteOne({ nid: reqDoc.nid });
                if (reqDoc.createdAt !== "") {
                    const usermdb = await userModel.findOne({
                        nid: reqDoc.nid,
                    });
                    const notification = usermdb.notification;
                    notification.push({
                        type: "update-profile-request",
                        message: `Your profile update request is ${req.body.newStatus}`,
                        onClickPath: "/doctor/Profile",
                    });
                    await userModel.findByIdAndUpdate(usermdb._id, {
                        notification,
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: `Request is ${req.body.newStatus}`,
                });
            }
            await createDoctor.main(reqDoc);
            if (reqDoc.userType === "candidate") {
                const newUser = await userModel({
                    nid: reqDoc.nid,
                    userType: "doctor",
                    status: "approved",
                });
                await newUser.save();
            }
            await doctorModel.deleteOne({ nid: reqDoc.nid });
            if (reqDoc.createdAt !== "") {
                const usermdb = await userModel.findOne({ nid: reqDoc.nid });
                const notification = usermdb.notification;
                notification.push({
                    type: "update-profile-request",
                    message: `Your profile update request is ${req.body.newStatus}`,
                    onClickPath: "/doctor/Profile",
                });
                await userModel.findByIdAndUpdate(usermdb._id, {
                    notification,
                });
            }
            res.status(200).send({
                success: true,
                message: `Request is ${req.body.newStatus}`,
            });
        } else {
            await changeUserInfo.main({
                function: "userStatus",
                key: userId,
                newValue: req.body.newStatus,
            });
            res.status(200).send({
                success: true,
                message: `Status Updated to ${req.body.newStatus}`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed changing user status",
            error,
        });
    }
};

module.exports = {
    addDoctorController,
    getAllDoctorsController,
    getAllPatientsController,
    changeUserStatusController,
};
