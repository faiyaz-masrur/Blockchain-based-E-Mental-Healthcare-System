const queryUser = require("../data/queryUser");
const doctorModel = require("../models/doctorModel");
const queryAppointment = require("../data/queryAppointment");
const removeAppointment = require("../data/removeAppointment");
const storeAppointment = require("../data/storeAppointment");
const updateInfo = require("../data/updateInfo");
const userModel = require("../models/userModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
const _ = require("lodash");

const getDoctorByIdController = async (req, res) => {
    try {
        const strDoctor = await queryUser.main({ key: req.body.doctorKey });
        if (strDoctor.length === 0) {
            return res
                .status(200)
                .send({ success: false, message: "Doctor not found!" });
        }
        const doctor = JSON.parse(strDoctor);
        const doctorData = {};
        if (req.body.dataQuantity === "half") {
            doctorData.nid = doctor.nid;
            doctorData.name = doctor.name;
            doctorData.email = doctor.email;
            doctorData.phone = doctor.phone;
            doctorData.fees = doctor.fees;
            doctorData.consultationDuration = doctor.consultationDuration;
            doctorData.consultationStartTime = doctor.consultationStartTime;
            doctorData.consultationEndTime = doctor.consultationEndTime;
        } else {
            doctorData.nid = doctor.nid;
            doctorData.name = doctor.name;
            doctorData.email = doctor.email;
            doctorData.phone = doctor.phone;
            doctorData.degree = doctor.degree;
            doctorData.website = doctor.website;
            doctorData.address = doctor.address;
            doctorData.specialization = doctor.specialization;
            doctorData.experience = doctor.experience;
            doctorData.fees = doctor.fees;
            doctorData.consultationDuration = doctor.consultationDuration;
            doctorData.consultationStartTime = doctor.consultationStartTime;
            doctorData.consultationEndTime = doctor.consultationEndTime;
        }
        res.status(200).send({
            success: true,
            message: "Doctor info fetched",
            data: doctorData,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Could not get the doctor!",
        });
    }
};

const getAllDoctorsController = async (req, res) => {
    try {
        const allUsersStr = await queryUser.main({});
        const allUsersObj = JSON.parse(allUsersStr);
        const doctors = allUsersObj.filter(
            (user) => user.userType === "doctor" && user.status === "approved"
        );
        const doctorsSpecificValue = doctors.map((doctor) => {
            return {
                nid: doctor.nid,
                name: doctor.name,
                specialization: doctor.specialization,
                fees: doctor.fees,
                consultationStartTime: doctor.consultationStartTime,
                consultationEndTime: doctor.consultationEndTime,
            };
        });
        res.status(200).send({
            success: true,
            message: "All doctors data",
            data: doctorsSpecificValue,
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

const bookAppointmentController = async (req, res) => {
    try {
        req.body.endTime = moment(req.body.startTime, "HH:mm a")
            .add(req.body.duration, "m")
            .format("HH:mm a");
        req.body.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();
        const doctor = await userModel.findOne({ nid: req.body.doctorKey });
        doctor.notification.push({
            type: "New-appointment-request",
            message: `A new appointment request from ${req.body.userData.name}`,
            onClickPath: "/doctor/doctor-dashboard",
        });
        await doctor.save();
        res.status(200).send({
            success: true,
            message: "Appointment booked successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed booking appointment!",
            error,
        });
    }
};

const checkBookingTimeController = async (req, res) => {
    try {
        const bookingTime = req.body.time;
        const bookingDate = req.body.date;
        const doctorConsultationStartTime = moment(
            req.body.consultationStartTime,
            "HH:mm"
        )
            .subtract(1, "m")
            .format("HH:mm");
        const doctorConsultationEndTime = req.body.consultationEndTime;
        const currentDate = moment().format("YYYY-MM-DD");
        const currentTime = moment().format("HH:mm");

        if (moment(bookingDate, "YYYY-MM-DD").isBefore(currentDate)) {
            return res.status(200).send({
                success: false,
                message: "Date is invalid!",
            });
        } else if (moment(bookingDate, "YYYY-MM-DD").isSame(currentDate)) {
            if (
                moment(
                    `${currentDate} ${bookingTime}`,
                    "YYYY-MM-DD HH:mm"
                ).isBefore(
                    moment(`${currentDate} ${currentTime}`, "YYYY-MM-DD HH:mm")
                )
            ) {
                return res.status(200).send({
                    success: false,
                    message: "Consultation Time is invalid!",
                });
            }
        }
        if (
            !moment(
                `${currentDate} ${bookingTime}`,
                "YYYY-MM-DD HH:mm"
            ).isBetween(
                moment(
                    `${currentDate} ${doctorConsultationStartTime}`,
                    "YYYY-MM-DD HH:mm"
                ),
                moment(
                    `${currentDate} ${doctorConsultationEndTime}`,
                    "YYYY-MM-DD HH:mm"
                )
            )
        ) {
            return res.status(200).send({
                success: false,
                message: "Consultation Timing is invalid!",
            });
        }
        const requestedAppointments = await appointmentModel.find({
            doctorKey: req.body.doctorKey,
        });
        if (requestedAppointments.length !== 0) {
            const anyRequestedAppointments = requestedAppointments.find(
                (element) => {
                    return (
                        moment(
                            `${bookingDate} ${bookingTime}`,
                            "YYYY-MM-DD HH:mm"
                        ).isBetween(
                            moment(
                                `${element.date} ${element.startTime}`,
                                "YYYY-MM-DD HH:mm"
                            ),
                            moment(
                                `${element.date} ${element.endTime}`,
                                "YYYY-MM-DD HH:mm"
                            )
                        ) ||
                        moment(
                            `${bookingDate} ${bookingTime}`,
                            "YYYY-MM-DD HH:mm"
                        ).isSame(
                            moment(
                                `${element.date} ${element.startTime}`,
                                "YYYY-MM-DD HH:mm"
                            )
                        )
                    );
                }
            );
            if (anyRequestedAppointments) {
                return res.status(200).send({
                    success: false,
                    message: "Consultation time is unavailable!",
                });
            }
        }
        const doctorAppointmentsStr = await queryAppointment.main({
            key: req.body.doctorKey,
        });
        if (doctorAppointmentsStr.length !== 0) {
            const doctorAppointments = JSON.parse(doctorAppointmentsStr);
            const anyAppointments = doctorAppointments.find((element) => {
                return (
                    moment(
                        `${bookingDate} ${bookingTime}`,
                        "YYYY-MM-DD HH:mm"
                    ).isBetween(
                        moment(
                            `${element.date} ${element.startTime}`,
                            "YYYY-MM-DD HH:mm"
                        ),
                        moment(
                            `${element.date} ${element.endTime}`,
                            "YYYY-MM-DD HH:mm"
                        )
                    ) ||
                    moment(
                        `${bookingDate} ${bookingTime}`,
                        "YYYY-MM-DD HH:mm"
                    ).isSame(
                        moment(
                            `${element.date} ${element.startTime}`,
                            "YYYY-MM-DD HH:mm"
                        )
                    )
                );
            });
            if (anyAppointments) {
                return res.status(200).send({
                    success: false,
                    message: "Consultation time is unavailable!",
                });
            }
        }
        res.status(200).send({
            success: true,
            message: "Consultation time is available",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed booking appointment!",
            error,
        });
    }
};

const getAllRequestedApointmentsController = async (req, res) => {
    try {
        const requestedAppointments = await appointmentModel.find({
            patientKey: req.body.userData.nid,
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
            error,
        });
    }
};

const cancleRequestedAppointmentController = async (req, res) => {
    try {
        const requestedAppointment = await appointmentModel.findOne({
            doctorKey: req.body.doctorKey,
            patientKey: req.body.patientKey,
            createdAt: req.body.createdAt,
        });
        await appointmentModel.deleteOne(requestedAppointment._id);
        const usermdb = await userModel.findOne({
            nid: req.body.doctorKey,
        });
        const notification = usermdb.notification;
        notification.push({
            type: "book-appointment-request",
            message: `${req.body.userData.name} has canceled appointment request`,
            onClickPath: "/doctor/doctor-dashboard",
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

const cancleAppointmentController = async (req, res) => {
    try {
        await removeAppointment.main(req.body);
        if (req.body.type === "canceled") {
            await updateInfo.main({
                function: "changeAppointmentStatus",
                key: req.body.doctorKey,
                otherKey: req.body.patientKey,
                newStatus: req.body.type,
                createdAt: req.body.createdAt,
            });
            const usermdb = await userModel.findOne({
                nid: req.body.doctorKey,
            });
            const notification = usermdb.notification;
            notification.push({
                type: "booked-appointments",
                message: `${req.body.userData.name} has canceled the appointment.`,
                onClickPath: "/doctor/doctor-dashboard",
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

module.exports = {
    getDoctorByIdController,
    getAllDoctorsController,
    bookAppointmentController,
    checkBookingTimeController,
    getAllApointmentsController,
    getAllRequestedApointmentsController,
    cancleRequestedAppointmentController,
    cancleAppointmentController,
};
