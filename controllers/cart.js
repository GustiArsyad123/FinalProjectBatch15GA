const { user, cart, recipe } = require("../models");
const Redis = require("ioredis")
const redis = new Redis()

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

      const cacheShowCart = await redis.get(`showcart`)
      const cacheDataCart = await redis.get(`data`)
      if (cacheShowCart && cacheDataCart){
        return res.status(200).json({ success: true, total: JSON.parse(cacheDataCart).length, data: JSON.parse(cacheShowCart) })
      }

      const data = await cart.findAll({
        where: { id_user: +userId },
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

      redis.set(`dataCart`, JSON.stringify(data))
      redis.set(`showCart`, JSON.stringify(finalData))

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

      const quantityCart = await cart.findAll({
        where: {
          id_user: +userId,
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
