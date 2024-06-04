const queryUser = require("../data/queryUser");
const doctorModel = require("../models/doctorModel");
const queryAppointment = require("../data/queryAppointment");
const removeAppointment = require("../data/removeAppointment");
const accessModel = require("../models/accessModel");
const storeAccess = require("../data/storeAccess");
const storeRating = require("../data/storeRating");
const removeAccess = require("../data/removeAccess");
const removeRecord = require("../data/removeRecord");
const storeRecord = require("../data/storeRecord");
const storeAppointment = require("../data/storeAppointment");
const changeAppointmentStatus = require("../data/changeAppointmentStatus");
const userModel = require("../models/userModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
const Stripe = require("stripe");
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
                rating: doctor.rating,
                ratedPatientCount: doctor.ratedPatientCount,
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

const searchDoctorController = async (req, res) => {
    try {
        const allUsersStr = await queryUser.main({});
        const allUsersObj = JSON.parse(allUsersStr);
        let doctors;
        if (req.body.name) {
            doctors = allUsersObj.filter(
                (user) =>
                    user.userType === "doctor" &&
                    user.status === "approved" &&
                    user.name === req.body.name
            );
        } else {
            doctors = allUsersObj.filter(
                (user) =>
                    user.userType === "doctor" && user.status === "approved"
            );
        }
        if (doctors.length === 0) {
            return res.status(200).send({
                success: false,
                message: "No such doctor!",
                doctors: [],
            });
        }
        const doctorsSpecificValue = doctors.map((doctor) => {
            return {
                nid: doctor.nid,
                name: doctor.name,
                specialization: doctor.specialization,
                fees: doctor.fees,
                consultationStartTime: doctor.consultationStartTime,
                consultationEndTime: doctor.consultationEndTime,
                rating: doctor.rating,
                ratedPatientCount: doctor.ratedPatientCount,
            };
        });
        res.status(200).send({
            success: true,
            message: "Searched Doctors",
            doctors: doctorsSpecificValue,
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

const confirmAppointmentController = async (req, res) => {
    try {
        const appointment = await appointmentModel.findByIdAndUpdate(
            req.params["appointmentId"],
            {
                payment: "paid",
            }
        );
        const doctor = await userModel.findOne({ nid: appointment.doctorKey });
        doctor.notification.push({
            type: "New-appointment-request",
            message: `A new appointment request from ${req.body.userData.name}`,
            onClickPath: "/doctor/doctor-dashboard",
        });
        await doctor.save();
        res.status(200).send({
            success: true,
            message: "Appointment booked Successfully",
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

const bookAppointmentController = async (req, res) => {
    try {
        req.body.endTime = moment(req.body.startTime, "HH:mm a")
            .add(req.body.duration, "m")
            .format("HH:mm a");
        req.body.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/patient/confirm-appointment/${newAppointment._id}`,
            cancel_url: `${process.env.CLIENT_URL}/patient/appointment-failed/${req.body.doctorKey}`,
            client_reference_id: req.body.doctorKey,
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        unit_amount: req.body.fees * 100,
                        product_data: {
                            name: req.body.doctorName,
                            description: req.body.specialization,
                        },
                    },
                    quantity: 1,
                },
            ],
        });
        res.status(200).send({
            success: true,
            message: "Appointment time set successfully",
            session,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed booking appointment!",
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
        if (req.body.type !== "removed") {
            await changeAppointmentStatus.main({
                doctorKey: req.body.doctorKey,
                patientKey: req.body.patientKey,
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
            doctorKey: req.body.doctorKey,
            patientKey: req.body.userData.nid,
            doctorName: req.body.doctorName,
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
        const userStr = await queryUser.main({ key: req.body.userData.nid });
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

const removeRecordController = async (req, res) => {
    try {
        await removeRecord.main({
            doctorKey: req.body.doctorKey,
            patientKey: req.body.userData.nid,
            dataHash: req.body.dataHash,
            createdAt: req.body.createdAt,
        });
        res.status(200).send({
            success: true,
            message: "Data removed successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed removing data!",
        });
    }
};

const getAllRequestedAccessController = async (req, res) => {
    try {
        const requestedAccessList = await accessModel.find({
            patientKey: req.body.userData.nid,
        });
        res.status(200).send({
            success: true,
            message: "All Requested Access Info",
            requestedAccessList,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed getting all requested access info!",
        });
    }
};

const getAllAccessController = async (req, res) => {
    try {
        const userStr = await queryUser.main({
            key: req.body.userData.nid,
        });
        const user = JSON.parse(userStr);
        res.status(200).send({
            success: true,
            message: "All Data Access Info",
            accessList: user.dataAccess,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed getting all access info!",
            error,
        });
    }
};

const actionRequestedAccessController = async (req, res) => {
    try {
        const requestedAccess = await accessModel.findOne({
            userKey: req.body.userKey,
            patientKey: req.body.userData.nid,
        });
        if (req.body.type === "accepted") {
            console.log(requestedAccess);
            await storeAccess.main(requestedAccess);
        }
        await accessModel.deleteOne(requestedAccess._id);
        const usermdb = await userModel.findOne({
            nid: req.body.userKey,
        });
        const notification = usermdb.notification;
        notification.push({
            type: "record-access-request",
            message: `${req.body.userData.name} has ${req.body.type} your record access request`,
            onClickPath: "/",
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
            message: "Server error: Action failed!",
            error,
        });
    }
};

const removeAccessController = async (req, res) => {
    try {
        await removeAccess.main({
            userKey: req.body.userKey,
            patientKey: req.body.userData.nid,
        });
        const usermdb = await userModel.findOne({
            nid: req.body.userKey,
        });
        const notification = usermdb.notification;
        notification.push({
            type: "record-access",
            message: `${req.body.userData.name} has removed your record access permission.`,
            onClickPath: "/",
        });
        await userModel.findByIdAndUpdate(usermdb._id, {
            notification,
        });
        res.status(200).send({
            success: true,
            message: `Access permission removed successfully.`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed removing access permission!",
            error,
        });
    }
};

const submitRatingController = async (req, res) => {
    try {
        await storeRating.main(req.body);
        res.status(200).send({
            success: true,
            message: "Rating submitted successfully",
        });
        await changeAppointmentStatus.main({
            doctorKey: req.body.doctorKey,
            patientKey: req.body.userData.nid,
            newStatus: "rated",
            createdAt: req.body.createdAt,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Server error: Failed submitting rating!",
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
    getAllSessionsController,
    getAllRecordsController,
    storeRecordController,
    removeRecordController,
    getAllRequestedAccessController,
    getAllAccessController,
    removeAccessController,
    actionRequestedAccessController,
    submitRatingController,
    searchDoctorController,
    confirmAppointmentController,
};
