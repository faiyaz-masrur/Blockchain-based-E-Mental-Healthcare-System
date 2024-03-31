const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
            if (err) {
                return res.status(200).send({
                    success: false,
                    message: "Authentication Failed!",
                });
            } else {
                req.body.key = decode.key;
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
