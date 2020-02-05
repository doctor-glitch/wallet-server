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

function editUser(id) {
  return db.User.update({ _id: id }, { referalComm: 10 })
}

function findUser(email, password) {
  console.log(email, password);
  return newUser = db.User.findOne({ email, password }, "-password");
}


exports.addUser = addUser;
exports.checkProduct = checkProduct;
exports.editUser = editUser;
exports.checkUser = checkUser;
exports.checkCode = checkCode;
exports.findUser = findUser;