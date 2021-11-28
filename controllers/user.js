const { user } = require("../models");
const { createToken, encodePin, compare } = require("../utils/index")

class User {

  async getDetailUser(req, res, next) {
    try {
      const userId = req.userData.id

      const data = await user.findOne({
        where: { id: +userId },
        attributes: {
          exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
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
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          }
        })

        const payload = {id: data.dataValues.id, userName: data.dataValues.userName, email: data.dataValues.email}
        const token = createToken(payload)

        res.status(200).json({ success: true, data: data, token: token });

    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async completeSignUp(req, res, next) {
    try {
      const userId = req.userData.id
      const { image, phoneNumber, address, location } = req.body

      const updateData = await user.update({
        image,
        phoneNumber,
        address,
        location
      },
      {
        where: { id: +userId },
      });

      const data = await user.findOne({
        where: {
          id: +userId,
        },
      });

      res.status(201).json({ success: true, message: ["Success Update Data"], data: data });

    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.userData.id
      const { firstName, lastName, email, phoneNumber, address, location, image } = req.body

      const updateData = await user.update({
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        location,
        image
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
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async updatePassword(req, res, next) {
    try {
      const userId = req.userData.id
      const { password, confirmPassword } = req.body
      const hashPassword = encodePin(password)

      if(password != confirmPassword){
        return res.status(400).json({ success: false, errors: ['Password and Confirm Password not match']})
      }

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

      const payload = {id: loginUser.dataValues.id, userName: loginUser.dataValues.userName, email: loginUser.dataValues.email}
      const token = createToken(payload)
      res.status(200).json({
        success: true,
        token: token
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }
}

module.exports = new User();
