const express = require("express");
const { authentication } = require("../middlewares/Auth/authentication");

const { createReview, getAllreview, getDetailReview, updateReview, deleteReview } = require("../controllers/review");

const router = express.Router();

router.post("/", authentication, createReview);
router.get("/", getAllreview);
router.get("/:id", authentication, getDetailReview);
router.put("/:id", authentication, updateReview);
router.delete("/:id", authentication, deleteReview);

module.exports = router;
