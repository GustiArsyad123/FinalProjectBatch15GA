// integrasi ke payment gateway
const { verifyToken } = require("../utils/index");
const { order, cart, user, recipe, delivery } = require('../models')

const XENDIT_URL = process.env.XENDIT_INVOICE // .env
const XENDIT_KEY = process.env.XENDIT_API_BASE64 // HARUS BASE64 FORMAT, .env
const paymentConfig = {
  headers: {
    authorization: `Basic ${XENDIT_KEY}`,
  }
}
const axios = require('axios')

module.exports = {
  async checkout (req, res, next) {
    try {
      const { email } = req.body

      const token = req.headers.access_token
      let userId = ''
      if (token) {
          const payload = verifyToken(token)
          userId = payload.id
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

      console.log(amountOrder);
      let firstName = amountOrder.delivery.firstName
      let lastName = amountOrder.delivery.lastName
      let phone = amountOrder.delivery.phoneNumber
      let address = amountOrder.delivery.address
      console.log(firstName, lastName, phone, address);

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

      /* Get all title recipe */
      let allDescription = []
      for(let i = 0; i < finalData.length; i++){
        allDescription.push(' ' + finalData[i].title)
      }

      console.log('INI ALL DESCRIPTIN', allDescription[0]);
      
      
      /* YANG DIKIRIM KE XENDIT */
      const paymentPayload = {
        external_id: `Invoice-${amountOrder.dataValues.id}`,
        amount: amountOrder.dataValues.total, // Dapet dari table order
        payer_email: email,
        description: allDescription.toString(), // ISI DI CART
        should_send_email: true,
        merchant_profile_picture_url: "https://res.cloudinary.com/see-event/image/upload/v1638435431/c4qaz6prwl1zqg4un7ba.png",
        invoice_duration: 7200, // 2 hour
        customer: {
          given_names: `${firstName + ' ' + lastName}`,
          email: email,
          mobile_number: `${phone}`,
          address: [
            {address: 'Jln. Bersama Kamu No. 17, Tangerang'}
          ]
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
      /**
      * callback payload from xendit/invoice service 
      {
        "id": "579c8d61f23fa4ca35e52da4", ------ important
        "external_id": "invoice_123124123", ------ important
        "user_id": "5781d19b2e2385880609791c", ------ important
        "is_high": true,
        "payment_method": "BANK_TRANSFER", ------ important
        "status": "PAID", ------ important
        "merchant_name": "Xendit",
        "amount": 50000, ------ important
        "paid_amount": 50000,
        "bank_code": "PERMATA", ------ important
        "paid_at": "2016-10-12T08:15:03.404Z", ------ important
        "payer_email": "wildan@xendit.co",
        "description": "This is a description", ------ important
        "adjusted_received_amount": 47500, ------ important
        "fees_paid_amount": 0,
        "updated": "2016-10-10T08:15:03.404Z",
        "created": "2016-10-10T08:15:03.404Z",
        "currency": "IDR",
        "payment_channel": "PERMATA", ------ important
        "payment_destination": "888888888888" ------ important
      }
      */
      res.status(200).send('callback success')
    }
    catch(err) {
      console.log(err)
      res.send(err)
    }
  }
}