const mongoose = require("mongoose");
const ImageSchema = new mongoose.Schema({
    imgName: String,
    image:{
        data: Buffer,
        contentType: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Images", ImageSchema, "Images");