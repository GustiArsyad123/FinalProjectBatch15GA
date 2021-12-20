const { verifyToken } = require("../utils/index");
const { order, cart, user, recipe, delivery, seller } = require('../models')
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const XENDIT_URL = process.env.XENDIT_INVOICE
const XENDIT_KEY = process.env.XENDIT_API_BASE64
const paymentConfig = {
  headers: {
    authorization: `Basic ${XENDIT_KEY}`,
  }
}
const axios = require('axios')

module.exports = {
  async checkout (req, res, next) {
    try {
      const token = req.headers.access_token
      let userId = ''
      if (token) {
          const payload = verifyToken(token)
          userId = payload.id
      }

      const checkUser = await user.findOne({
        where: { id: +userId }
      })

      if (checkUser.id != userId) {
        return res.status(401).json({
          success: false,
          errors: [
            "You must signin first, because you don't have permission to access.",
          ],
        });
      }
  
      let amountOrder = await order.findOne({
        where: {
          id_user: +userId
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
            attributes: ["phoneNumber"],
          },
          {
            model: delivery,
            attributes: ["address"],
          },
        ]
      })

      let firstName = amountOrder.delivery.firstName
      let lastName = amountOrder.delivery.lastName
      let phone = amountOrder.delivery.phoneNumber

      /* FIND RECIPES IN CART */
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
          }
        ],
      });

      const finalData = []
      
      for(let i = 0 ; i < cartData.length ; i++) {
        const obj = {
          title : cartData[i].recipe.title,
          price : cartData[i].recipe.price,
          image: cartData[i].recipe.image,
          quantity: 1,
          total : cartData[i].recipe.price
        }
        const idx = finalData.findIndex(el => el.title === cartData[i].recipe.title )
        if(idx >= 0 ) {
          finalData[idx].quantity++
          finalData[idx].total = finalData[idx].quantity * finalData[idx].price
        }else {
          finalData.push(obj)
        }
      }
       
      /* Get all title recipe and amount */
      let allDescription = []
      let finalAmount = []
      for(let i = 0; i < finalData.length; i++){
        allDescription.push(' ' + finalData[i].title + ' @ ' + finalData[i].quantity + 'pcs')
        finalAmount.push(finalData[i].total)
      }

      /* Count all price */
      let totalPrice = 0
      for(let i = 0; i <finalAmount.length; i++){
        totalPrice += finalAmount[i];
      }
      
      /* YANG DIKIRIM KE XENDIT */
      const paymentPayload = {
        external_id: `Invoice-${amountOrder.dataValues.id}`,
        amount: totalPrice,
        payer_email: `${userId}@chefbox.com`, // Get ID User
        description: allDescription.toString(),
        should_send_email: false,
        merchant_profile_picture_url: "https://res.cloudinary.com/see-event/image/upload/v1638435431/c4qaz6prwl1zqg4un7ba.png",
        invoice_duration: 7200, // 2 hour
        customer: {
          given_names: `${firstName + ' ' + lastName}`,
          mobile_number: `${phone}`
        },
      }
      
      // always. always, simpan semua data yang kita kirim ke 3rd party service
      const paymentResponse = await axios.post(XENDIT_URL, paymentPayload, paymentConfig)
      res.status(200).json({
        success: true,
        message: 'checkout success',
        data: paymentResponse.data
      })
    }
    catch(err) {
      console.log(err)
      res.send(err)
    }
  },
  async callbackURL (req, res, next) {
    try {
      console.log(req.body)
      const email = req.body.payer_email
      const idArray = email.split('@')
      const id = idArray[0]
      
      if(Number.isInteger(+id) && req.body.status == 'PAID'){
        await order.update({
          ispayment: true
        },{
          where: {
            id_user: +id
          }, 
        })

        await delivery.update({
          ispayment: true
        },{
          where: {
            usernya: +id
          }, 
        })

        const getOrder = await cart.findAll({
          where: {
            id_user: +id
          },
          include: [
            {
              model: recipe,
              include: [
                {
                  model: user,
                  attributes: ["email"],
                },
                {
                  model: user,
                  attributes: ["id"],
                },
              ]
            },
          ]
        })

        const finalData = []
      
        for(let i = 0 ; i < getOrder.length ; i++) {
          const obj = {
            id: getOrder[i].recipe.id,
            title : getOrder[i].recipe.title,
            price : getOrder[i].recipe.price,
            image: getOrder[i].recipe.image,
            quantity: 1,
            total : getOrder[i].recipe.price,
            stock: getOrder[i].recipe.stock,
            sellerID: getOrder[i].recipe.user.id
          }
          const idx = finalData.findIndex(el => el.title === getOrder[i].recipe.title )
          if(idx >= 0 ) {
            finalData[idx].quantity++
            finalData[idx].total = finalData[idx].quantity * finalData[idx].price
          }else {
            finalData.push(obj)
          }
        }
        console.log("INI FINAL DATA", finalData);

        for(let i = 0; i < finalData.length; i++){
          await recipe.update({
            stock: finalData[i].stock - finalData[i].quantity
          },
          {
            where: {
              id: finalData[i].id
            }
          })
        }
        
        let emailSeller = []
        for(let i = 1; i < getOrder.length; i++){
          emailSeller.push(getOrder[i].recipe.user.email)
        }

        const removeDuplicateEmail = [...new Set(emailSeller)];
        console.log("INI EMAIL SELLER NO DUPLICATE", removeDuplicateEmail);

        /* Function to send complete payment email to seller */
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
                defaultLayout: "successPayment",
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

        for(let i = 0; i < removeDuplicateEmail.length; i++){
          let mailOptions = {
            from: "chefbox2021@gmail.com",
            to: removeDuplicateEmail[i],
            subject: "Message",
            template: "successPayment",
            context: {
              userName: 'Seller ChefBox',
            },
        };

        transporter.sendMail(mailOptions, (err, info) => {});

        let idOfRecipe = []
        for(let i = 1; i < getOrder.length; i++){
          idOfRecipe.push(getOrder[i].recipe.id)
        }

        const removeDuplicateID = [...new Set(idOfRecipe)];
        console.log("INI ID RECIPE NO DUPLICATE", removeDuplicateID);

        let detailOrder = await order.findAll({
          where: {
            id_user: +id
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
          order: [['id', 'DESC']],
          limit: 1
        })

        console.log("INI detailOrder", detailOrder.dataValues);

        for(let i = 0; i < finalData.length; i++){
          await seller.create({
            id_order: detailOrder[0].id,
            id_user: +id,
            id_recipe: finalData[i].id,
            quantity: finalData[i].quantity,
            sellerID: finalData[i].sellerID,
            delivery_name: detailOrder[0].dataValues.delivery.dataValues.firstName + ' ' + detailOrder[0].dataValues.delivery.dataValues.lastName,
            delivery_address: detailOrder[0].dataValues.delivery.dataValues.address,
            delivery_phonenumber: detailOrder[0].dataValues.delivery.dataValues.phoneNumber
          })
        }

        // for(let i = 0; i < removeDuplicateID.length; i++){
        //   await cart.destroy({
        //     where: {
        //       id_user: +id,
        //       id_recipe: removeDuplicateID[i]
        //     },
        //     force: true
        //   })
        // }
        }
      }

      res.status(200).json({message: req.body})
    }
    catch(err) {
      console.log(err)
      res.send(err)
    }
  }
}