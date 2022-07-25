const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({ 
    gmail: String, 
    ratingValue: Number, 
    ratingDate: { type: Date, default: Date.now }, 
    commentText: String,
})
const BookSchema = new mongoose.Schema({
    name: String,
    description: String,
    publisher: String,
    numberInStock: Number,
    price: Number,
    author: String,
    category: [String],
    rating: [ratingSchema],
    images: [String],
}, {
    timestamps: true
});

module.exports = mongoose.model("Books", BookSchema, "Books");