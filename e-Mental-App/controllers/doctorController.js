const queryUser = require("../data/queryUser");
const doctorModel = require("../models/doctorModel");
const changeUserInfo = require("../data/changeUserInfo");
const userModel = require("../models/userModel");

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

module.exports = {
    updateProfileController,
};
