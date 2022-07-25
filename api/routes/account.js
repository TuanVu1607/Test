const router = require("express").Router();
const Account = require("../models/Account");
var bcrypt = require("bcrypt");

//Account
//get All Account
router.get("/getAll", async (req, res) => {
    Account.find({}).exec((err, acc) => {
        if (err) {
            res.status(401).json({
                message: "Account not found"
            })
        } else {
            if (acc.length == 0) {
                res.status(401).json({
                    message: "Account not found"
                });
            } else {
                res.status(200).json(acc);
            }
        }
    })
});
//get Account by gmail
router.get("/search/user/mail/:gmail", async (req, res) => {
    Account.findOne({
        gmail: {
            $regex: req.params.gmail,
            $options: 'i'
        }
    }).exec((err, acc) => {
        if (err) {
            res.status(401).json({
                message: "Account not found"
            })
        } else {
            if (acc === null) {
                res.status(401).json({
                    message: "Account not found"
                })
            } else {
                res.status(200).json(acc);
            }
        }
    })
});
//get Account by Username
router.get("/search/user/name/:username", async (req, res) => {
    Account.find({
        username: {
            $regex: req.params.username,
            $options: 'i'
        }
    }).exec((err, acc) => {
        if (err) {
            res.status(401).json({
                message: "Account not found"
            })
        } else {
            if (acc.length === 0) {
                res.status(401).json({
                    message: "Account not found"
                })
            } else {
                res.status(200).json(acc);
            }
        }
    })
});
//Update Account
router.put("/:gmail", async (req, res) => {
    try {
        Account.findOne({
            gmail: req.params.gmail
        }).exec((err, acc) => {
            if (err) {
                return res.status(401).json({
                    message: "Account not found"
                });
            } else {
                if (acc == null) {
                    return res.status(401).json({
                        message: "Account not found"
                    });
                } else {
                    if (req.body.username.length === 0 && req.body.password.length !== 0 && req.body.newPassword.length !== 0) {
                        var passwordIsValid = bcrypt.compareSync(
                            req.body.password,
                            acc.passwordHash
                        );
                        if (!passwordIsValid) {
                            return res.send({
                                message: "Invalid Password!"
                            });
                        } else {
                            acc.passwordHash = bcrypt.hashSync(req.body.newPassword, 8);
                            acc.save();
                            res.status(200).json({
                                message: "Update Complete"
                            });
                        }
                    } else if (req.body.username.length !== 0 && req.body.password.length === 0 && req.body.newPassword.length === 0) {
                        acc.username = req.body.username;
                        acc.save();
                        res.status(200).json({
                            message: "Update Complete"
                        });
                    }
                }
            }
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        })
    }
});



