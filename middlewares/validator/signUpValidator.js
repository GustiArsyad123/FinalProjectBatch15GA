const path = require("path");
const validator = require("validator");
const UsersController = require("../../controllers/user");
const { user } = require("../../models");

exports.getDetailValidator = async (req, res, next) => {
  try {
    if (!validator.isNumeric(req.param.id)) {
      return next({ message: "id not valid", statusCode: 401 });
    }
    next();
  } catch (error) {
    next(error);
  }
};
exports.signUpValidator = async (req, res, next) => {
  try {
    const errors = [];
    if (
      !validator.isLength(req.body.firstName, {
        min: 5,
      })
    ) {
      errors.push("Please Input First Name at least 5 Characters !");
    }
    if (validator.isEmpty(req.body.lastName, { ignore_whitespace: false })) {
      errors.push("Please input Last Name");
    }
    const finduserName = await users.findOne({
      where: { userName: req.body.email },
    });
    const findEmail = await users.findOne({
      where: { email: req.body.email },
    });
    if (finduserName) {
      errors.push("User Name already registered!!");
    }
    if (findEmail) {
      errors.push("Email already registered!!");
    }
    if (!validator.isEmpty(req.body.userName)) {
      errors.push("User Name is not valid");
    }
    if (!validator.isEmail(req.body.email)) {
      errors.push("Email is not valid");
    }
    if (req.body.password !== req.body.confirmPassword) {
      errors.push("Password and confirm Password didn't match!");
    }
    if (
      !validator.isStrongPassword(req.body.password, [
        {
          minLength: 8,
          maxLength: 20,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 0,
          returnScore: false,
          pointsPerUnique: 0,
          pointsPerRepeat: 0,
          pointsForContainingLower: 10,
          pointsForContainingUpper: 10,
          pointsForContainingNumber: 10,
          pointsForContainingSymbol: 10,
        },
      ])
    ) {
      errors.push(
        "Password must has at least 10 characters that include at least 1 lowercase character, 1 uppercase characters, and 1 number"
      );
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors: errors, sucsess: false });
    }

    next();
  } catch (error) {
    res.status(401).json({ errors: ["Bad request"], sucsess: false });
  }
};
