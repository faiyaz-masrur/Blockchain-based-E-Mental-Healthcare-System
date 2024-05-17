const queryUser = require("../data/queryUser");
const queryAppointment = require("../data/queryAppointment");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const removeAppointment = require("../data/removeAppointment");
const updateInfo = require("../data/updateInfo");
const userModel = require("../models/userModel");
const storeRecord = require("../data/storeRecord");
const storeAppointment = require("../data/storeAppointment");

const updateProfileController = async (req, res) => {
    try {
        req.body.userType = "doctor";
        const newDoctor = new doctorModel(req.body);
        await newDoctor.save();
        const adminUser = await userModel.findOne({
            userType: "admin",
            status: "approved",
        });
        const notification = adminUser.notification;
        notification.push({
            type: "update-doctor-profile-request",
            message: `${newDoctor.name} has requested to update  his profile`,
            data: {
                onClickPath: "/admin/doctors",
            },
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

const getAllRequestedApointmentsController = async (req, res) => {
    try {
        const requestedAppointments = await appointmentModel.find({
            doctorKey: req.body.userData.nid,
        });
        res.status(200).send({
            success: true,
            message: "All Requested Appointments",
            requestedAppointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed getting all requested appointments!",
        });
    }
};

const getAllApointmentsController = async (req, res) => {
    try {
        const appointmentsStr = await queryAppointment.main({
            key: req.body.userData.nid,
        });
        const appointments = JSON.parse(appointmentsStr);
        res.status(200).send({
            success: true,
            message: "All Appointments",
            appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed getting all appointments!",
        });
    }
};

const actionRequestedAppointmentCntroller = async (req, res) => {
    try {
        const requestedAppointment = await appointmentModel.findOne({
            doctorKey: req.body.doctorKey,
            patientKey: req.body.patientKey,
            createdAt: req.body.createdAt,
        });
        if (req.body.type === "rejected") {
            await appointmentModel.deleteOne(requestedAppointment._id);
        } else {
            await storeAppointment.main(requestedAppointment);
            await appointmentModel.deleteOne(requestedAppointment._id);
        }
        const usermdb = await userModel.findOne({
            nid: req.body.patientKey,
        });
        const notification = usermdb.notification;
        notification.push({
            type: "book-appointment-request",
            message: `Dr. ${req.body.userData.name} has ${req.body.type} appointment request`,
            onClickPath: "/patient/appointments",
        });
        await userModel.findByIdAndUpdate(usermdb._id, {
            notification,
        });
        return res.status(200).send({
            success: true,
            message: `Request is ${req.body.type}`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed appoitment cancellation!",
            error,
        });
    }
};

const cancelAppointmentCntroller = async (req, res) => {
    try {
        await removeAppointment.main(req.body);
        if (!req.body.type === "removed") {
            await updateInfo.main({
                function: "changeAppointmentStatus",
                key: req.body.doctorKey,
                otherKey: req.body.patientKey,
                newStatus: req.body.type,
                createdAt: req.body.createdAt,
            });
            const usermdb = await userModel.findOne({
                nid: req.body.patientKey,
            });
            const notification = usermdb.notification;
            notification.push({
                type: "book-appointment-request",
                message: `Dr. ${req.body.userData.name} has canceled the appointment.`,
                onClickPath: "/patient/appointments",
            });
            await userModel.findByIdAndUpdate(usermdb._id, {
                notification,
            });
        }
        res.status(200).send({
            success: true,
            message: `Appointment ${req.body.type} Successfully.`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed changing user status",
            error,
        });
    }
};

const changeAppointmentStatusController = async (req, res) => {
    try {
        await updateInfo.main({
            function: "changeAppointmentStatus",
            key: req.body.doctorKey,
            otherKey: req.body.patientKey,
            newStatus: req.body.newStatus,
            createdAt: req.body.createdAt,
        });
        const usermdb = await userModel.findOne({
            nid: req.body.patientKey,
        });
        const notification = usermdb.notification;
        if (req.body.newStatus === "on going") {
            notification.push({
                type: "session-created",
                message: `Dr. ${req.body.userData.name} has created a session, please join.`,
                onClickPath: "/patient/session",
            });
        } else {
            notification.push({
                type: "session-ended",
                message: `Dr. ${req.body.userData.name} has ended the session.`,
                onClickPath: "/patient/appointments",
            });
        }
        await userModel.findByIdAndUpdate(usermdb._id, {
            notification,
        });
        res.status(200).send({
            success: true,
            message: `Session created successfully`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed creating sessions",
        });
    }
};

const getAllSessionsController = async (req, res) => {
    try {
        const appointmentsStr = await queryAppointment.main({
            key: req.body.userData.nid,
        });
        const appointments = JSON.parse(appointmentsStr);
        const sessions = appointments.filter(
            (appointment) => appointment.status === "on going"
        );
        res.status(200).send({
            success: true,
            message: "All Sessions",
            sessions,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed getting all sessions!",
        });
    }
};

const storeRecordController = async (req, res) => {
    try {
        await storeRecord.main({
            doctorKey: req.body.userData.nid,
            patientKey: req.body.patientKey,
            doctorName: req.body.userData.name,
            disease: req.body.disease,
            dataHash: req.body.dataHash,
            fileName: req.body.fileName,
        });
        res.status(200).send({
            success: true,
            message: "Data uploaded successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed uploading data!",
        });
    }
};

const getAllRecordsController = async (req, res) => {
    try {
        const userStr = await queryUser.main({ key: req.body.patientKey });
        const user = JSON.parse(userStr);

        res.status(200).send({
            success: true,
            message: "All medical records",
            records: user.records,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed getting medical records!",
        });
    }
};

module.exports = {
    updateProfileController,
    getAllApointmentsController,
    getAllRequestedApointmentsController,
    actionRequestedAppointmentCntroller,
    cancelAppointmentCntroller,
    changeAppointmentStatusController,
    getAllSessionsController,
    storeRecordController,
    getAllRecordsController,
};
