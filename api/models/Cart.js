const mongoose = require("mongoose");
const ItemList = new mongoose.Schema({
    quantity: Number,
});
const CartSchema= new mongoose.Schema({
    gmail: String,
    items:[ItemList],
});

module.exports = mongoose.model("Cart",CartSchema,"Cart");