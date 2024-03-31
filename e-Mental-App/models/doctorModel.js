const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        nid: {
            type: String,
            required: [true, "NID is required"],
        },
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        website: {
            type: String,
        },
        address: {
            type: String,
            required: [true, "Address is required"],
        },
        specialization: {
            type: String,
            required: [true, "Specialization is required"],
        },
        experience: {
            type: String,
            required: [true, "Experience is required"],
        },
        fees: {
            type: Number,
            required: [true, "Fees is required"],
        },
        time: {
            type: Object,
            requied: [true, "Timing is required"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
    },
    { timestamps: true }
);

const doctorModel = mongoose.model("doctors", doctorSchema);
module.exports = doctorModel;
