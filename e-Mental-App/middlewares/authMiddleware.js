const jwt = require("jsonwebtoken");
const queryUser = require("../data/queryUser");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, async (err, decode) => {
            if (err) {
                return res.status(200).send({
                    success: false,
                    message: "Authentication Failed!",
                });
            } else {
                const userString = await queryUser.main({ key: decode.key });
                if (userString.length === 0) {
                    return res
                        .status(200)
                        .send({ success: false, message: "User Not Found" });
                }
                const user = JSON.parse(userString);
                if (user.status === "blocked") {
                    return res.status(200).send({
                        success: false,
                        message: "You are blocked.",
                    });
                }
                user.password = null;
                user.appointments = null;
                req.body.userData = user;
                next();
            }
        });
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Authentication Failed!",
        });
    }
};
