const queryUser = require("../data/queryUser");
const queryAppointment = require("../data/queryAppointment");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const researcherModel = require("../models/researcherModel");
const accessModel = require("../models/accessModel");
const removeAppointment = require("../data/removeAppointment");
const changeUserStatus = require("../data/changeUserStatus");
const userModel = require("../models/userModel");
const storeRecord = require("../data/storeRecord");
const storeAppointment = require("../data/storeAppointment");

const getAllPatientsController = async (req, res) => {
    try {
        const allUsersStr = await queryUser.main({});
        const allUsersObj = JSON.parse(allUsersStr);
        const patients = allUsersObj.filter(
            (user) => user.userType === "patient"
        );
        const patientsSpecificValue = patients.map((patient) => {
            return {
                nid: patient.nid,
                name: patient.name,
            };
        });
        res.status(200).send({
            success: true,
            message: "All patients",
            patients: patientsSpecificValue,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed getting all patients!",
        });
    }
};

const checkAccessPermissionController = async (req, res) => {
    try {
        const userStr = await queryUser.main({ key: req.body.patientKey });
        const user = JSON.parse(userStr);
        const dataAccess = user.dataAccess;
        const result = dataAccess.find(
            (accessInfo) => accessInfo.userKey === req.body.userData.nid
        );
        if (result) {
            return res.status(200).send({
                success: true,
            });
        } else {
            const accessRequest = await accessModel.findOne({
                userKey: req.body.userData.nid,
            });
            if (accessRequest) {
                return res.status(200).send({
                    success: false,
                    message: "Access request has been sent.",
                });
            } else {
                const newAccessRequest = {
                    userKey: req.body.userData.nid,
                    patientKey: req.body.patientKey,
                    userName: req.body.userData.name,
                    address: req.body.userData.address,
                    userType: req.body.userData.userType,
                };
                const storeAccessRequest = new accessModel(newAccessRequest);
                await storeAccessRequest.save();
                const patient = await userModel.findOne({
                    nid: req.body.patientKey,
                });
                patient.notification.push({
                    type: "New-record-access-request",
                    message: `${req.body.userData.name} has requested for record access permission.`,
                    onClickPath: "/patient/medical-record",
                });
                await patient.save();
                res.status(200).send({
                    success: false,
                    message: "Access request sent.",
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed getting medical records!",
        });
    }
};

const getAllRecordsController = async (req, res) => {
    try {
        const userStr = await queryUser.main({ key: req.body.patientKey });
        const user = JSON.parse(userStr);
        const dataAccess = user.dataAccess;
        const result = dataAccess.find(
            (accessInfo) => accessInfo.userKey === req.body.userData.nid
        );
        if (result) {
            return res.status(200).send({
                success: true,
                message: "All medical records",
                records: user.records,
            });
        } else {
            const accessRequest = await accessModel.findOne({
                userKey: req.body.userData.nid,
            });
            if (accessRequest) {
                return res.status(200).send({
                    success: false,
                    message: "Access request has been sent.",
                });
            } else {
                const newAccessRequest = {
                    userKey: req.body.userData.nid,
                    patientKey: req.body.patientKey,
                    userName: req.body.userData.name,
                    address: req.body.userData.address,
                    userType: req.body.userData.userType,
                };
                const storeAccessRequest = new accessModel(newAccessRequest);
                await storeAccessRequest.save();
                const patient = await userModel.findOne({
                    nid: req.body.patientKey,
                });
                patient.notification.push({
                    type: "New-record-access-request",
                    message: `Dr. ${req.body.userData.name} has requested for record access permission.`,
                    onClickPath: "/patient/medical-record",
                });
                await patient.save();
                res.status(200).send({
                    success: false,
                    message: "Access request sent.",
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed getting medical records!",
        });
    }
};

const updateProfileController = async (req, res) => {
    try {
        const newReacher = new researcherModel(req.body);
        await newReacher.save();
        const adminUser = await userModel.findOne({
            userType: "admin",
            status: "approved",
        });
        const notification = adminUser.notification;
        notification.push({
            type: "update-researcher-profile-request",
            message: `${newReacher.name} has requested to update  his profile`,
            onClickPath: "/admin/researchers",
        });
        await userModel.findByIdAndUpdate(adminUser._id, { notification });
        res.status(201).send({
            success: true,
            message:
                "Details update request sent successfully. Please wait for admin approval.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Update profile request failed!",
        });
    }
};

const changeUserStatusController = async (req, res) => {
    try {
        await changeUserStatus.main({
            userKey: req.body.userData.nid,
            newStatus: req.body.newStatus,
        });
        const usermdb = await userModel.findOne({ nid: req.body.userData.nid });
        await userModel.findByIdAndUpdate(usermdb._id, {
            status: req.body.newStatus,
        });
        res.status(200).send({
            success: true,
            message: `Status Updated to ${req.body.newStatus}`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed changing status!",
        });
    }
};

module.exports = {
    getAllPatientsController,
    checkAccessPermissionController,
    getAllRecordsController,
    updateProfileController,
    changeUserStatusController,
};
