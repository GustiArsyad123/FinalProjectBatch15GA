const { review, category, user, type, recipe } = require("../models");

class Review {
  async getAllreview(req, res, next) {
    try {
      const userId = req.userData.id;
      const { idRecipe } = req.params;

      const checkUser = await user.findOne({
        where: { id: +userId },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: ["You must have permission to access."],
        });
      }

      const data = await review.findAll({
        where: {
          id_recipe: +idRecipe,
        },
        attributes: {
          exclude: ["deletedAt"],
        },
        include: [
          {
            model: user,
            attributes: ["userName"],
          },
          {
            model: user,
            attributes: ["image"],
          },
          {
            model: recipe,
            attributes: ["title"],
          },
          {
            model: category,
            attributes: ["name"],
          },
          {
            model: type,
            attributes: ["name"],
          },
        ],
        order: [["id", "DESC"]],
      });

      if (data == null) {
        return res
          .status(404)
          .json({ success: false, errors: ["Review not found"] });
      }

      res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async updateReview(req, res, next) {
    try {
      const userId = req.userData.id;
      const { idRecipe, idReview } = req.params;
      const { comment } = req.body;

      const checkUser = await user.findOne({
        where: { id: +userId },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: ["You must have permission to access."],
        });
      }

      const updateData = await review.update(
        {
          comment: comment,
        },
        {
          where: {
            id: +idReview,
            id_recipe: +idRecipe,
          },
        }
      );

      if (updateData == null) {
        return res
          .status(404)
          .json({ success: false, errors: ["Review not found"] });
      }

      res
        .status(201)
        .json({ success: true, message: ["Succes Update Your Review"] });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async getDetailReview(req, res, next) {
    try {
      const userId = req.userData.id;
      const { idRecipe, idReview } = req.params;

      const checkUser = await user.findOne({
        where: { id: +userId },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: ["You must have permission to access.."],
        });
      }

      const data = await review.findOne({
        where: {
          id: +idReview,
          id_recipe: +idRecipe,
        },
        attributes: {
          exclude: ["updatedAt", "deletedAt"],
        },
        include: [
          {
            model: user,
            attributes: ["userName"],
          },
          {
            model: user,
            attributes: ["image"],
          },
          {
            model: recipe,
            attributes: ["title"],
          },
          {
            model: category,
            attributes: ["name"],
          },
          {
            model: type,
            attributes: ["name"],
          },
        ],
      });

      if (data == null) {
        return res
          .status(404)
          .json({ success: false, errors: ["Review not found"] });
      }

      res.status(200).json({ success: true, data: data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async createReview(req, res, next) {
    try {
      const userId = req.userData.id;
      const { idRecipe } = req.params;
      const { comment } = req.body;
      const checkUser = await user.findOne({
        where: { id: +userId },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: ["You must have permission to access."],
        });
      }

      const getRecipe = await recipe.findOne({
        where: {
          id: idRecipe,
        },
      });

      if (getRecipe == null) {
        return res
          .status(404)
          .json({ success: false, errors: ["Recipe not found"] });
      }

      const idCategory = getRecipe.dataValues.id_category;
      const idType = getRecipe.dataValues.id_type;

      // const checkReview = await review.findOne({
      //   where: {
      //     id_user: +userId,
      //     id_recipe: +idRecipe,
      //   }
      // })

      // if(checkReview == null){
        await review.create({
          id_user: +userId,
          id_recipe: +idRecipe,
          id_category: +idCategory,
          id_type: +idType,
          comment: comment,
        });
      // } else {  
      //   return res.status(400).json({ success: false, errors: ["You can review maximum 1 per recipe"]})
      // }

      res.status(201).json({
        success: true,
        message: ["Congrats! You have successfully submitted a Review"],
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async deleteReview(req, res, next) {
    try {
      const userId = req.userData.id;
      const { idRecipe, idReview } = req.params;
      const checkUser = await user.findOne({
        where: { id: +userId },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: ["You must have permission to access."],
        });
      }

      await review.destroy({
        where: {
          id: +idReview,
          id_recipe: +idRecipe,
        },
      });

      res
        .status(200)
        .json({ success: true, message: ["Success delete your Review!"] });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }
}

module.exports = new Review();
