const { user, location } = require("../models");
const { createToken, encodePin, compare } = require("../utils/index");
const sequelize = require("sequelize");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

class User {
  async getDetailUser(req, res, next) {
    try {
      const userId = req.userData.id;

      const data = await user.findOne({
        where: { id: +userId },
        attributes: {
          exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
        },
        include: [
          {
            model: location,
            attributes: ["name"],
          },
        ],
      });

      res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async loginFb(req, res) {
    try {
      const checkEmail = await user.findOne({
        email: req.user._json.email,
      });
      let token;
      if (checkEmail) {
        const payload = { data: checkEmail };
        token = generateToken(payload);
      } else {
        let register = await user.create({
          name: req.user._json.name,
          facebookId: req.user._json.id,
          email: req.user._json.email,
          image: req.user._json.picture.data.url,
        });
        const payload = register.dataValues;
        token = generateToken(payload);
      }

      return res.status(200).json({
        status: 200,
        token,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async loginGoogle(req, res) {
    try {
      const checkEmail = await user.findOne({
        email: req.user._json.email,
      });
      let token;
      if (checkEmail) {
        const payload = { data: checkEmail };
        token = generateToken(payload);
      } else {
        let register = await user.create({
          name: req.user._json.name,
          email: req.user._json.email,
          image: req.user._json.picture.data.url,
        });
        const payload = register.dataValues;
        token = generateToken(payload);
      }

      return res.status(200).json({
        status: 200,
        token,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const { userName, email, password } = req.body;
      const hashPassword = encodePin(password);

      await user.create({
        userName,
        email,
        password: hashPassword,
      });

      const data = await user.findOne({
        where: {
          email: email,
        },
        attributes: {
          exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
        },
      });

      const payload = {
        id: data.dataValues.id,
        userName: data.dataValues.userName,
        email: data.dataValues.email,
      };
      const token = createToken(payload);

      /* Function to send welcome email to new user */
      var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "chefbox2021@gmail.com",
          pass: "Bantenku1",
        },
      });

      transporter.use(
        "compile",
        hbs({
          viewEngine: {
            extname: ".hbs", // handlebars extension
            partialsDir: "./templates/",
            layoutsDir: "./templates/",
            defaultLayout: "regis",
          },
          viewPath: "./templates/",
          extName: ".hbs",
        })
      );

      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
          console.log(success);
        }
      });

      let mailOptions = {
        from: "chefbox2021@gmail.com",
        to: data.dataValues.email,
        subject: "Message",
        template: "regis",
        context: {
          email: data.dataValues.email,
          userName: data.dataValues.userName,
        },
      };

      transporter.sendMail(mailOptions, (err, info) => {});

      res.status(200).json({ success: true, data: data, token: token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async completeSignUp(req, res, next) {
    try {
      const userId = req.userData.id;

      await user.update(req.body, {
        where: { id: +userId },
      });

      const data = await user.findOne({
        where: {
          id: +userId,
        },
        include: [
          {
            model: location,
            attributes: ["name"],
          },
        ],
      });

      res.status(201).json({ success: true, message: ["Success Update Data"], data: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.userData.id;

      await user.update(req.body, {
        where: { id: +userId },
      });

      const data = await user.findOne({
        where: {
          id: +userId,
        },
      });

      res.status(201).json({ success: true, message: ["Success Update Data"] });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async updatePassword(req, res, next) {
    try {
      const userId = req.userData.id;
      const { password, confirmPassword } = req.body;
      const hashPassword = encodePin(password);

      if (password != confirmPassword) {
        return res.status(400).json({
          success: false,
          errors: ["Password and Confirm Password not match"],
        });
      }

      await user.update(
        {
          password: hashPassword,
        },
        {
          where: { id: +userId },
        }
      );

      const data = await user.findOne({
        where: {
          id: +userId,
        },
      });

      res.status(201).json({ success: true, message: ["Success Update Password"] });
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async deleteUser(req, res, next) {
    try {
      const userId = req.userData.id;
      const deletedData = await user.destroy({
        where: {
          id: +userId,
        },
        force: true,
      });

      if (deletedData.id !== +userId) {
        return res.status(404).json({ success: false, message: ["User has been deleted"] });
      }

      res.status(200).json({ success: true, message: ["Success deleting data"] });
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async login(req, res, next) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const loginUser = await user.findOne({
        where: {
          email: email,
        },
      });

      if (loginUser == null) {
        return res.status(401).json({
          success: false,
          errors: ["Please Input the correct email and password"],
        });
      }

      const hashPass = loginUser.dataValues.password;
      const compareResult = compare(password, hashPass);

      if (!compareResult) {
        return res.status(401).json({
          success: false,
          errors: ["Please input the correct email and password"],
        });
      }

      const payload = {
        id: loginUser.dataValues.id,
        userName: loginUser.dataValues.userName,
        email: loginUser.dataValues.email,
      };
      const token = createToken(payload);
      res.status(200).json({
        success: true,
        token: token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }
}

module.exports = new User();
