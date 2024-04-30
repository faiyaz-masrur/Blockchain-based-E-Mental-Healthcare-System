const storeDoctor = require("../data/storeDoctor");
const queryUser = require("../data/queryUser");
const updateInfo = require("../data/updateInfo");
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
        await storeDoctor.main(req.body);
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
        let doctorsSpecificValue = [];
        if (doctors.length !== 0) {
            doctorsSpecificValue = doctors.map((doctor) => {
                return {
                    nid: doctor.nid,
                    name: doctor.name,
                    specialization: doctor.specialization,
                    experience: doctor.experience,
                    userType: doctor.userType,
                    status: doctor.status,
                    createdAt: doctor.createdAt,
                };
            });
        }
        const applyDoctors = await doctorModel.find({});
        let applyDoctorsSpecificValue = [];
        if (applyDoctors.length !== 0) {
            applyDoctorsSpecificValue = applyDoctors.map((applyDoctor) => {
                return {
                    nid: applyDoctor.nid,
                    name: applyDoctor.name,
                    specialization: applyDoctor.specialization,
                    experience: applyDoctor.experience,
                    userType: applyDoctor.userType,
                };
            });
        }
        res.status(200).send({
            success: true,
            message: "All doctors data",
            data: doctorsSpecificValue,
            requestData: applyDoctorsSpecificValue,
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
        patients.forEach((patient) => {
            patient.password = null;
            patient.appointment = null;
        });
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
            await storeDoctor.main(reqDoc);
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
            await updateInfo.main({
                function: "changeUserStatus",
                key: userId,
                newValue: req.body.newStatus,
            });
            const usermdb = await userModel.findOne({ nid: reqDoc.nid });
            await userModel.findByIdAndUpdate(usermdb._id, {
                status: req.body.newStatus,
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

const getDoctorByIdController = async (req, res) => {
    try {
        const strDoctor = await queryUser.main({ key: req.body.doctorKey });
        if (strDoctor.length === 0) {
            return res
                .status(200)
                .send({ success: false, message: "Doctor not found!" });
        }
        const doctor = JSON.parse(strDoctor);
        doctor.password = undefined;
        doctor.appointment = undefined;
        res.status(200).send({
            success: true,
            message: "Doctor info fetched",
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Could not get the doctor!",
        });
    }
};

module.exports = {
    addDoctorController,
    getAllDoctorsController,
    getAllPatientsController,
    changeUserStatusController,
    getDoctorByIdController,
};
