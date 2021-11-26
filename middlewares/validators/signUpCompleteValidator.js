const path = require("path");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const validator = require("validator");
const { promisify } = require("util");

exports.signUpCompleteValidator = async (req, res, next) => {
  try {
    const errors = [];

    if (validator.isEmpty(req.body.phoneNumber, { ignore_whitespace: false })) {
      errors.push("Please enter your phone number");
    }
    // if (!validator.isNumeric(req.body.phoneNumber)) {
    //   errors.push("Phone number must be number");
    // }
    if (validator.isEmpty(req.body.address, { ignore_whitespace: false })) {
      errors.push("Please input your address");
    }
    if (validator.isEmpty(req.body.location, { ignore_whitespace: false })) {
      errors.push("Please input your location(city)");
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors: errors });
    }

    if (req.files.image) {
      const file = req.files.image;

      if (!file.mimetype.startsWith("image/")) {
        errors.push("File must be an image");
      }

      if (file.size > 2000000) {
        errors.push("Image must be less than 2MB");
      }

      if (errors.length > 0) {
        return res.status(400).json({ success: false, errors: errors });
      }

      let fileName = crypto.randomBytes(16).toString("hex");

      file.name = `${fileName}${path.parse(file.name).ext}`;

      const move = promisify(file.mv);

      await move(`./public/images/${file.name}`);

      const image = await cloudinary.uploader
        .upload(`./public/images/${file.name}`)
        .then((result) => {
          return result.secure_url;
        });

      req.body.image = image;
    }

    if (req.body.image == null) {
      errors.push("Please insert your picture");
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, errors: ["Bad request"] });
  }
};
