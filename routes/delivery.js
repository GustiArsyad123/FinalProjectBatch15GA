const express = require("express");
const { authentication } = require("../middlewares/Auth/authentication");

const { createDelivery, getAllDelivery, getDetailDelivery, updateDelivery, deleteDelivery } = require("../controllers/delivery");

const router = express.Router();

router.post("/delivery/create", authentication, createDelivery);
router.get("/delivery", authentication, getAllDelivery);
router.get("/delivery/:id", authentication, getDetailDelivery);
router.put("/delivery/update", authentication, updateDelivery);
router.delete("/delivery/delete/:id", authentication, deleteDelivery);

module.exports = router;
