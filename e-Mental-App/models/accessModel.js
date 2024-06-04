const mongoose = require("mongoose");

const accessSchema = new mongoose.Schema(
    {
        userKey: {
            type: String,
            required: [true, "Key is required"],
        },
        patientKey: {
            type: String,
            required: [true, "Key is required"],
        },
        userName: {
            type: String,
            required: [true, "Name is required"],
        },
        address: {
            type: String,
            required: [true, "Address is required"],
        },
        userType: {
            type: String,
            required: [true, "User type is needed"],
        },
    },
    { timestamps: true }
);

const accessModel = mongoose.model("access", accessSchema);
module.exports = accessModel;
