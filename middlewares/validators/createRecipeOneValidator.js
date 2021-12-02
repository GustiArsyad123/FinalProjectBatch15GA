const path = require("path");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const validator = require("validator");
const { promisify } = require("util");
// const { category } = require("../../models");

exports.createRecipeOneValidator = async (req, res, next) => {
  try {
    const errors = [];

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

    if (!validator.isInt(req.body.serving)) {
      errors.push("Please fill with number");
    }

    if (!validator.isInt(req.body.duration)) {
      errors.push("Please fill with number");
    }

    if (validator.isEmpty(req.body.title, { ignore_whitespace: false })) {
      errors.push("Please fill the title");
    }
    // if (!validator.isNumeric(req.body.phoneNumber)) {
    //   errors.push("Phone number must be number");
    // }
    if (validator.isEmpty(req.body.duration, { ignore_whitespace: false })) {
      errors.push("Please fill the duration");
    }


    // const checkCategory = await category.findOne({
    //   where: {
    //     email: req.body.category,
    //   },
    // });
    // if (checkCategory != null) {
    //   errors.push("Pleas Choose The Category");
    // }
    if (validator.isEmpty(req.body.serving, { ignore_whitespace: false })) {
      errors.push("Please fill this recipe for how many person");
    }



    if (validator.isEmpty(req.body.description, { ignore_whitespace: false })) {
      errors.push("Please fill description");
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
