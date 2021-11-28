const express = require("express");
const { authentication } = require("../middlewares/Auth/authentication");

const { createReview, getAllreview, getDetailReview, updateReview, deleteReview } = require("../controllers/review");

const router = express.Router();

router.post("/review/create", authentication, createReview);
router.get("/review", getAllreview);
router.get("/review/:id", authentication, getDetailReview);
router.put("/review/update", authentication, updateReview);
router.delete("/review/delete/:id", authentication, deleteReview);

module.exports = router;
