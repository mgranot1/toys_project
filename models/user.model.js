const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


let userSchema = new mongoose.Schema({
  fullName: {
    firstName: String,
    lastName: String
  },
  email: String,
  password: String,
  date_created: {
    type: Date, default: Date.now()
  },
  // role of the user if regular user or admin
  role: {
    type: String, default: "user"
  }
})

exports.UserModel = mongoose.model("users", userSchema);

exports.getToken = (_userId) => {
  const token = jwt.sign({ _id: _userId }, "Michal", { expiresIn: "60mins" });
  return token
}



