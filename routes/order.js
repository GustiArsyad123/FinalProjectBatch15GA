const express = require("express");
const { authentication } = require("../middlewares/Auth/authentication");

const {
  createPayment,
  getCheckout,
  editAddressDelivery,
  confirmPayment,
  updateReceipt,
} = require("../controllers/order");

const router = express.Router();

router.get("/", authentication, getCheckout);
router.post("/", authentication, createPayment);
router.patch("/delivery", authentication, editAddressDelivery);
router.put("/", authentication, confirmPayment);
router.put("/", authentication, updateReceipt);

module.exports = router;
