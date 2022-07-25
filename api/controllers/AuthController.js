const config = require("../config/authconfig");
const Account = require("../models/Account");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
//Register
exports.signup = (req, res) => {
    const user = new Account({
        gmail: req.body.gmail,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 8),
        username: req.body.username,
        role: req.body.role,
    });
    user.save(err => {
        if (err) {
            res.status(500).send({
                message: err
            });
            return;
        } else {
            //đăng ký token
            var token = jwt.sign({
                id: user.id,
                username: user.username,
                role: user.role,
            }, config.secret, {
                expiresIn: 86400 // tồn tại trong 24 hours
            });
            // Set a cookie and redirect to root
            res.cookie('nToken', token, {
                maxAge: 86400,
                httpOnly: true
            });
            //trả về account
            res.status(200).send({
                message: "User was registered successfully!",
                USER: {
                    id: user._id,
                    username: user.username,
                    gmail: user.gmail,
                    role: user.role,
                    accessToken: token
                },
            });
        }
    });
};
//Login
exports.signin = (req, res) => {
    Account.findOne({
            username: req.body.username
        })
        .exec((err, user) => {
            if (err) {
                res.status(500).send({
                    message: err
                });
                return;
            }
            if (!user) {
                return res.send({
                    message: "Invalid User!"
                });
            }
            //check password
            var passwordIsValid = bcrypt.compareSync(
                req.body.passwordHash,
                user.passwordHash
            );
            if (!passwordIsValid) {
                return res.send({
                    message: "Invalid Password!"
                });
            }
            //đăng ký token
            var token = jwt.sign({
                id: user.id,
                username: user.username,
                role: user.role,
            }, config.secret, {
                expiresIn: 86400 // tồn tại trong 24 hours
            });
            // Set a cookie and redirect to root
            res.cookie('nToken', token, {
                maxAge: 86400,
                httpOnly: true
            });
            //trả về account
            res.status(200).send({
                message: "Login successful",
                USER: {
                    id: user._id,
                    username: user.username,
                    gmail: user.gmail,
                    role: user.role,
                    accessToken: token
                },
            });
        });
};