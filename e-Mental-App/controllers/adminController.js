const storeDoctor = require("../data/storeDoctor");
const queryUser = require("../data/queryUser");
const changeUserStatus = require("../data/changeUserStatus");
const bcrypt = require("bcryptjs");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");
const researcherModel = require("../models/researcherModel");
const storeResearcher = require("../data/storeResearcher");

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
        const userId = req.body.userKey;
        const reqDoc = await doctorModel.findOne({ nid: userId });
        if (reqDoc) {
            if (req.body.newStatus === "approved") {
                await storeDoctor.main(reqDoc);
                if (reqDoc.userType === "candidate") {
                    const newUser = await userModel({
                        nid: reqDoc.nid,
                        userType: "doctor",
                        status: "approved",
                    });
                    await newUser.save();
                }
            }
            await doctorModel.deleteOne({ nid: reqDoc.nid });
            if (reqDoc.userType !== "candidate") {
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
            await changeUserStatus.main({
                userKey: userId,
                newStatus: req.body.newStatus,
            });
            const usermdb = await userModel.findOne({ nid: userId });
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

const getAllAppliedResearchersController = async (req, res) => {
    try {
        const appliedResearchers = await researcherModel.find({});
        let appliedResearcherSpecificValue = [];
        if (appliedResearchers.length !== 0) {
            appliedResearcherSpecificValue = appliedResearchers.map(
                (appliedResearcher) => {
                    return {
                        nid: appliedResearcher.nid,
                        name: appliedResearcher.name,
                        degree: appliedResearcher.degree,
                        address: appliedResearcher.address,
                        userType: appliedResearcher.userType,
                    };
                }
            );
        }
        res.status(200).send({
            success: true,
            message: "All applied researchers data",
            appliedResearchers: appliedResearcherSpecificValue,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message:
                "Server error: Failed getting all applied researchers data!",
        });
    }
};

const getAllResearchersController = async (req, res) => {
    try {
        const allUsersStr = await queryUser.main({});
        const allUsersObj = JSON.parse(allUsersStr);
        const researchers = allUsersObj.filter(
            (user) => user.userType === "researcher"
        );
        let researchersSpecificValue = [];
        if (researchers.length !== 0) {
            researchersSpecificValue = researchers.map((researcher) => {
                return {
                    nid: researcher.nid,
                    name: researcher.name,
                    email: researcher.email,
                    phone: researcher.phone,
                    userType: researcher.userType,
                    status: researcher.status,
                    createdAt: researcher.createdAt,
                };
            });
        }
        res.status(200).send({
            success: true,
            message: "All researchers data",
            researchers: researchersSpecificValue,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed getting all researchers data!",
            error,
        });
    }
};

const changeResearcherStatusController = async (req, res) => {
    try {
        const userId = req.body.key;
        const reqResearcher = await researcherModel.findOne({ nid: userId });
        if (reqResearcher) {
            if (req.body.newStatus === "approved") {
                await storeResearcher.main(reqResearcher);
                if (reqResearcher.userType === "candidate") {
                    const newUser = await userModel({
                        nid: reqResearcher.nid,
                        userType: "researcher",
                        status: "approved",
                    });
                    await newUser.save();
                }
            }
            await researcherModel.deleteOne({ nid: reqResearcher.nid });
            if (reqResearcher.userType !== "candidate") {
                const usermdb = await userModel.findOne({
                    nid: reqResearcher.nid,
                });
                const notification = usermdb.notification;
                notification.push({
                    type: "update-profile-request",
                    message: `Your profile update request is ${req.body.newStatus}`,
                    onClickPath: "/researcher/Profile",
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
            await changeUserStatus.main({
                userKey: userId,
                newStatus: req.body.newStatus,
            });
            const usermdb = await userModel.findOne({ nid: userId });
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
            message: "Server error: Failed changing status",
            error,
        });
    }
};

const getResearcherByIdController = async (req, res) => {
    try {
        const reqResearcher = await researcherModel.findOne({
            nid: req.body.researcherKey,
        });
        if (reqResearcher) {
            return res.status(200).send({
                success: true,
                message: "Researcher info fetched",
                researcher: reqResearcher,
            });
        }
        const strResearcher = await queryUser.main({
            key: req.body.researcherKey,
        });
        if (strResearcher.length === 0) {
            return res
                .status(200)
                .send({ success: false, message: "Researcher not found!" });
        }
        const researcher = JSON.parse(strResearcher);
        researcher.password = undefined;
        res.status(200).send({
            success: true,
            message: "Researcher info fetched",
            researcher,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Could not get the researcher!",
        });
    }
};

const getAppInfoController = async (req, res) => {
    try {
        const usersStr = await queryUser.main({});
        const users = JSON.parse(usersStr);
        const doctor = { name: "Doctor", active: 0, inactive: 0, block: 0 };
        const patient = { name: "Patient", active: 0, inactive: 0, block: 0 };
        const admin = { name: "Admin", active: 0, inactive: 0, block: 0 };
        const researcher = {
            name: "Researcher",
            active: 0,
            inactive: 0,
            block: 0,
        };
        users.forEach((user) => {
            if (user.userType === "doctor") {
                if (user.status === "approved") {
                    doctor.active += 1;
                } else if (user.status === "deactivated") {
                    doctor.inactive += 1;
                } else {
                    doctor.block += 1;
                }
            } else if (user.userType === "patient") {
                if (user.status === "approved") {
                    patient.active += 1;
                } else if (user.status === "deactivated") {
                    patient.inactive += 1;
                } else {
                    patient.block += 1;
                }
            } else if (user.userType === "admin") {
                if (user.status === "approved") {
                    admin.active += 1;
                } else if (user.status === "deactivated") {
                    admin.inactive += 1;
                } else {
                    admin.block += 1;
                }
            } else if (user.userType === "researcher") {
                if (user.status === "approved") {
                    researcher.active += 1;
                } else if (user.status === "deactivated") {
                    researcher.inactive += 1;
                } else {
                    researcher.block += 1;
                }
            }
        });
        const appInfo = [doctor, patient, admin, researcher];
        res.status(200).send({
            success: true,
            message: "App info fetched",
            appInfo,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Could not get app info!",
        });
    }
};

module.exports = {
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
};
