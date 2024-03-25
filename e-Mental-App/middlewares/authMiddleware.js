const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    const cookies =
        Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
    if (cookies) {
        try {
            const token = cookies[process.env.COOKIE_NAME];
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
    } else {
        res.status(500).send({
            success: false,
            message: "Authentication Failed!",
        });
    }
};
