const { ingredient } = require("../models");

class Ingredient {
  static async createIngredient(req, res, next) {
    try {
      // Create Ingredient
      const newData = await ingredient.create({
        name: req.body.name,
        price: req.body.price,
        unit: req.body.unit,
        stock: req.body.stock,
      });

      // Find Data Order
      const data = await order.findOne({
        where: {
          id: newData.id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      res.status(201).json({ data, message: ["Success Add The Ingredient"] });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Ingredient;
