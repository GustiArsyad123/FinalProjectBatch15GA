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

      const data = await order.update(req.body,{
        where: {
          id_user: +userId
        }
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
          usernya: +userId,
        },
      });

      if (findDelivery == undefined) {
        const addDelivery = await delivery.create({
          usernya: +userId,
          firstName: userFirstName,
          lastName: userLastName,
          address: userAddress,
          phoneNumber: userPhoneNumber,
        });
      }

      const getDelivery = await delivery.findOne({
        where: {
          usernya: +userId,
        },
        attributes: {
          exclude: ["usernya", "createdAt", "deletedAt", "updatedAt"],
        },
      });

      const cartData = await cart.findAll({
        where: { id_user: +userId },
        attributes: {
          exclude: ["id_user", "createdAt", "deletedAt", "updatedAt"],
        },
        include: [
          {
            model: recipe,
            attributes: ["id_user"],
          },
          {
            model: recipe,
            attributes: ["image"],
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
            attributes: ["stock"],
          }
        ],
      });
 
      let titleRecipe = [];
      for (let i = 0; i < cartData.length; i++) {
        titleRecipe.push(cartData[i].recipe.title);
      }

      let getTitleAmount = titleRecipe;
      getTitleAmount.sort();

      let resep = null;
      let count = 0;

      let titleAndAmount = []
        for (var i = 0; i < getTitleAmount.length; i++) {
          if (getTitleAmount[i] != resep) {
            if (count > 0) {
              titleAndAmount.push({ title: resep, amount: count })
            }
            resep = getTitleAmount[i];
            count = 1;
          } else {
            count++;
          }
        }
        if (count > 0) {
          titleAndAmount.push({ title: resep, amount: count })
    }


      let priceRecipe = [];
      for (let i = 0; i < cartData.length; i++) {
        priceRecipe.push(cartData[i].recipe.price);
      }
      priceRecipe = priceRecipe.reduce((a, b) => a + b, 0); // Count All Price

      if (cartData.length == 0) {
        return res.status(404).json({ success: false, errors: ["cart is empty"] });
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
          exclude: ["id_recipe", "id_category", "id_type", "createdAt", "updatedAt", "deletedAt"]
        }
      })

      res.status(200).json({
        success: true,
        user: getDelivery,
        quantityPerReceipt: titleAndAmount,
        order: getOrder,
        cart: cartData,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async editAddressDelivery(req, res, next) {
    try {
      const userId = req.userData.id;
      const { idDelivery } = req.params
      // const { firstName, lastName, address, phoneNumber } = req.body;
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
        where: { id: idDelivery },
      });

      res.status(201).json({
        success: true,
        message: ["Success edit delivery address"]
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

      /* INI BUAT NYARI ISI DI CART */
      let arrayResepDiCart = []
      let arrayStock = []
      let resepDiCart = await cart.findAll({
        where: { id_user: +userId },
        include: [
          {
            model: recipe,
            attributes: ["title"],
          },
          {
            model: recipe,
            attributes: ["stock"],
          }
        ]
      })

      for (let i = 0; i < resepDiCart.length; i++) {
        arrayResepDiCart.push(resepDiCart[i].recipe.title);
        arrayStock.push(resepDiCart[i].recipe.stock);
      }

      /* INI BUAT NYARI QUANTITY PER RESEP DI CART */
      let recipeQuantity = [];
      for (let i = 0; i < resepDiCart.length; i++) {
        recipeQuantity.push(resepDiCart[i].recipe.title);
      }

      let titleAndAmount = recipeQuantity;
      titleAndAmount.sort();

      let resep = null;
      let cnt = 0;

      let amount = []
        for (var i = 0; i < titleAndAmount.length; i++) {
          if (titleAndAmount[i] != resep) {
            if (cnt > 0) {
              amount.push(cnt)
            }
            resep = titleAndAmount[i];
            cnt = 1;
          } else {
            cnt++;
          }
        }
        if (cnt > 0) {
          amount.push(cnt)
      }
    

      /* INI BUAT NYARI QUANTITY PER RESEP DI CART */
      for (let i = 0; i < arrayResepDiCart.length - 1; i++){
        for (let j = 0; j < arrayStock.length; j++) {
          for (let k = 0; k < amount.length; k++) {
            let updateResep = await recipe.update({
              stock: parseInt(arrayStock[i]) - parseInt(amount[i])
            },{
              where: {
                title: arrayResepDiCart[i]
              }
            })
          }
        }
      }

      /* Function to send welcome email to new user */
      var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "chefbox2021@gmail.com",
          pass: "Bantenku1",
        },
      });

      transporter.use(
        "compile",
        hbs({
          viewEngine: {
            extname: ".hbs", // handlebars extension
            partialsDir: "./templates/",
            layoutsDir: "./templates/",
            defaultLayout: "invoice",
          },
          viewPath: "./templates/",
          extName: ".hbs",
        })
      );

      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
          console.log(success);
        }
      });

      let mailOptions = {
        from: 'chefbox2021@gmail.com',
        to: data.dataValues.email,
        subject: 'Message',
        template: 'invoice',
        context: {
          email: data.dataValues.email,
          userName: data.dataValues.userName,
        }
      }

      transporter.sendMail(mailOptions, (err, info) => {
      });

      /* Empty cart and order table after confirmed */
      const emptyDelivery = await delivery.destroy({
        where: { usernya: +userId },
      });
      const emptyCart = await cart.destroy({
        where: { id_user: +userId },
      });

      if(!emptyCart){
        return res.status(404).json({ status: false, errors: ["Cart is empty"]})
      }

      res.status(201).json({ success: true, message: ["Success submit your receipt payment, please wait seller to process your request"]});
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
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
