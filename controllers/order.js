const { category, user, type, recipe, review, order, cart, delivery } = require("../models");

class Order {
  async createPayment(req, res, next) {
    try {
      const userId = req.userData.id;
      const { uploadReceipt } = req.body;
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id != userId) {
        return res.status(401).json({
          success: false,
          errors: [
            "You must signin first, because you don't have permission to access.",
          ],
        });
      }

      const data = await order.create({
        uploadReceipt
      });

      res
        .status(201)
        .json({ success: true, message: ["Success upload receipt!!"] });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async getCheckout(req, res, next) {
    try {
      const userId = req.userData.id;

      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: [
            "You must signin first, because you don't have permission to access.",
          ],
        });
      }

      const userData = await user.findOne({
        where: { id: +userId },
        attributes: {
          exclude: ["createdAt", "deletedAt", "updatedAt"]
        }
      }
      );

      const userFirstName = userData.dataValues.firstName
      const userLastName = userData.dataValues.lastName
      const userAddress = userData.dataValues.address
      const userPhoneNumber = userData.dataValues.phoneNumber

      const addDelivery = await delivery.create({
        firstName: userFirstName,
        lastName: userLastName,
        address: userAddress,
        phoneNumber: userPhoneNumber
      })

      const getDelivery = await delivery.findOne({
        where: {
          phoneNumber: userPhoneNumber
        }
      })

      const cartData = await cart.findAll(
        {
          where: { id_user: +userId },
          attributes: {
            exclude: ["createdAt", "deletedAt", "updatedAt"],
        }
      }
      );

      if (cartData.length == 0) {
        return res
          .status(404)
          .json({ success: false, errors: ["cart is empty"] });
      }

      res
        .status(200)
        .json({ success: true, user: getDelivery, cart: cartData });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async editAddressDelivery(req, res, next) {
    try {
      const userId = req.userData.id;
      const { firstName, lastName, address, phoneNumber } = req.body;
      const checkUser = await user.findOne({
        where: { id: +userId },
      });

      if (checkUser.id != userId) {
        return res.status(401).json({
          success: false,
          errors: [
            "You must signin first, because you don't have permission to access.",
          ],
        });
      }

      const updatedData = await delivery.create(
        {
          firstName,
          lastName,
          address,
          phoneNumber
        }
      );

      res
        .status(201)
        .json({ success: true, message: ["Success edit delivery address"] });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async confirmPayment(req, res, next) {
    try {
      const userId = req.userData.id;
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id != userId) {
        return res.status(401).json({
          success: false,
          errors: [
            "You must signin first, because you don't have permission to access.",
          ],
        });
      }

      const emptyCart = await delivery.destroy(
        {
          where: { id_user: +userId },
        }
      );


      res
        .status(201)
        .json({ success: true, message: ["Success submit your receipt, please wait seller to process your request"] });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }
  
}

module.exports = new Order();
