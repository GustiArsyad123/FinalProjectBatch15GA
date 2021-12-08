const { user, cart, recipe } = require("../models");

class Cart {
  async showCart(req, res, next) {
    try {
      const userId = req.userData.id;
      const { idRecipe } = req.params;
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: ["You must have permission to Add it."],
        });
      }

      const data = await cart.findAll({
        where: { id_user: +userId },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        include: [
          {
            model: recipe,
            attributes: ["title"],
          },
          {
            model: recipe,
            attributes: ["price"],
          },
        ]
      });
      if (data.length == 0) {
        return res
          .status(404)
          .json({ success: false, errors: ["Cart is Empty"] });
      }

      res.status(200).json({ success: true, total: data.length, data: data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async addCart(req, res, next) {
    try {
      const userId = req.userData.id;
      const { idRecipe } = req.params;
      const { quantity } = req.body
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: ["You must have permission to delete it."],
        });
      }

      const getPreviousCart = await cart.findAll({
        where: {
          id_user: +userId,
          id_recipe: +idRecipe
        }
      })

      const total = []
      for (let i = 0; i < quantity; i++) {
        let addToCart = await cart.create({
          id_user: +userId,
          id_recipe: +idRecipe
        });
        total.push(addToCart)
      }

      const semuaCart = getPreviousCart.length + total.length 

      res.status(200).json({ success: true, message: ["Success add to cart"], AllCart: semuaCart });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async deleteCart(req, res, next) {
    try {
      const userId = req.userData.id;
      const { idRecipe } = req.params;
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: ["You must have permission uncheck it."],
        });
      }
      const deletedData = await cart.destroy({
        where: {
          id: +idRecipe,
        },
        force: true,
      });

      res
        .status(200)
        .json({ success: true, message: ["Success deleting data"] });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }
}

module.exports = new Cart();
