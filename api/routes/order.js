const router = require("express").Router();
const Cart = require("../models/Cart");
const Order = require("../models/Orders");
const Book = require("../models/Books");

//Get All Orders
router.get("/getAll", async (req, res) => {
    Order.find({}).exec((err, order) => {
        if (err) {
            res.status(401).json({
                message: "Fail to get Orders"
            })
        } else {
            if (order.length == 0) {
                res.status(401).json({
                    message: "Orders not found"
                });
            } else {
                let orders = [];
                order.map((item) => {
                    if (item.status[0].isSuccessful === true) {
                        orders.push({
                            _id: item._id,
                            gmail: item.gmail,
                            status: "Successful",
                            totalPayment: item.totalPayment,
                            shippingAddress: item.shippingAddress[0].address,
                            dateTime: item.dateTime[0].date,
                        });
                    } else {
                        if (item.status[0].isDelivery === true) {
                            orders.push({
                                _id: item._id,
                                gmail: item.gmail,
                                status: "In Delivery",
                                totalPayment: item.totalPayment,
                                shippingAddress: item.shippingAddress[0].address,
                                dateTime: item.dateTime[0].date,
                            });
                        } else {
                            if (item.status[0].isAccept === true) {
                                orders.push({
                                    _id: item._id,
                                    gmail: item.gmail,
                                    status: "Accepted",
                                    totalPayment: item.totalPayment,
                                    shippingAddress: item.shippingAddress[0].address,
                                    dateTime: item.dateTime[0].date,
                                });
                            } else {
                                orders.push({
                                    _id: item._id,
                                    gmail: item.gmail,
                                    status: "Awaiting Approval",
                                    totalPayment: item.totalPayment,
                                    shippingAddress: item.shippingAddress[0].address,
                                    dateTime: item.dateTime[0].date,
                                });
                            }
                        }
                    }
                });
                res.status(200).json(orders);
            }
        }
    })
});
//Get All Year
router.get("/getYear", async (req, res) => {
    try {
        const order = await Order.find({});
        let arrayYear = [];
        order.map((item) => {
            const month = item.dateTime[0].date.split("-");
            if (arrayYear.includes(month[2]) === false) {
                arrayYear.push(month[2])
            }
        });
        return res.status(200).json(arrayYear.sort());
    } catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
});
//Calculate Sales By Month
router.get("/statisticByMonth/:year", async (req, res) => {
    try {
        const order = await Order.find({});
        let totalSales1 = 0;
        let totalSales2 = 0;
        let totalSales3 = 0;
        let totalSales4 = 0;
        let totalSales5 = 0;
        let totalSales6 = 0;
        let totalSales7 = 0;
        let totalSales8 = 0;
        let totalSales9 = 0;
        let totalSales10 = 0;
        let totalSales11 = 0;
        let totalSales12 = 0;
        order.map((item) => {
            const month = item.dateTime[0].date.split("-");
            if (month[2] === req.params.year) {
                if (item.status[0].isSuccessful === true) {
                    switch (month[1]) {
                        case "01":
                            totalSales1 += item.totalPayment;
                            break;
                        case "02":
                            totalSales2 += item.totalPayment;
                            break;
                        case "03":
                            totalSales3 += item.totalPayment;
                            break;
                        case "04":
                            totalSales4 += item.totalPayment;
                            break;
                        case "05":
                            totalSales5 += item.totalPayment;
                            break;
                        case "06":
                            totalSales6 += item.totalPayment;
                            break;
                        case "07":
                            totalSales7 += item.totalPayment;
                            break;
                        case "08":
                            totalSales8 += item.totalPayment;
                            break;
                        case "09":
                            totalSales9 += item.totalPayment;
                            break;
                        case "10":
                            totalSales10 += item.totalPayment;
                            break;
                        case "11":
                            totalSales11 += item.totalPayment;
                            break;
                        case "12":
                            totalSales12 += item.totalPayment;
                            break;

                        default:
                            res.status.json({
                                message: "Error"
                            })
                            break;
                    }
                }
            }
        });
        var Sales = [totalSales1, totalSales2, totalSales3, totalSales4, totalSales5, totalSales6, totalSales7, totalSales8, totalSales9, totalSales10, totalSales11, totalSales12];
        return res.status(200).json(Sales);
    } catch (error) {
        res.status(401).json({
            message: error.message
        })
    }
});
//Calculate Sales By Month
router.get("/statisticByYear", async (req, res) => {
    try {
        const order = await Order.find({});
        let arrayYear = [];
        order.map((item) => {
            const month = item.dateTime[0].date.split("-");
            if (arrayYear.includes(month[2]) === false) {
                arrayYear.push(month[2])
            }
        });
        let newArray = arrayYear.sort();
        let Sales = new Array(newArray.length);
        newArray.map((items, index) => {
            let total = 0;
            order.map((item) => {
                const month = item.dateTime[0].date.split("-");
                if (month[2] === items) {
                    if (item.status[0].isSuccessful === true) {
                        Sales[index] = total += item.totalPayment;
                    }
                }
            });
        })
        return res.status(200).json(Sales);
    } catch (error) {
        res.status(401).json({
            message: error.message
        })
    }
});
//Get Orders by gmail of User
router.get("/:gmail", async (req, res) => {
    Order.find({
        gmail: req.params.gmail
    }).exec((err, order) => {
        if (err) {
            res.status(401).json({
                message: "Fail to get Orders"
            });
        } else {
            if (order == null) {
                res.status(401).json({
                    message: "This User don't have any Orders"
                });
            } else {
                res.status(200).json(order);
            }
        }
    })
});
//Get Orders Detail
router.get("/:gmail/:ID", async (req, res) => {
    Order.findOne({
        gmail: req.params.gmail,
        _id: req.params.ID,
    }).exec((err, order) => {
        if (err) {
            res.status(401).json({
                message: "Fail to get Orders"
            });
        } else {
            if (order == null) {
                res.status(401).json({
                    message: "Orders not found"
                });
            } else {
                res.status(200).json(order);
            }
        }
    })
});
//Place Order
router.post("/placeOrder/:gmail", async (req, res) => {
    try {
        req.body.dataCart.forEach(element => {
            Book.findOne({
                _id: element._id
            }).exec((err, book) => {
                if (err) {
                    return res.status(301).json({
                        message: err.message
                    })
                } else {
                    if (element.quantity > book.numberInStock) {
                        return res.status(301).json({
                            message: "Sorry. Currently the store don't have enough quantity of those book"
                        })
                    }
                }
            })
        });
        var date_ob = new Date();
        var day = ("0" + date_ob.getDate()).slice(-2);
        var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        var year = date_ob.getFullYear();
        var date = day + "-" + month + "-" + year;
        var hours = date_ob.getHours();
        var minutes = date_ob.getMinutes();
        var seconds = date_ob.getSeconds();
        var time = hours + ":" + minutes + ":" + seconds;
        var dateTime = {
            date: date,
            time: time
        };

        const orderList = [];
        req.body.dataCart.forEach((item) => {
            orderList.push({
                _id: item._id,
                price: item.price,
                quantity: item.quantity,
                bookName: item.name,
                image: item.images
            });
        });
        const order = new Order({
            gmail: req.params.gmail,
            orderList: orderList,
            status: {
                isAccept: false,
                isDelivery: false,
                isSuccessful: false,
            },
            totalPayment: req.body.totalPayment,
            shippingAddress: {
                address: req.body.dataAddress.address,
                phone: req.body.dataAddress.phone,
                name: req.body.dataAddress.name
            },
            dateTime: dateTime
        });
        order.save(async (err) => {
            if (err) {
                res.status(401).json({
                    message: "Place order Failed"
                });
            } else {
                try {
                    const cart = await Cart.deleteOne({
                        gmail: req.params.gmail
                    });
                    return res.status(200).json({
                        message: "Place order Successful"
                    });
                } catch (e) {
                    return res.status(401).json({
                        message: e.message
                    });
                }
            }
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
});
//Buy Now
router.post("/buyNow/:gmail", async (req, res) => {
    try {
        var date_ob = new Date();
        var day = ("0" + date_ob.getDate()).slice(-2);
        var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        var year = date_ob.getFullYear();
        var date = day + "-" + month + "-" + year;
        var hours = date_ob.getHours();
        var minutes = date_ob.getMinutes();
        var seconds = date_ob.getSeconds();
        var time = hours + ":" + minutes + ":" + seconds;
        var dateTime = {
            date: date,
            time: time
        };
        const order = new Order({
            gmail: req.params.gmail,
            orderList: {
                _id: req.body.dataCart._id,
                price: req.body.dataCart.price,
                quantity: req.body.dataCart.quantity,
                bookName: req.body.dataCart.name,
                image: req.body.dataCart.images
            },
            status: {
                isAccept: false,
                isDelivery: false,
                isSuccessful: false,
            },
            totalPayment: req.body.totalPayment,
            shippingAddress: {
                address: req.body.dataAddress.address,
                phone: req.body.dataAddress.phone,
                name: req.body.dataAddress.name
            },
            dateTime: dateTime
        });
        order.save(async (err) => {
            if (err) {
                res.status(401).json({
                    message: "Place order Failed"
                });
            } else {
                res.status(200).json({
                    message: "Place order Successful"
                });
            }
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
});
//Change Status
router.put("/setStatus/:gmail/:ID", async (req, res) => {
    try {
        Order.findOne({
            gmail: req.params.gmail,
            _id: req.params.ID,
        }).exec((err, order) => {
            if (err) {
                res.status(401).json({
                    message: "Fail to get Orders"
                });
            } else {
                if (order == null) {
                    res.status(401).json({
                        message: "Orders not found"
                    });
                } else {
                    if (req.body.action === "accept") {
                        order.status[0].isAccept = true;
                    }
                    else if (req.body.action === "delivery") {
                        order.status[0].isDelivery = true;
                    }
                    else if (req.body.action === "success") {
                        order.status[0].isSuccessful = true;
                    }
                    order.save();
                    res.status(200).json({
                        message: "Update Complete"
                    });
                }
            }
        })
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
});

module.exports = router;