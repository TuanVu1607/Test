const {
    verifySignUp
} = require("../middlewares");
const controller = require("../controllers/AuthController");
const express = require("express");
const app = express();
app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});
//Register
app.post("/signup", [verifySignUp.checkDuplicateGmail], controller.signup);
//Login
app.post("/signin", controller.signin);
// LOGOUT
app.get('/logout', (req, res) => {
    try {
        res.clearCookie('nToken');
        res.status(200).json({
            message: "Logout Successful"
        });
    } catch (error) {
        res.status(401).json({
            message: "Logout Fail"
        });
    }
});
module.exports = app