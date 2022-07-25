const router = require("express").Router();
const Books = require("../models/Books");
const Cart = require("../models/Cart");

//Get All Item in Cart
router.get("/getAll/:gmail", async (req, res) => {
    try {
        Cart.findOne({
            gmail: req.params.gmail
        }).exec(async (err, cart) => {
            if (err) {
                return res.status(401).json({
                    message: err.message
                });
            } else {
                if (cart == null) {
                    res.status(200).json({
                        message: "Cart is Empty"
                    })
                } else {
                    let ItemList = await Promise.all(
                        cart.items.map(async (item) => {
                            const books = await Books.findOne({
                                _id: item._id
                            });
                            return ({
                                quantity: item.quantity,
                                _id: books._id,
                                name: books.name,
                                price: books.price,
                                images: books.images[0],
                            });
                        })
                    );
                    let CartList = {
                        gmail: cart.gmail,
                        items: ItemList,
                    };
                    res.status(200).json(CartList);
                }
            }
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
});
//Add New Item to Cart
router.post("/addToCart/:ID", async (req, res) => {
    try {
        Cart.findOne({
            gmail: req.body.gmail
        }).exec((err, cart) => {
            if (err) {
                return res.status(401).json({
                    message: err.message
                });
            } else {
                if (cart == null) {
                    Cart.create({
                        gmail: req.body.gmail,
                        items: {
                            _id: req.params.ID,
                            quantity: req.body.quantity,
                        }
                    });
                    res.status(200).json({
                        message: "Add Completely"
                    });
                } else {
                    let flag = false;
                    cart.items.map((item) => {
                        if (item._id == req.params.ID) {
                            item.quantity = item.quantity * 1 + req.body.quantity * 1;
                            flag = true;
                        }
                    });
                    if (flag == false) {
                        cart.items.push({
                            _id: req.params.ID,
                            quantity: req.body.quantity,
                        })
                    }
                    cart.save();
                    res.status(200).json({
                        message: "Add Completely"
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
//Update Cart
router.put("/updateCart/:ID", async (req, res) => {
    try {
        Cart.findOne({
            gmail: req.body.gmail
        }).exec((err, cart) => {
            if (err) {
                return res.status(401).json({
                    message: err.message
                });
            } else {
                cart.items.map((item) => {
                    if (item._id == req.params.ID) {
                        item.quantity = req.body.quantity;
                    }
                });
                cart.save();
                res.status(200).json({
                    message: "Update Completely"
                });
            }
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
});
//delete Item in Cart
router.delete("/deleteItemCart/:ID", async (req, res) => {
    try {
        Cart.findOne({
            gmail: req.body.gmail
        }).exec((err, cart) => {
            if (err) {
                return res.status(401).json({
                    message: err.message
                });
            } else {
                const index = cart.items.findIndex((item) => item._id == req.params.ID);
                if (index != -1) {
                    cart.items[index].remove();
                }
                cart.save();
                res.status(200).json({
                    message: "Delete completely"
                });
            }
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
});
//delete All Cart Of User
router.delete("/cleanCart", async (req, res) => {
    try {
        const cart = await Cart.deleteOne({
            gmail: req.body.gmail
        });
        res.status(200).json({
            message: "Delete Completely"
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
});

module.exports = router;