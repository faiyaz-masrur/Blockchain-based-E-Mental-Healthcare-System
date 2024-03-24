const queryUser = require("../data/queryUser");
const createUser = require("../data/createUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
    try {
        const userString = await queryUser.main({ key: req.body.nid });
        if (userString.length === 0) {
            return res
                .status(200)
                .send({ success: false, message: "User Not Found" });
        }
        const user = JSON.parse(userString);
        const isPasswordMatch = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordMatch) {
            return res.status(200).send({
                success: false,
                message: "Invalid User Id or Password!",
            });
        }
        const token = jwt.sign({ key: req.body.nid }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRY,
        });
        res.cookie(process.env.COOKIE_NAME, token, {
            maxAge: process.env.JWT_EXPIRY,
            httpOnly: true,
            signed: true,
        });
        res.locals.loggedInUser = req.body.nid;
        res.status(200).send({ success: true, message: "Register Successful" });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Error in Login Controller ${error.message}`,
        });
    }
};

const registerController = async (req, res) => {
    try {
        const existingUser = await queryUser.main({ key: req.body.nid });
        if (existingUser.length !== 0) {
            return res
                .status(422)
                .send({ success: false, message: "User Already Exist" });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        await createUser.main(req.body);
        res.status(200).send({ success: true, message: "Register Successful" });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Error in Register Controller ${error.message}`,
        });
    }
};

module.exports = { loginController, registerController };
