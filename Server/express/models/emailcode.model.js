const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//This code is used to verify an email address
const EmailCode = new Schema(
  {
    code : String,
    email : String,
    username : String
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailCode", EmailCode);
