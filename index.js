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
  cookie: { maxAge: 6000000 }
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

app.post("/", auth, function (req, res) {
  console.log(req.body.id);
  user.checkProduct(req.body.id).then(data => {
    return res.json(data);
  })
})

app.post("/register", function (req, res) {
  user.checkUser(req.body.email).then(data => {
    if (data) {
      return res.status(422).json({ message: "User exists" });
    } else {
      let newUser = req.body;
      newUser.referalCode = (req.body.fname).substring(0, 3) + Math.floor(Math.random() * 1000);
      user.checkCode(newUser.referedBy).then(data => {
        console.log(data);
        if (data) {
          newUser.referalCredit = 100;
          user.editUser(data._id).then(data => {
            console.log("referal commision credited");
          })
        } else {
          if (newUser.referedBy) {
            return res.status(422).json({ message: "Invalid reffereal code" })
          }
          newUser.referalCredit = 0;
        }
        newUser.signupCredit = 100;
        newUser.cashback = 0;
        newUser.refunds = 0;
        newUser.SalesComm = 0;
        user.addUser(newUser).then(data => {
          req.session.user = data;
          return res.json({ message: "helo registered usr", user: data });
        })
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