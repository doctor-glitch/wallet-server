const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/wallet", { useNewUrlParser: true, useUnifiedTopology: true });


const User = mongoose.model("user", {
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  referalId:{
    type: String,
    required: true
  },
  signupCredit:{
    type: Number,
    required: true
  },
  refCredit:{
    type: Number,
    required: true
  },
  cashback:{
    type: Number,
  },
  refunds:{
    type: Number,
  },
  referalComm:{
    type: Number,
  },
  SalesComm:{
    type: Number,
  },

})

exports.User = User;