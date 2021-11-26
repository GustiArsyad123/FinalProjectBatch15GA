const path = require("path");
const crypto = require("crypto");
const validator = require("validator");
const { promisify } = require("util");

// Make class of create or update event validatro
exports.signUpCompleteValidator = async (req, res, next) => {
  try {
    const errors = [];

    //   Check input of title

    // Check for the image of event was upload or not

    if (!(req.files && req.files.image)) {
      errors.push("Please upload the image");
    } else if (req.files.image) {
      // If image was uploaded

      // req.files.photoEvent is come from key (file) in postman
      const file = req.files.image;

      // Make sure image is photo
      if (!file.mimetype.startsWith("image")) {
        errors.push("File must be an image");
      }

      // Check file size (max 1MB)
      if (file.size > 1000000) {
        errors.push("Image must be less than 1MB");
      }

      // If error
      if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
      }

      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;

      // Make file.mv to promise
      const move = promisify(file.mv);

      // Upload image to /public/images
      await move(`./public/images/events/${file.name}`);

      // assign req.body.image with file.name
      req.body.image = `https://timcevent.herokuapp.com/images/events/${file.name}`;
    }

    if (validator.isEmpty(req.body.phoneNumber, { ignore_whitespace: false })) {
      errors.push("Please input the Phone Number!");
    }

    // if (errors.length > 0) {
    //   return res.status(400).json({ errors: errors });
    // }
    if (
      !validator.isLength(req.body.address, {
        min: 10,
        max: 100,
      })
    ) {
      errors.push("Detail of event min 10 Characters!");
    }

    // Check input of date event
    if (validator.isEmpty(req.body.location, { ignore_whitespace: false })) {
      errors.push("Please input the Phone Number!");
    }

    // Check input of detail and min character 100

    // Check input of link meet

    // Check for the image of event was upload or not

    if (errors.length > 0) {
      return res.status(400).json({ errors: errors, sucsess: false });
    }

    next();
  } catch (error) {
    res.status(401).json({ errors: ["Bad request"], sucsess: false });
  }
};
