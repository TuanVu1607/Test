const mongoose = require("mongoose");
const OrderItemSchema = new mongoose.Schema({
  _id: String,
  price: Number,
  quantity: Number,
  bookName: String,
  image: String
});
const StatusSchema = new mongoose.Schema({
  isAccept: {
    type: Boolean,
    default: false
  },
  isDelivery: {
    type: Boolean,
    default: false
  },
  isSuccessful: {
    type: Boolean,
    default: false
  },
  isCancel: {
    type: Boolean,
    default: false
  },
  reasonCancel: String,
});
const AddressSchema = new mongoose.Schema({
  address: String,
  phone: String,
  name: String
});
const DateSchema = new mongoose.Schema({
  date: String,
  time: String,
});
const OrdersSchema = new mongoose.Schema({
  gmail: String,
  orderList: [OrderItemSchema],
  status: [StatusSchema],
  totalPayment: Number,
  shippingAddress: [AddressSchema],
  dateTime: [DateSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model("Orders", OrdersSchema, "Orders");