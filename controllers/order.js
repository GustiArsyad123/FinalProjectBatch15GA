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
  seller,
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

      const data = await order.update(req.body, {
        where: {
          id_user: +userId,
        },
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

      /* DETAIL USER DELIVERY */
      const userFirstName = checkUser.dataValues.firstName;
      const userLastName = checkUser.dataValues.lastName;
      const userAddress = checkUser.dataValues.address;
      const userPhoneNumber = checkUser.dataValues.phoneNumber;

      /* FIND OR CREATE DELIVERY */
      const getDelivery = await delivery.findAll({
        where: {
          usernya: +userId,
        },
        order: [["id", "desc"]],
        limit: 1,
      });

      /* CREATE DETAIL DELIVERY IF NOT FOUND */
      if (
        getDelivery == null ||
        getDelivery.length == 0 ||
        getDelivery[0].ispayment == true
      ) {
        await delivery.create({
          usernya: +userId,
          firstName: userFirstName,
          lastName: userLastName,
          address: userAddress,
          phoneNumber: userPhoneNumber,
          ispayment: false,
        });
      } else {
        /* IF FOUND, UPDATE USER DELIVERY */
        await delivery.update(
          {
            firstName: getDelivery.firstName,
            lastName: getDelivery.lastName,
            address: getDelivery.address,
            phoneNumber: getDelivery.phoneNumber,
          },
          {
            where: {
              usernya: +userId,
            },
          }
        );
      }

      /* GET FINAL DATA DELIVERY */
      const detailDelivery = await delivery.findAll({
        where: {
          usernya: +userId,
        },
        attributes: {
          exclude: ["usernya", "createdAt", "deletedAt", "updatedAt"],
        },
        order: [["id", "DESC"]],
        limit: 1,
      });

      console.log("Detail Delivery", detailDelivery);

      /* FIND ALL DATA IN CART */
      const cartData = await cart.findAll({
        where: { 
          id_user: +userId,
          ispayment: false
        },
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
          },
        ],
      });

      /* FILTER DUPLICATE RECIPES IN CART */
      const finalData = [];
      for (let i = 0; i < cartData.length; i++) {
        const obj = {
          title: cartData[i].recipe.title,
          price: cartData[i].recipe.price,
          image: cartData[i].recipe.image,
          quantity: 1,
          total: cartData[i].recipe.price,
        };
        const idx = finalData.findIndex(
          (el) => el.title === cartData[i].recipe.title
        );
        if (idx >= 0) {
          finalData[idx].quantity++;
          finalData[idx].total = finalData[idx].quantity * finalData[idx].price;
        } else {
          finalData.push(obj);
        }
      }

      /* GET ALL PRICES IN CART */
      let allPrice = [];
      for (let i = 0; i < finalData.length; i++) {
        allPrice.push(finalData[i].total);
      }

      /* COUNT ALL PRICES IN CART */
      let totalPrice = 0;
      for (let i = 0; i < allPrice.length; i++) {
        totalPrice += allPrice[i];
      }

      /* FIND OR CREATE ORDER*/
      const findOrder = await order.findAll({
        where: {
          id_user: +userId,
        },
        include: [
          {
            model: delivery,
            attributes: ["firstName"],
          },
          {
            model: delivery,
            attributes: ["lastName"],
          },
          {
            model: delivery,
            attributes: ["address"],
          },
          {
            model: delivery,
            attributes: ["phoneNumber"],
          },
        ],
        order: [["id", "desc"]],
        limit: 1,
      });

      console.log("INI FIND ORDER", findOrder);

      /* IF NOT FOUND, CREATE */
      if (
        findOrder == null ||
        findOrder.length == 0 ||
        findOrder[0].ispayment == true
      ) {
        const createOrder = await order.create({
          id_user: +userId,
          id_delivery: detailDelivery[0].id,
          quantity: cartData.length,
          subtotal: totalPrice,
          deliveryFee: 15000,
          total: totalPrice + 15000,
          ispayment: false,
        });
      } else {
        /* IF FOUND, UPDATE WITH THE NEW DATA IN DATABASE */
        await order.update(
          {
            id_user: +userId,
            id_delivery: detailDelivery[0].id,
            quantity: cartData.length,
            subtotal: totalPrice,
            deliveryFee: 15000,
            total: totalPrice + 15000,
          },
          {
            where: {
              id: findOrder[0].id,
              id_user: +userId,
            },
          }
        );
      }

      /* GET FINAL DATA ORDER */
      const getOrder = await order.findOne({
        where: {
          id_user: +userId,
        },
        attributes: {
          exclude: [
            "id_recipe",
            "id_category",
            "id_type",
            "createdAt",
            "updatedAt",
            "deletedAt",
          ],
        },
        order: [["id", "DESC"]],
        limit: 1,
      });

      res.status(200).json({
        success: true,
        detailDelivery: detailDelivery,
        detailOrder: getOrder,
        cart: finalData,
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
      const { idDelivery } = req.params;
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

      await delivery.update(req.body, {
        where: { id: idDelivery },
      });

      res.status(201).json({
        success: true,
        message: ["Success edit delivery address"],
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
      let arrayResepDiCart = [];
      let arrayStock = [];
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
          },
        ],
      });

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

      let amount = [];
      for (var i = 0; i < titleAndAmount.length; i++) {
        if (titleAndAmount[i] != resep) {
          if (cnt > 0) {
            amount.push(cnt);
          }
          resep = titleAndAmount[i];
          cnt = 1;
        } else {
          cnt++;
        }
      }
      if (cnt > 0) {
        amount.push(cnt);
      }

      /* INI BUAT NYARI QUANTITY PER RESEP DI CART */
      for (let i = 0; i < arrayResepDiCart.length - 1; i++) {
        for (let j = 0; j < arrayStock.length; j++) {
          for (let k = 0; k < amount.length; k++) {
            await recipe.update(
              {
                stock: parseInt(arrayStock[i]) - parseInt(amount[i]),
              },
              {
                where: {
                  title: arrayResepDiCart[i],
                },
              }
            );
          }
        }
      }

      /* Function to send invoice email */
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
        from: "chefbox2021@gmail.com",
        to: data.dataValues.email,
        subject: "Message",
        template: "invoice",
        context: {
          email: data.dataValues.email,
          userName: data.dataValues.userName,
        },
      };

      transporter.sendMail(mailOptions, (err, info) => {});

      /* Empty cart and delivery table after confirmed */
      const emptyDelivery = await delivery.destroy({
        where: { usernya: +userId },
      });
      const emptyCart = await cart.destroy({
        where: { id_user: +userId },
      });

      if (!emptyCart) {
        return res
          .status(404)
          .json({ status: false, errors: ["Cart is empty"] });
      }

      res.status(201).json({
        success: true,
        message: [
          "Success submit your receipt payment, please wait seller to process your request",
        ],
      });
    } catch (error) {
      console.log(error);
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

      await order.update(req.body.uploadReceipt, {
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

  async dashboardSeller(req, res, next) {
    try {
      const userId = req.userData.id;
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

      const getOrder = await order.findAll({
        where: { id: +userId },
      });

      const dashSeller = await seller.findAll({
        where: {
          sellerID: +userId,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        include: [
          {
            model: user,
            attributes: ["firstName"],
          },
          {
            model: user,
            attributes: ["lastName"],
          },
          {
            model: recipe,
            attributes: ["title"],
          },
        ],
      });

      const finalData = [];
      for (let i = 0; i < dashSeller.length; i++) {
        const obj = {
          id_order: dashSeller[i].id_order,
          buyer:
            dashSeller[i].user.firstName + " " + dashSeller[i].user.lastName,
          orders: dashSeller[i].recipe.title,
          quantity: 2,
          delivery_name: dashSeller[i].delivery_name,
          delivery_address: dashSeller[i].delivery_address,
          delivery_phonenumber: dashSeller[i].delivery_phonenumber,
        };
        const idx = finalData.findIndex(
          (el) => el.id_order === dashSeller[i].id_order
        );
        if (idx >= 0) {
          finalData[idx].quantity++;
        } else {
          finalData.push(obj);
        }
      }
      console.log("INI FINAL DATA", finalData);

      const data = [...new Set(dashSeller)];
      console.log("ini data", data);
      res.status(200).json({
        success: true,
        data: finalData,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }
  async getMyOrder(req, res, next) {
    try {
      const userId = req.userData.id;
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
      const myOrder = await order.findAll({
        where: { id_user: +userId },
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "deletedAt",
            "id_category",
            "id_recipe",
            "id_type",
            "uploadReceipt",
          ],
        },
      });
      res.status(200).json({ success: true, data: myOrder });
    } catch (error) {
      res.status(500).json({ success: false, error: "Internal Server error" });
    }
  }
}

module.exports = new Order();
