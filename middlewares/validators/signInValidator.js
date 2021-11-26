const path = require("path");
const validator = require("validator");

exports.signInValidator = async (req, res, next) => {
  try {
    const errors = [];

    if (validator.isEmpty(req.body.email)) {
      errors.push("Please input your password");
    }

    if (!validator.isEmail(req.body.email)) {
      errors.push("Email is not valid");
    }

    if (validator.isEmpty(req.body.password)) {
      errors.push("Please input your password");
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors: errors });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, errors: ["Bad request"] });
  }
};
