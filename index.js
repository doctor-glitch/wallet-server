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

app.put("/edit", function (req, res) {
  signupCredit = req.session.user.signupCredit - req.body.signupCredit;
  referalCredit = req.session.user.referalCredit - req.body.referalCredit;
  cashback = req.session.user.cashback - req.body.cashback;
  refunds = req.session.user.refunds - req.body.refunds;
  referalComm = req.session.user.referalComm - req.body.referalComm;
  SalesComm = req.session.user.SalesComm - req.body.SalesComm;
  console.log(signupCredit);
  console.log(req.session.user.signupCredit);
  console.log(req.body.signupCredit);

    user.editUserBal(
      req.session.user._id,
      signupCredit,
      referalCredit,
      cashback,
      refunds,
      referalComm,
      SalesComm,
    ).then(data => {
      res.json(data);
    })
  user.addSalesComm(req.session.user.referedBy).then(data => {
    console.log("add sales promise");
    if (data) {
      user.updateSalesComm(data._id, req.body.price).then(data => {
        console.log("update sales promise");
        res.json(data);
      })
    }
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
        newUser.referalComm = 0;
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

app.post("/checkout", auth, function (req, res) {
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
    if (finalPrice >= req.session.user.referalCredit) {
      referalDiscount = req.session.user.referalCredit;
    } else {
      referalDiscount = finalPrice;
    }
    finalPrice = finalPrice - referalDiscount;
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
      if (finalPrice >= req.session.user.cashback) {
        cashbackDiscount = req.session.user.cashback;
      } else {
        cashbackDiscount = finalPrice;
      }
      finalPrice = finalPrice - cashbackDiscount;
      //refunds discount
      if (finalPrice >= req.session.user.refunds) {
        refundsDiscount = req.session.user.refunds;
      } else {
        refundsDiscount = finalPrice;
      }
      finalPrice = finalPrice - refundsDiscount;

      //referalComm discount
      if (finalPrice >= req.session.user.referalComm) {
        referalCommDiscount = req.session.user.referalComm;
      } else {
        referalCommDiscount = finalPrice;
      }
      finalPrice = finalPrice - referalCommDiscount;

      //SalesComm discount
      if (finalPrice >= req.session.user.SalesComm) {
        SalesCommDiscount = req.session.user.SalesComm;
      } else {
        SalesCommDiscount = finalPrice;
      }
      finalPrice = finalPrice - SalesCommDiscount;

      console.log("check2");
      console.log(cashbackDiscount, refundsDiscount, referalCommDiscount, SalesCommDiscount)
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