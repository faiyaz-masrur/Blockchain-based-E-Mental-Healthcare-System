const createDoctor = require("../data/createDoctor");
const queryUser = require("../data/queryUser");
const bcrypt = require("bcryptjs");
const doctorModel = require("../models/doctorModel");

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
        req.body.userType = "doctor";
        await createDoctor.main(req.body);
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

module.exports = { addDoctorController };
