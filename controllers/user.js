const { user } = require("../models");
const { createToken, encodePin, compare } = require("../utils/index")

class User {

  async getDetailUser(req, res, next) {
    try {
      const userId = req.userData.id

      const data = await user.findOne({
        where: { id: +userId },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      });

      res.status(200).json({ success: true, data: data });
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async createUser(req, res, next) {
    try {
      const { userName, email, password } = req.body
      const hashPassword = encodePin(password)

      const checkUsername = await user.findOne({
        where: {
          userName: userName
        }
      })

      if (checkUsername != null) {
        return res.status(500).json({ success: false, errors: ["Cannot register, username was registered"] });
      }

      const checkEmail = await user.findOne({
        where: {
          email: email,
        }
      })

      if (checkEmail != null) {
        return res.status(500).json({ success: false, errors: ["Cannot register, email was registered"] });
      }

      if ((checkUsername && checkEmail) == null) {
 
        const newUser = await user.create({
          userName,
          email,
          password: hashPassword,
        })

        const data = await user.findOne({
          where: {
            email: email,
          },
          attributes: {
            include: ["userName", "email", "password"],
          }
        })

        const payload = data.dataValues
        const token = createToken(payload)

        res.status(200).json({ success: true, data: data, token: token });
      }

    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.userData.id
      const { first_name, last_name, email, password } = req.body
      const hashPassword = encodePin(password)

      const updateData = await user.update({
        first_name,
        last_name,
        email,
        password: hashPassword,
      },
      {
        where: { id: +userId },
      });

      const data = await user.findOne({
        where: {
          id: +userId,
        },
      });

      res.status(201).json({ success: true, message: ["Success Update Data"] });

    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async updatePassword(req, res, next) {
    try {
      const userId = req.userData.id
      const { password, confirmPassword } = req.body
      const hashPassword = encodePin(password)

      const updatePassword = await user.update({
        password: hashPassword,
      },
      {
        where: { id: +userId },
      });

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
      
      const userId = req.userData.id
      const deletedData = await user.destroy({
        where: {
          id: +userId,
        },
        force: true
      });

      if (deletedData.id !== +userId) {
        return res
          .status(404)
          .json({ success: false, message: ["User has been deleted"] });
      }

      res.status(200).json({ success: true, message: ["Success deleting data"] });
    } catch (error) {
       res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async login(req, res, next) {
    try {
      const email = req.body.email
      const password = req.body.password
      
      const loginUser = await user.findOne({
        where: {
          email: email
        }
      })

      if (loginUser == null) {
        return res.status(401).json({
          success: false,
          errors: ["Please Input the correct email and password"]
        })
      }

      const hashPass = loginUser.dataValues.password
      const compareResult = compare(password, hashPass)

      if (!compareResult) {
        return res.status(401).json({
          success: false,
          errors: ["Please input the correct email and password"]
        })
      }

      const payload = loginUser.dataValues
      const token = createToken(payload)
      res.status(200).json({
        success: true,
        token: token,

      })
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }
}

module.exports = new User();
