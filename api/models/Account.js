const mongoose = require("mongoose");
const shippingAddressSchema = new mongoose.Schema({ 
    isDefault: { type: Boolean, default: false }, 
    address: String, 
    phone: String, 
    name: String
});
const AccountSchema = new mongoose.Schema({
    gmail: String,
    username: String,
    passwordHash: String,
    role: {type:Boolean, default: false},
    shippingAddress: [shippingAddressSchema]
}, { timestamps: true });

module.exports = mongoose.model("Account", AccountSchema, "Account");