const { verifyToken } = require("../utils/index");
const { order, cart, user, recipe, delivery } = require('../models')

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

      let totalPrice = 0
      for(let i = 0; i <finalAmount.length; i++){
        totalPrice += finalAmount[i];
      }
      
      /* YANG DIKIRIM KE XENDIT */
      const paymentPayload = {
        external_id: `Invoice-${amountOrder.dataValues.id}`,
        amount: totalPrice,
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

      // await order.update(req.body.status,{
      //   where: {
      //     id_user
      //   }, 
      // })
      /**
      * callback payload from xendit/invoice service 
      {
        id: '61b89f4e25df117ddd2004f5',     
        user_id: '61a973c07ab41702fd944898',
        external_id: 'Invoice-5',
        is_high: false,
        status: 'PAID',
        merchant_name: 'ChefBox',
        amount: 1756000,
        created: '2021-12-14T13:42:39.358Z',
        updated: '2021-12-14T13:55:27.904Z',
        description: ' Nasi Goreng Pedas @ 6pcs, Spaghetti Bolognesse @ 28pcs',
        paid_amount: 1756000,
        fees_paid_amount: 5500,
        payment_method: 'RETAIL_OUTLET',
        adjusted_received_amount: 1750500,
        currency: 'IDR',
        paid_at: '2021-12-14T13:55:27.7Z',
        payment_channel: 'INDOMARET',
        payment_destination: 'TEST262013'
      }
      */
      res.status(200).json({message: req.body})
    }
    catch(err) {
      console.log(err)
      res.send(err)
    }
  }
}