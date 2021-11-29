const express = require("express");
const { authentication } = require("../middlewares/Auth/authentication");

const { addCart, showCart, deleteCart } = require("../controllers/cart");

const router = express.Router();

router.post("/:idRecipe", authentication, addCart);
router.get("/", authentication, showCart);
router.delete("/:idRecipe", authentication, deleteCart);

module.exports = router;
