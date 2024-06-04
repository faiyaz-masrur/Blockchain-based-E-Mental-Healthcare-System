const mongoose = require("mongoose");

const researcherSchema = new mongoose.Schema({
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
    degree: {
        type: String,
        required: [true, "Degree is required"],
    },
    address: {
        type: String,
    },
    userType: {
        type: String,
        default: "candidate",
    },
    createdAt: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
});

const researcherModel = mongoose.model("researchers", researcherSchema);
module.exports = researcherModel;
