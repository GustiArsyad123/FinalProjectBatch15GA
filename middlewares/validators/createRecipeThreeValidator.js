const path = require("path");
const validator = require("validator");

exports.createRecipeThreeValidator = async (req, res, next) => {
  try {
    const errors = [];

    if (validator.isEmpty(req.body.direction, { ignore_whitespace: false })) {
      errors.push("Please Check Your input, there are not allow to null ");
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
