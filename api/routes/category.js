const router = require("express").Router();
const Category = require("../models/Category");
const Books = require("../models/Books");

//getAll
router.get("/getAll", async (req, res) => {
    try {
        Category.find({}).exec((err, category) => {
            if (err) {
                res.status(401).json(err.message);
            } else {
                if (category.length == 0) {
                    res.status(401).json({
                        message: "Category not found"
                    });
                } else {
                    res.status(200).json(category);
                }
            }
        });
    } catch (error) {
        res.status(401).json(error.message);
    }
});
//Search by Name
router.get("/:Name", async (req, res) => {
    Category.findOne({
        name: req.params.Name
    }).exec((err, category) => {
        if (err) {
            return res.status(401).json({
                message: "Category not found"
            });
        } else {
            if (category == null) {
                res.status(401).json({
                    message: "Book not found"
                })
            } else {
                res.status(200).json(category);
            }
        }
    });
});
//insert new Category
router.post("/insertCategory", async (req, res) => {
    try {
        if (req.body.name.length == 0) {
            return res.status(300).json({
                message: "Thông tin rỗng"
            });
        }
        let Cate = {
            name: req.body.name,
        }
        const newCategory = Category.create(Cate);
        res.status(200).json({
            message: "Insert Complete"
        });
    } catch (error) {
        res.status(401).json({
            message: "Insert Failed"
        });
    }
});
//Update Category
router.put("/:ID", async (req, res) => {
    try {
        // Books.find({}).exec((err, book) => {
        //     if (err) {
        //         res.status(301).json({
        //             message: err.message
        //         });
        //     } else {
        //         flag = false;
        //         book.map(b => {
        //             b.category.map(item => {
        //                 if (item === req.body.name) {
        //                     flag = true;
        //                 }
        //             })
        //         })
        //         if (flag === false) {
        //             Category.findOne({
        //                 _id: req.params.ID
        //             }).exec((err, category) => {
        //                 if (err) {
        //                     return res.status(401).json({
        //                         message: err.message
        //                     });
        //                 } else {
        //                     if (category == null) {
        //                         res.status(401).json({
        //                             message: "Book not found"
        //                         })
        //                     } else {
        //                         if (req.body.name.length == 0) {
        //                             return res.status(300).json({
        //                                 message: "Thông tin rỗng"
        //                             });
        //                         }
        //                         category.name = req.body.name;
        //                         category.save();
        //                         res.status(200).json({
        //                             message: "Update Completely"
        //                         });
        //                     }
        //                 }
        //             });
        //         } else {
        //             res.status(301).json({
        //                 message: "You can't edit this Category because there are books in it!!!"
        //             });
        //         }
        //     }
        // });
        const book = await Books.find({});
        const category = await Category.findOne({ _id: req.params.ID });
        if (book != null) {
            let flag = false;
            book.map(b => {
                b.category.map(item => {
                    if (item === category.name) {
                        flag = true;
                    }
                })
            })
            if (flag == false) {
                category.name = req.body.name;
                category.save()
                res.status(200).json({
                    message: "Update Completely"
                });
            } else {
                res.status(301).json({
                    message: "You can't edit this Category because there are books in it!!!"
                });
            }
        } else {
            category.name = req.body.name;
            category.save()
            res.status(200).json({
                message: "Update Completely"
            });
        }
    } catch (error) {
        res.status(402).json(error.message);
    }
});
//Delete Category
router.delete("/:name", async (req, res) => {
    try {
        Books.find({}).exec((err, book) => {
            if (err) {
                res.status(301).json({
                    message: err.message
                });
            } else {
                flag = false;
                book.map(b => {
                    b.category.map(item => {
                        if (item === req.params.name) {
                            flag = true;
                        }
                    })
                })
                if (flag === false) {
                    Category.findOne({
                        name: req.params.name
                    }).exec((err, category) => {
                        if (err) {
                            return res.status(401).json({
                                message: err.message
                            });
                        } else {
                            if (category == null) {
                                res.status(401).json({
                                    message: "Book not found"
                                })
                            } else {
                                Category.deleteOne({
                                    name: req.params.name
                                }).exec((err, c) => {
                                    if (err) {
                                        return res.status(401).json({
                                            message: err.message
                                        });
                                    } else {
                                        res.status(200).json({
                                            message: "Delete Complete"
                                        });
                                    }
                                });
                            }
                        }
                    });
                } else {
                    res.status(301).json({
                        message: "You can't delete this Category because there are books in it!!!"
                    });
                }
            }
        });
    } catch (error) {
        res.status(401).json(error.message);
    }
});

module.exports = router;