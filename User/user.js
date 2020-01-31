const db = require("../db");
function addUser(user) {
  const newUser = new db.User(user);
  return newUser.save();
}
function checkUser(email) {
  return newUser = db.User.findOne({ email: email });
}

function findUser(email, password) {
  console.log(email, password);
  return newUser = db.User.findOne({ email, password }, "-password");
}


exports.addUser = addUser;
exports.checkUser = checkUser;
exports.findUser = findUser;