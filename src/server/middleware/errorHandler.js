const mongoose = require("mongoose");
const accountError = require("../errors/accountError");
// const jobError = require("../errors/jobError");
const errorHandler = (err, req, res, next) => {
  console.log("error", err);
  if (err.code === 11000) {
    return accountError(err, req, res);
  }
  if (err instanceof mongoose.Error.ValidationError) {
    if (err.message.includes("Account validation failed")) {
      return accountError(err, req, res);
    }
    if (err.message.includes("jobData validation failed")) {
      // return jobError(err, req, res);
    }
  }
  if (err instanceof mongoose.Error) {
    if (JSON.parse(err.message).msg.includes("Incorrect")) {
      return accountError(err, req, res);
    }
  }
  return res.status(500).json({
    msg: "Something went wrong! Please try after some time",
    status: "Error",
  });
};
module.exports = errorHandler;
