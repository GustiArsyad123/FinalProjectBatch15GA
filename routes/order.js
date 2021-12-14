const express = require("express");
const { uploadReceiptValidator } = require("../middlewares/validators/uploadReceiptValidator");
const { authentication } = require("../middlewares/Auth/authentication");

const {
  createPayment,
  getCheckout,
  editAddressDelivery,
  confirmPayment,
  updateReceipt,
} = require("../controllers/order");

const { checkout, callbackURL } = require("../controllers/payment");

const router = express.Router();

router.get("/", authentication, getCheckout);
router.post("/", uploadReceiptValidator, authentication, createPayment);
router.patch("/:idDelivery", authentication, editAddressDelivery);
router.get("/confirmpayment", authentication, confirmPayment);
router.put("/", uploadReceiptValidator, authentication, updateReceipt);
router.post('/checkout',  checkout)
router.post('/xendit-cb',  callbackURL)

module.exports = router;
