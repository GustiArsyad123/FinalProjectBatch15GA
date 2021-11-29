const path = require("path");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const validator = require("validator");
const { promisify } = require("util");
const { user } = require("../../models");

exports.updateUserValidator = async (req, res, next) => {
  try {
    const errors = [];

    //CHECK IMAGE
    if (req.files) {
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

    //CHECK EMAIL
    if(req.body.email){
      if (validator.isEmpty(req.body.email, { ignore_whitespace: false })) {
        errors.push("Please input your email");
      }

      const checkEmail = await user.findOne({
        where: {
          email: req.body.email,
        },
      });
  
      if (checkEmail != null) {
        errors.push("Email was registered");
      }
    }

    //CHECK USERNAME
    if(req.body.userName){
      if (validator.isEmpty(req.body.userName, { ignore_whitespace: false })) {
        errors.push("Please input your username");
      }

      const checkUserName = await user.findOne({
        where: {
          email: req.body.userName,
        },
      });
  
      if (checkUserName != null) {
        errors.push("Username was registered");
      }
    }

    //CHECK FIRST NAME
    if(req.body.firstName){
      if (validator.isEmpty(req.body.firstName, { ignore_whitespace: false })) {
        errors.push("Please input Your Name");
      }
    }

    //CHECK LAST NAME
    if(req.body.lastName){
      if (validator.isEmpty(req.body.lastName, { ignore_whitespace: false })) {
        errors.push("Please input your last name");
      }
    }

    //CHECK LOCATION
    if(req.body.location){
      if (validator.isEmpty(req.body.location, { ignore_whitespace: false })) {
        errors.push("Please input your city");
      }
    }

    //CHECK PHONE NUMBER
    if(req.body.phoneNumber){
      if (validator.isEmpty(req.body.phoneNumber, { ignore_whitespace: false })) {
        errors.push("Please input your phone number");
      }

      const checkPhoneNumber = await user.findOne({
        where: {
          email: req.body.phoneNumber,
        },
      });
  
      if (checkPhoneNumber != null) {
        errors.push("phone number was registered");
      }
    }

    //CHECK ADDRESS
    if(req.body.address){
      if (validator.isEmpty(req.body.address, { ignore_whitespace: false })) {
        errors.push("Please input your address");
      }
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
