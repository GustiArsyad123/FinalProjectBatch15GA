const path = require("path");
const validator = require("validator");

exports.createDirectionValidator = async (req, res, next) => {
  try {
    const errors = [];

    if (validator.isNumeric(req.body.price, { ignore_whitespace: false })) {
      errors.push("Input Only Number");
    }
    if (validator.isNumeric(req.body.stock, { ignore_whitespace: false })) {
      errors.push("Input Only Number");
    }
    if (validator.isEmpty(req.body.location, { ignore_whitespace: false })) {
      errors.push("Please Check Your Location, there are not allow to null ");
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
