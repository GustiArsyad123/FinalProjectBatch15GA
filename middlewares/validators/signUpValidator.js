const path = require("path");
const validator = require("validator");
const { user } = require("../../models");

exports.signUpValidator = async (req, res, next) => {
  try {
    const errors = [];

    if (validator.isEmpty(req.body.userName)) {
      errors.push("Username cannot be empty");
    }
    if (!validator.isEmail(req.body.email)) {
      errors.push("Email cannot be empty");
    }
    if (req.body.password !== req.body.confirmPassword) {
      errors.push("Password and confirm Password didn't match!");
    }
    if (validator.isStrongPassword(req.body.password)){
      errors.push("Password must has at least 8 characters that include at least 1 lowercase character, 1 uppercase characters, and 1 number");
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors: errors });
    }

    next();
  } catch (error) {
    res.status(401).json({ success: false, errors: ["Bad request"] });
  }
};
