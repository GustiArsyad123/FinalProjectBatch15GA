const { delivery, recipe } = require("../models");

class Delivery {
  static async createDelivery(req, res, next) {
    try {
      // Create Delivery
      const newData = await delivery.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
      });

      // Find Data
      const data = await recipe.findOne({
        where: {
          id: newData.id,
        },
        attributes: { exclude: ["createdAt", "deletedAt"] },
        include: [
          {
            model: recipe,
          },
        ],
      });

      res.status(201).json({ data, message: ["Success Add Delivery"] });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Delivery;
