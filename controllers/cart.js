const { user, cart, recipe } = require("../models");

class Cart {
  async showCart(req, res, next) {
    try {
      const userId = req.userData.id;
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
        where: { id_user: +userId, ispayment: false },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        include: [
          {
            model: recipe,
            attributes: ["id"],
          },
          {
            model: recipe,
            attributes: ["title"],
          },
          {
            model: recipe,
            attributes: ["price"],
          },
          {
            model: recipe,
            attributes: ["image"],
          }
        ]
      });
 
      const finalData = []
      for(let i = 0 ; i < data.length ; i++) {
        const obj = {
          id: data[i].recipe.id,
          title : data[i].recipe.title,
          price : data[i].recipe.price,
          image: data[i].recipe.image,
          quantity: 1,
          total : data[i].recipe.price
        }
        const idx = finalData.findIndex(el => el.title === data[i].recipe.title )
        if(idx >= 0 ) {
          finalData[idx].quantity++
          finalData[idx].total = finalData[idx].quantity * finalData[idx].price
        }else {
          finalData.push(obj)
        }
      
      }
 
      if (data.length == 0) {
        return res
          .status(404)
          .json({ success: false, errors: ["Cart is Empty"] });
      }

      res.status(200).json({ success: true, total: data.length, data: finalData });
    } catch (error) {
      console.log(error);
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

      const checkStock = await recipe.findOne({
        where: {
          id: idRecipe
        }
      })

      const recipeStock = checkStock.dataValues.stock

      const getPreviousCart = await cart.findAll({
        where: {
          id_user: +userId,
          id_recipe: +idRecipe,
          ispayment: false
        }
      })

      const total = []
      for (let i = 0; i < quantity; i++) {
        let addToCart = await cart.create({
          id_user: +userId,
          id_recipe: +idRecipe,
          ispayment: false
        });
        if(quantity <= recipeStock){
          total.push(addToCart)
        } else {
          return res.status(400).json({ success: false, message: 'Stock tidak cukup dengan quantity yang diminta'})
        }
      }

      const semuaCart = getPreviousCart.length + total.length 

      const quantityCart = await cart.findAll({
        where: {
          id_user: +userId,
          ispayment: false
        }
      })

      res.status(200).json({ success: true, message: ["Success add to cart"], thisRecipe: semuaCart, totalCart: quantityCart.length });
    } catch (error) {
      console.log(error);
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
          id_recipe: +idRecipe,
          id_user: +userId
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
