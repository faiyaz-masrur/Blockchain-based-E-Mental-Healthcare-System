const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    doctorKey: {
        type: String,
        required: true,
    },
    patientKey: {
        type: String,
        required: true,
    },
    doctorName: {
        type: Object,
        required: true,
    },
    doctorEmail: {
        type: Object,
        required: true,
    },
    doctorPhone: {
        type: Object,
        required: true,
    },
    patientName: {
        type: Object,
        required: true,
    },
    patientEmail: {
        type: Object,
        required: true,
    },
    patientPhone: {
        type: Object,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
    },
    payment: {
        type: String,
        default: "unpaid",
    },
    createdAt: {
        type: String,
        required: true,
    },
});

const appointmentModel = mongoose.model("appointments", appointmentSchema);
module.exports = appointmentModel;
