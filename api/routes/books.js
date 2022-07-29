const router = require("express").Router();
const Books = require("../models/Books");
const Images = require("../models/Image");
const Cart = require("../models/Cart");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Account = require("../models/Account");
//Storage
const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "img");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: Storage,
}).array("image");

//Get All Books
router.get("/getAll", async (req, res) => {
    Books.find({}).exec((err, books) => {
        if (err) {
            res.status(401).json({
                message: "Books not found",
            });
        } else {
            if (books.length == 0) {
                res.status(401).json({
                    message: "Book not found",
                });
            } else {
                res.status(200).json(books);
            }
        }
    });
});
//Get A Book By ID
router.get("/:ID", async (req, res) => {
    Books.findOne({
        _id: req.params.ID,
    }).exec((err, books) => {
        if (err) {
            res.status(401).json({
                message: "Book not found",
            });
        } else {
            if (books == null) {
                res.status(401).json({
                    message: "Book not found",
                });
            } else {
                res.status(200).json(books);
            }
        }
    });
});
//Search Book By Name
router.get("/search/name/:Name", async (req, res) => {
    Books.find({
        name: {
            $regex: req.params.Name,
            $options: "i",
        },
    }).exec((err, books) => {
        if (err) {
            res.status(401).json({
                message: "Book not found",
            });
        } else {
            if (books.length === 0) {
                res.status(401).json({
                    message: "Book not found",
                });
            } else {
                res.status(200).json(books);
            }
        }
    });
});
//Search Book by Author
router.get("/search/author/:Author", async (req, res) => {
    Books.find({
        author: {
            $regex: req.params.Author,
            $options: "i",
        },
    }).exec((err, books) => {
        if (err) {
            res.status(401).json({
                message: "Book not found",
            });
        } else {
            if (books.length === 0) {
                res.status(401).json({
                    message: "Book not found",
                });
            } else {
                res.status(200).json(books);
            }
        }
    });
});
//Search Book by Publisher
router.get("/search/publisher/:Publisher", async (req, res) => {
    Books.find({
        publisher: {
            $regex: req.params.Publisher,
            $options: "i",
        },
    }).exec((err, books) => {
        if (err) {
            res.status(401).json({
                message: "Book not found",
            });
        } else {
            if (books.length === 0) {
                res.status(401).json({
                    message: "Book not found",
                });
            } else {
                res.status(200).json(books);
            }
        }
    });
});
//Combine Search BookName+Author+Publisher
router.get("/search/condition/:condition", async (req, res) => {
    const result = await Books.find({
        "$or": [{
            "name": { $regex: req.params.condition, $options: "i", }
        }, {
            "author": { $regex: req.params.condition, $options: "i", }
        }, {
            "publisher": { $regex: req.params.condition, $options: "i", }
        }]
    });

    if (result.length > 0) {
        return res.status(200).json(result)
    } else {
        return res.status(401).json({
            message: "Book not found"
        });
    }
});
//Filter Book By Category
router.get("/filter/:category", async (req, res) => {
    Books.find({}).exec(async (err, books) => {
        if (err) {
            res.status(401).json({
                message: "Books not found",
            });
        } else {
            if (books.length == 0) {
                res.status(401).json({
                    message: "Book not found",
                });
            } else {
                let book = [];
                books.forEach((b) => {
                    b.category.forEach((item) => {
                        if (item === req.params.category) {
                            book.push(b);
                        }
                    });
                });
                res.status(200).json(book);
            }
        }
    });
});
//Insert New Book
router.post("/insertBook", async (req, res) => {
    try {
        upload(req, res, (err) => {
            var IMG = [];
            if (
                req.body.name.length == 0 ||
                req.body.author.length == 0 ||
                req.body.publisher.length == 0 ||
                req.body.numberInStock.length == 0 ||
                req.body.category.length == 0 ||
                req.body.price.length == 0 ||
                req.body.description.length == 0 ||
                req.files.length == 0
            ) {
                return res.status(300).json({
                    message: "Thông tin rỗng!",
                });
            }
            // Vòng lặp để lưu chuỗi các hình ảnh
            for (let i = 0; i < req.files.length; i++) {
                const img = {
                    imgName: req.files[i].originalname,
                    image: {
                        data: fs.readFileSync(path.join("img/" + req.files[i].filename)),
                        contentType: "image/png",
                    },
                };
                Images.create(img, (err, item) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Error Create Image",
                        });
                    } else {
                        item.save();
                    }
                });
                IMG.push(
                    "http://192.168.1.4:3000/api/image/" + req.files[i].originalname
                );
            }
            var cate = JSON.parse(req.body.category);
            var Cate = [];
            for (let i = 0; i < cate.length; i++) {
                Cate.push(cate[i]);
            }
            let newBook = {
                name: req.body.name,
                description: req.body.description,
                author: req.body.author,
                publisher: req.body.publisher,
                numberInStock: req.body.numberInStock,
                price: req.body.price,
                category: Cate,
                images: IMG,
            };
            var newBookSaved = Books.create(newBook);
            res.status(200).json({
                message: "Insert Completely",
            });
        });
    } catch (error) {
        res.status(401).json({
            message: error.message,
        });
    }
});
//Update Book
router.put("/:ID", async (req, res) => {
    try {
        Books.findOne({
            _id: req.params.ID,
        }).exec((err, book) => {
            if (err) {
                return res.status(401).json({
                    message: "Book not found",
                });
            } else {
                upload(req, res, (err) => {
                    if (
                        req.body.name.length == 0 ||
                        req.body.author.length == 0 ||
                        req.body.publisher.length == 0 ||
                        req.body.numberInStock.length == 0 ||
                        req.body.category.length == 0 ||
                        req.body.price.length == 0 ||
                        req.body.description.length == 0
                    ) {
                        return res.status(300).json({
                            message: "Thông tin rỗng!",
                        });
                    }
                    var IMG = [];
                    if (req.files.length != 0) {
                        for (let i = 0; i < req.files.length; i++) {
                            const img = {
                                imgName: req.files[i].originalname,
                                image: {
                                    data: fs.readFileSync(
                                        path.join("img/" + req.files[i].filename)
                                    ),
                                    contentType: "image/png",
                                },
                            };
                            Images.create(img, (err, item) => {
                                if (err) {
                                    return res.status(401).json({
                                        message: "Error Create Image",
                                    });
                                } else {
                                    item.save();
                                }
                            });
                            IMG.push(
                                "http://192.168.1.4:3000/api/image/" + req.files[i].originalname
                            );
                        }
                    }

                    var cate = JSON.parse(req.body.category);
                    var Cate = [];
                    for (let i = 0; i < cate.length; i++) {
                        Cate.push(cate[i]);
                    }

                    book.name = req.body.name;
                    book.author = req.body.author;
                    book.publisher = req.body.publisher;
                    book.numberInStock = req.body.numberInStock;
                    book.price = req.body.price;
                    book.description = req.body.description;
                    book.category = Cate;
                    if (req.files.length != 0) {
                        book.images = IMG;
                    }
                    book.save();
                    res.status(200).json({
                        message: "Update Completely",
                    });
                });
            }
        });
    } catch (error) {
        res.status(401).json({
            message: "Update Failed",
        });
    }
});
//Delete Book
router.delete("/:ID", async (req, res) => {
    try {
        Cart.find({}).exec(async (err, cart) => {
            if (err) {
                return res.status(401).json({
                    message: err.message
                })
            } else {
                flag = false
                cart.forEach(item => {
                    item.items.forEach(i => {
                        if (i._id == req.params.ID) {
                            flag = true;
                        }
                    })
                })
                if (flag === false) {
                    const books = await Books.deleteOne({
                        _id: req.params.ID,
                    });
                    res.status(200).json({
                        message: "Delete Completely",
                    });
                } else {
                    res.status(301).json({
                        message: "This book cannot be delete because it is in User's Cart",
                    });
                }
            }
        });
    } catch (error) {
        res.status(401).json({
            message: error.message,
        });
    }
});
//Rating Book
router.post("/ratings/:ID", async (req, res) => {
    try {
        Books.findOne({
            _id: req.params.ID
        }).exec((err, book) => {
            if (err) {
                return res.status(401).json({
                    message: err.message
                })
            } else {
                book.rating.push({
                    gmail: req.body.gmail,
                    ratingValue: req.body.ratingValue,
                    commentText: req.body.commentText,
                })
                book.save();
                return res.status(200).json({
                    message: "Rating Successful"
                })
            }
        })
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
});

//Get All Rating Of Book
router.get("/ratings/:ID", async (req, res) => {
    try {
        Books.findOne({
            _id: req.params.ID
        }).exec(async (err, book) => {
            if (err) {
                return res.status(401).json({
                    message: "Book not found"
                })
            } else {
                if (book.rating.length > 0) {
                    var Rating = await Promise.all(
                        book.rating.map(async (item) => {
                            const acc = await Account.findOne({ gmail: item.gmail });
                            var date_ob = item.ratingDate;
                            var day = ("0" + date_ob.getDate()).slice(-2);
                            var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                            var year = date_ob.getFullYear();
                            var date = day + "-" + month + "-" + year;
                            var hours = date_ob.getHours();
                            var minutes = date_ob.getMinutes();
                            var seconds = date_ob.getSeconds();
                            var time = hours + ":" + minutes + ":" + seconds;
                            var dateTime = date + " | " + time;
                            return ({
                                username: acc.username,
                                _id: item._id,
                                gmail: item.gmail,
                                ratingValue: item.ratingValue,
                                ratingDate: dateTime,
                                commentText: item.commentText,
                            })
                        })
                    );
                    return res.status(200).json(Rating)
                } else {
                    return res.status(200).json({
                        message: "Rating is Empty"
                    })
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