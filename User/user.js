const db = require("../db");

function addUser(user) {
  const newUser = new db.User(user);
  return newUser.save();
}
function checkUser(email) {
  return newUser = db.User.findOne({ email: email });
}
function checkProduct(id) {
  return newProduct = db.Product.findOne({ _id: id });
}

function checkCode(referedBy) {
  return newUser = db.User.findOne({ referalCode: referedBy })
}
function addSalesComm(referedBy) {
  console.log("h1 from edit find referal");
  return newUser = db.User.findOne({ referalCode: referedBy })
}

function updateSalesComm(id, price) {
  commission = 0.1 * price;
  console.log("h1 from edit commision");
  return db.User.update({ _id: id }, { SalesComm: commission })
}
function editUser(id) {
  return db.User.update({ _id: id }, { referalComm: 10 })
}

function editUserBal(_id, signupCredit, referalCredit, cashback, refunds, referalComm, SalesComm) {
  console.log("h1 from edit balance",_id);
  console.log(_id, signupCredit, referalCredit, cashback, refunds, referalComm, SalesComm);
  return db.User.update({ _id }, { signupCredit, referalCredit, cashback, refunds, referalComm, SalesComm })
}

function findUser(email, password) {
  console.log(email, password);
  return newUser = db.User.findOne({ email, password }, "-password");
}

exports.addSalesComm = addSalesComm;
exports.updateSalesComm = updateSalesComm;
exports.addUser = addUser;
exports.checkProduct = checkProduct;
exports.editUser = editUser;
exports.editUserBal = editUserBal;
exports.checkUser = checkUser;
exports.checkCode = checkCode;
exports.findUser = findUser;