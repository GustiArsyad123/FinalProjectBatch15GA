const { order, user, recipe, type, category } = require("../models");

class Order {

  async getAllOrders(req, res, next) {
    try {

      let filter = {};
      if (req.query.minTotal) {
        filter.total = { $gte: parseInt(req.query.minTotal) };
      }
      if (req.query.maxTotal) {
        filter.total = { ...filter.total, $lte: parseInt(req.query.maxTotal) };
      }
      if (req.query.orderName) {
        filter["order.name"] = { $regex: req.query.orderName, $options: "i" };
      }

      let data = await order.find(filter).populate({ path: "order" });

      if (data.length === 0) {
        return next({ message: "Order not found", statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

 async getDetailOrder(req, res, next) {
    try {
  
      let data = await order
        .findOne({ _id: req.params.id })
        .populate({ path: "order" });

      if (!data) {
        return next({ message: "Order not found", statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

async createOrder(req, res, next) {
    try {

      const newData = await order.create({
        quantity: req.body.quantity,
        subtotal: req.body.subtotal,
        uploadRecipe: req.body.uploadRecipe,
        deliveryFee: DataTypes.deliveryFee,
        total: DataTypes.total,
      });

      const data = await order.findOne({
        where: {
          id: newData.id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: user,
            recipe,
            type,
            category,
            ingredient,
          },
        ],
      });

      res.status(201).json({ data, message: ["Success Add The Ingredient"] });
    } catch (error) {
      next(error);
    }
  }

async updateOrder(req, res, next) {
    try {

      let data = await order
        .findOneAndUpdate(
          { _id: req.params.id },
          req.body, // This is all of req.body
          { new: true }
        )
        .populate({ path: "recipe" });
      // new is to return the updated order data
      // If no new, it will return the old data before updated

      if (!data) {
        return next({ message: "Order not found", statusCode: 404 });
      }

      // Add more detail data of recipe user
      data.recipe.user = await user.findOne({ _id: data.recipe.user });

      // If success
      return res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(req, res, next) {
    try {
      const deleteId = await order.findOne({
        where: { id: req.params.id },
      });

      if (deleteId.userId !== req.userData.id) {
        return res
          .status(401)
          .json({ errors: ["You do not have permission to access this!"] });
      }
      let data = await order.destroy({ where: { id: req.params.id } });

      if (!data) {
        return res.status(404).json({ errors: ["Order not found"] });
      }

      res
        .status(200)
        .json({ data: data, message: ["Success delete your Order!"] });
    } catch (error) {
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }
}

module.exports = new Order();
