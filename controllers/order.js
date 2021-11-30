const {
  category,
  user,
  type,
  recipe,
  review,
  order,
  cart,
  delivery,
  location,
} = require("../models");

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
        uploadReceipt,
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
        where: { id: +userId },
        attributes: {
          exclude: ["createdAt", "deletedAt", "updatedAt"],
        },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: [
            "You must signin first, because you don't have permission to access.",
          ],
        });
      }

      const userFirstName = checkUser.dataValues.firstName;
      const userLastName = checkUser.dataValues.lastName;
      const userAddress = checkUser.dataValues.address;
      const userPhoneNumber = checkUser.dataValues.phoneNumber;

      let findDelivery = await delivery.findOne({
        where: {
          phoneNumber: userPhoneNumber,
        },
      });

      if (!findDelivery) {
        const addDelivery = await delivery.create({
          firstName: userFirstName,
          lastName: userLastName,
          address: userAddress,
          phoneNumber: userPhoneNumber,
        });
      }

      const getDelivery = await delivery.findOne({
        where: {
          phoneNumber: userPhoneNumber,
        },
        attributes: {
          exclude: ["createdAt", "deletedAt", "updatedAt"],
        },
      });

      const cartData = await cart.findAll({
        where: { id_user: +userId },
        attributes: {
          exclude: ["createdAt", "deletedAt", "updatedAt"],
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
        ],
      });

      console.log("INI CART DATA", JSON.stringify(cartData));

 
      let titleRecipe = [];
      for (let i = 0; i < cartData.length; i++) {
        titleRecipe.push(cartData[i].recipe.title);
      }

        let array_elements = titleRecipe;
        array_elements.sort();

        var current = null;
        var cnt = 0;

        let penampunganData = []
        for (var i = 0; i < array_elements.length; i++) {
          if (array_elements[i] != current) {
            if (cnt > 0) {
              penampunganData.push({ title: current, amount: cnt })
            }
            current = array_elements[i];
            cnt = 1;
          } else {
            cnt++;
          }
        }
        if (cnt > 0) {
          penampunganData.push({ title: current, amount: cnt })
        }


      let priceRecipe = [];
      for (let i = 0; i < cartData.length; i++) {
        priceRecipe.push(cartData[i].recipe.price);
      }
      priceRecipe = priceRecipe.reduce((a, b) => a + b, 0);

      if (cartData.length == 0) {
        return res
          .status(404)
          .json({ success: false, errors: ["cart is empty"] });
      }

 
      const findOrder = await order.findOne({
        where: {
          id_user: +userId
        }
      })

      if (!findOrder) {
      const createOrder = await order.create({
        id_user: +userId,
        id_delivery: getDelivery.dataValues.id,
        quantity: cartData.length,
        subtotal: priceRecipe,
        deliveryFee: 15000,
        total: priceRecipe + 15000,
      })
      };

      const getOrder = await order.findOne({
        where: {
          id_user: +userId
        },
        attributes: {
          exclude: ["id_recipe", "createdAt", "updatedAt", "deletedAt"]
        }
      })

      res.status(200).json({
        success: true,
        user: getDelivery,
        quantityPerReceipt: penampunganData,
        order: getOrder,
        cart: cartData,
      });
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

      const updatedData = await delivery.update(req.body, {
        where: { id_user: +userId },
      });

      res.status(201).json({
        success: true,
        message: ["Success edit delivery address"],
        data: updatedData,
      });
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

      const cartData = await cart.findAll({
        where: { id_user: +userId },
        attributes: {
          exclude: ["createdAt", "deletedAt", "updatedAt"],
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
        ],
      });

      ////////////////////////////////////////
      let titleRecipe = [];
      for (let i = 0; i < cartData.length; i++) {
        titleRecipe.push([cartData[i].recipe.title, cartData[i].recipe.id]);
      }


        let array_elements = titleRecipe;
        array_elements.sort();

        var current = null;
        var cnt = 0;

        let penampunganData = []
        for (var i = 0; i < array_elements.length; i++) {
          if (array_elements[i] != current) {
            if (cnt > 0) {
              penampunganData.push({ title: current, amount: cnt })
            }
            current = array_elements[i];
            cnt = 1;
          } else {
            cnt++;
          }
        }
        if (cnt > 0) {
          penampunganData.push({ title: current, amount: cnt })
        }
        console.log(penampunganData);
      
      ////////////////////SUBSTRACT STOCK AFTER CONFIRM PAYMENT///////////////////////////////////

      function findAmountByTitle(title, arr) {
        for(let i = 0; i < arr.length; i++) {
          if(title === arr[i].title) {
            return arr[i].amount
          }
        }
      }
      

      for (let i = 0; i < cartData.length; i++) {
        console.log("INI CARDDATA", cartData[i]);
        const getStock = await recipe.update(
        {
          stock: cartData[i].recipe.stock - findAmountByTitle(cartData[i].recipe.title, penampunganData)
        },
        {
          where: {
            id_recipe: cartData[i].recipe.id
          }
        })

        priceRecipe.push(cartData[i].recipe.price);
      }

      const getStock = await recipe.findAll({
        where: {
          id_recipe
        }
      })

      const emptyDelivery = await delivery.destroy({
        where: { id_user: +userId },
      });
      const emptyCart = await cart.destroy({
        where: { id_user: +userId },
      });

      res.status(201).json({
        success: true,
        message: [
          "Success submit your receipt, please wait seller to process your request",
        ],
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }
  async updateReceipt(req, res, next) {
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

      const updateReceipt = await order.update(req.body.uploadReceipt, {
        where: { id_user: +userId },
      });

      res.status(201).json({
        success: true,
        message: ["Success update your receipt, "],
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }
}

module.exports = new Order();
