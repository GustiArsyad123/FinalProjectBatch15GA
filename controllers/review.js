const { review, category, user, type } = require("../models");
const moment = require("moment");

class Review {
  async getAllreview(req, res, next) {
    try {
      const data = await review.findAll({
        attributes: {
          exclude: ["updatedAt", "deletedAt"],
        },
      });

      if (data.length === 0) {
        return res.status(404).json({ success: false, errors: ["Review not found"] });
      }

      res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async updateReview(req, res, next) {
    try {

      const reviewId = await review.findOne({
        where: { id: req.params.id },
      });

      if (reviewId.userId !== req.userData.id) {
        return res
          .status(401)
          .json({ success: false, errors: ["You do not have permission to access this!"] });
      }

      const updatedData = await review.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      // If no data updated
      if (updatedData[0] === 0) {
        return res.status(404).json({ success: false, errors: ["Review not found"] });
      }

      const updateComment = await review.findOne(
        {
          type: req.body.id_type,
          id_user: req.userData.id,
          category: req.body.id_category,
          review: req.body.id,
        },
        { where: { id: req.params.id } }
      );
      const data = await events.findOne({
        where: { id: req.params.id },
      });

      res.status(201).json({ success: true, message: ["Succes Update Your Review"] });
    } catch (error) {
      next(error);
    }
  }

  async getDetailReview(req, res, next) {
    try {
      const data = await review.findOne({
        where: { id: req.params.id },
      });

      if (!data) {
        return res.status(404).json({ success: false, errors: ["Review is empty"] });
      }

      res.status(200).json({ success: true, data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async createReview(req, res, next) {
    try {
      const newData = await review.create(req.body);

      const data = await review.findOne({
        where: {
          id: newData.id,
        },

        include: [
          {
            model: user,
            attributes: ["id", "usertName", "image"],
          },
          {
            model: recipe,
          },
        ],
      });

      res.status(201).json({
        success: true,
        data: data,
        message: ["Congrats! You have successfully submitted a Review"],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async deleteReview(req, res, next) {
    try {
      const deleteId = await review.findOne({
        where: { id: req.params.id },
      });

      if (deleteId.userId !== req.userData.id) {
        return res
          .status(401)
          .json({ success: false, errors: ["You do not have permission to access this!"] });
      }
      let data = await review.destroy({ where: { id: req.params.id } });

      if (!data) {
        return res.status(404).json({ success: false, errors: ["Review not found"] });
      }

      res
        .status(200)
        .json({ success: true, message: ["Success delete your Review!"] });
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }
}

module.exports = new Review();