//Shipping Address
//get All ShippingAddress
router.get("/shippingAddress/getAll/:gmail", async (req, res) => {
    Account.findOne({
        gmail: req.params.gmail
    }).exec((err, acc) => {
        if (err) {
            res.status(401).json({
                message: "Account not found"
            })
        } else {
            if (acc == null) {
                res.status(401).json({
                    message: "Account not found"
                });
            } else {
                res.status(200).json(acc.shippingAddress);
            }
        }
    })
});
//get Default Address
router.get("/shippingAddress/getDefault/:gmail", async (req, res) => {
    Account.findOne({
        gmail: req.params.gmail
    }).exec((err, acc) => {
        if (err) {
            res.status(401).json({
                message: "Account not found"
            })
        } else {
            if (acc == null) {
                res.status(401).json({
                    message: "Account not found"
                });
            } else {
                let result = {};
                acc.shippingAddress.forEach((item) => {
                    if (item.isDefault === true) {
                        result = {
                            isDefault: item.isDefault,
                            address: item.address,
                            phone: item.phone,
                            name: item.name,
                            _id: item._id
                        }
                    }
                });
                res.status(200).json(result);
            }
        }
    })
});
//get Address of User by ID
router.get("/shippingAddress/getAddress/:gmail/:ID", async (req, res) => {
    Account.findOne({
        gmail: req.params.gmail
    }).exec((err, acc) => {
        if (err) {
            res.status(401).json({
                message: "Account not found"
            })
        } else {
            if (acc == null) {
                res.status(401).json({
                    message: "Account not found"
                });
            } else {
                let result = {};
                acc.shippingAddress.forEach((item) => {
                    if (item._id == req.params.ID) {
                        result = {
                            isDefault: item.isDefault,
                            address: item.address,
                            phone: item.phone,
                            name: item.name,
                            _id: item._id
                        }
                    }
                });
                res.status(200).json(result);
            }
        }
    })
});
//Insert new ShippingAddress
router.post("/shippingAddress/:gmail", async (req, res) => {
    try {
        Account.findOne({
            gmail: req.params.gmail
        }).exec((err, acc) => {
            if (err) {
                res.status(401).json({
                    message: "Account not found"
                });
            } else {
                if (acc == null) {
                    return res.status(401).json({
                        message: "Account not found"
                    });
                } else {
                    if (req.body.name.length == 0 || req.body.phone == 0 || req.body.address == 0) {
                        res.status(300).json({
                            message: "Thông tin rỗng!"
                        });
                    } else {
                        if (req.body.isDefault == true) {
                            acc.shippingAddress.forEach((item) => {
                                item.isDefault = false;
                            });
                        }
                        acc.shippingAddress.push({
                            isDefault: req.body.isDefault,
                            address: req.body.address,
                            name: req.body.name,
                            phone: req.body.phone,
                        })
                        acc.save();
                        return res.status(200).json({
                            message: "Insert Completely",
                        });
                    }
                }
            }
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        })
    }
});
//Update ShippingAddress
router.put("/shippingAddress/:gmail", async (req, res) => {
    try {
        Account.findOne({
            gmail: req.params.gmail
        }).exec((err, acc) => {
            if (err) {
                res.status(401).json({
                    message: "Account not found"
                });
            } else {
                if (acc == null) {
                    return res.status(401).json({
                        message: "Account not found"
                    });
                } else {
                    if (req.body.name == undefined || req.body.phone == undefined || req.body.address == undefined) {
                        if (req.body.isDefault !== undefined) {
                            if (req.body.isDefault == true) {
                                acc.shippingAddress.forEach((item) => {
                                    item.isDefault = false;
                                });
                            }
                            acc.shippingAddress.forEach((item) => {
                                if (item._id == req.body.id) {
                                    item.isDefault = req.body.isDefault;
                                }
                            });
                            acc.save();
                            return res.status(200).json({
                                message: "Update Completely",
                            });
                        } else {
                            res.status(300).json({
                                message: "Thông tin rỗng!"
                            });
                        }
                    } else {
                        if (req.body.isDefault == true) {
                            acc.shippingAddress.forEach((item) => {
                                item.isDefault = false;
                            });
                        }
                        acc.shippingAddress.forEach((item) => {
                            if (item._id == req.body.id) {
                                item.isDefault = req.body.isDefault;
                                item.address = req.body.address;
                                item.name = req.body.name;
                                item.phone = req.body.phone;
                            }
                        });
                        acc.save();
                        return res.status(200).json({
                            message: "Update Completely",
                        });
                    }
                }
            }
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        })
    }
});
//Delete ShippingAddress
router.delete("/shippingAddress/:gmail", async (req, res) => {
    try {
        Account.findOne({
            gmail: req.params.gmail
        }).exec((err, acc) => {
            if (err) {
                res.status(401).json({
                    message: "Account not found"
                });
            } else {
                if (acc == null) {
                    return res.status(401).json({
                        message: "Account not found"
                    });
                } else {
                    const address = acc.shippingAddress.findIndex(item => item._id == req.body.id);
                    if (address != -1) {
                        acc.shippingAddress[address].remove();
                        acc.save();
                        return res.status(200).json({
                            message: "Delete Completely",
                        });
                    } else {
                        return res.status(402).json({
                            message: "This address not found",
                        });
                    }
                }
            }
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        })
    }
});

module.exports = router;