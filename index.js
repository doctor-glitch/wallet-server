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

app.post("/checkout",auth, function (req, res) {
  finalPrice = req.body.price;
  signUpDiscount = 0;
  referalDiscount = 0;
  cashbackDiscount = 0;
  refundsDiscount = 0;
  referalCommDiscount = 0;
  SalesCommDiscount = 0;

  mainBalance = req.session.user.cashback + req.session.user.refunds + req.session.user.referalComm + req.session.user.SalesComm;
  //calculate signupDiscount
  if (req.body.signUp == true) {
    signUpDiscount = (0.1 * req.body.price)
    if (req.session.user.signupCredit < signUpDiscount) {
      signUpDiscount = req.session.user.signupCredit;
    }
    finalPrice = req.body.price - signUpDiscount;
  }

  //calculate referalDiscount
  if (req.body.referal == true) {
    // referalDiscount = req.session.user.referalCredit;
    // else if (referalDiscount >= finalPrice) {
    //   referalDiscount = referalDiscount - finalPrice;
    //   finalPrice = 0;
    // } else {
    //   finalPrice = finalPrice - referalDiscount;
    //   referalDiscount = req.session.user.referalCredit - finalPrice;
    // }
    if (finalPrice >= req.session.user.referalCredit && req.session.user.referalCredit != 0) {
      referalDiscount = req.session.user.referalCredit;
      finalPrice = finalPrice - referalDiscount;
    } else {
      referalDiscount = req.session.user.referalCredit - finalPrice;
      finalPrice = 0;
    }
  }

  //deduct from main balance
  if (req.body.mainBal == true) {
    if (mainBalance == 0) {
      console.log("check1");
      return res.json({
        finalPrice,
        signUpDiscount,
        referalDiscount,
        cashbackDiscount,
        refundsDiscount,
        referalCommDiscount,
        SalesCommDiscount,
      });
    } else {
      //cashback discount
      if (finalPrice >= req.session.user.cashback && req.session.user.cashback != 0) {
        cashbackDiscount = req.session.user.cashback;
        finalPrice = finalPrice - cashbackDiscount;
      } else {
        cashbackDiscount = req.session.user.cashback - finalPrice;
        finalPrice = 0;
      }

      //refunds discount
      if (finalPrice >= req.session.user.refunds && req.session.user.refunds != 0) {
        refundsDiscount = req.session.user.refunds;
        finalPrice = finalPrice - refundsDiscount;
      } else {
        refundsDiscount = req.session.user.refunds - finalPrice;
        finalPrice = 0;
      }

      //referalComm discount
      if (finalPrice >= req.session.user.referalComm && req.session.user.referalComm != 0) {
        referalCommDiscount = req.session.user.referalComm;
        finalPrice = finalPrice - referalCommDiscount;
      } else {
        referalCommDiscount = req.session.user.referalComm - finalPrice;
        finalPrice = 0;
      }

      //SalesComm discount
      if (finalPrice >= req.session.user.SalesComm && req.session.user.SalesComm != 0) {
        SalesCommDiscount = req.session.user.SalesComm;
        finalPrice = finalPrice - SalesCommDiscount;
      } else {
        SalesCommDiscount = req.session.user.SalesComm - finalPrice;
        finalPrice = 0;
      }
      console.log("check2");
      return res.json({
        finalPrice,
        signUpDiscount,
        referalDiscount,
        cashbackDiscount,
        refundsDiscount,
        referalCommDiscount,
        SalesCommDiscount,
      });
    }//end of else
  }
  console.log("check3");
  return res.json({
    finalPrice,
    signUpDiscount,
    referalDiscount,
    cashbackDiscount,
    refundsDiscount,
    referalCommDiscount,
    SalesCommDiscount,
  });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});