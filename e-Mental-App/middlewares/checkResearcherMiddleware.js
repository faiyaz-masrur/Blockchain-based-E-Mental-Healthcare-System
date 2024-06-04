module.exports = async (req, res, next) => {
    const user = req.body.userData;
    if (user.userType !== "researcher") {
        return res.status(200).send({
            success: false,
            message: "Authentication Failed!",
        });
    }
    next();
};
