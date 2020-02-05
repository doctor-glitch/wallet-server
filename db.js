const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/wallet", { useNewUrlParser: true, useUnifiedTopology: true });

const Product = mongoose.model("product", {
  name: String, price: Number, description: String
});
const User = mongoose.model("user", {
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  referalCode: {
    type: String,
    required: true
  },
  referedBy: {
    type: String,
  },
  signupCredit: {
    type: Number,
    required: true
  },
  referalCredit: {
    type: Number,
    required: true
  },
  cashback: {
    type: Number,
  },
  refunds: {
    type: Number,
  },
  referalComm: {
    type: Number
  },
  SalesComm: {
    type: Number,
  },

})

exports.User = User;
exports.Product = Product;