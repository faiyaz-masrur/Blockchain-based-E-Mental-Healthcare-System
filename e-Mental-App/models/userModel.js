const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        nid: {
            type: String,
            required: [true, "NID is required"],
        },
        userType: {
            type: String,
            required: [true, "User type is needed"],
        },
        status: {
            type: String,
            required: [true, "Status is needed"],
        },
        notification: {
            type: Array,
            default: [],
        },
        seenNotification: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
