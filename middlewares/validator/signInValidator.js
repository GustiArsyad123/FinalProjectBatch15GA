const path = require("path");
const crypto = require("crypto");
const validator = require("validator");
const { promisify } = require("util");
const UsersController = require("../../controllers/users");
const { users } = require("../../models");

exports.signInValidator = async (req, res, next) => {
  try {
    const errors = [];

    if (!validator.isEmail(req.body.email)) {
      errors.push("Email is not valid");
    }
    if (req.body.password !== req.body.confirmPassword) {
      errors.push("Password and confirm Password didn't match!");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors: errors, sucees: false });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ errors: ["Bad request"], sucsess: false });
  }
};
