const express = require("express");
const { authentication } = require("../middlewares/Auth/authentication");

const { createDelivery, getAllDelivery, getDetailDelivery, updateDelivery, deleteDelivery } = require("../controllers/delivery");

const router = express.Router();

router.post("/", authentication, createDelivery);
router.get("/", authentication, getAllDelivery);
router.get("/:id", authentication, getDetailDelivery);
router.put("/:id", authentication, updateDelivery);
router.delete("/:id", authentication, deleteDelivery);

module.exports = router;
