const express = require("express");
const session = require("express-session");
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const user = require('./user/user')

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

app.use(session({
  secret: 'harinqwert@13',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

var auth = function (req, res, next) {
  if (req.session.user) {
    next();
  }
  else {
    return res.status(401).json({ message: "please login" });
  }
}  

app.use(bodyParser.json());

app.post("/", function (req, res) {

})

app.post("/register", function (req, res) {
  user.checkUser(req.body.email).then(data => {
    if (data) {
      return res.status(422).json({ message: "User exists" });
    } else {
      let newUser = req.body;
      newUser.referalId = req.body.fname + "hello";
      newUser.signupCredit = 100;
      newUser.refCredit = 280;
      newUser.cashback = 0;
      newUser.referalComm = 0;
      newUser.refunds = 0;
      newUser.SalesComm = 0;
      user.addUser(newUser).then(data => {
        req.session.user = data;
        return res.json({ message: "helo registered usr", user: data });
      })
    }
  })
});

app.post("/login", function (req, res) {
  user.findUser(req.body.email, req.body.password).then(data => {
    console.log(data);
    if (data) {
      req.session.user = data;
      return res.json({ message: "helo usr", user: data });
    } else {
      return res.status(422).json({ message: "User doesnt exists" });
    }
  })
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});