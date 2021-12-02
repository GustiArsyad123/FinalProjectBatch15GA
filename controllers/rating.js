const { rating, user } = require("../models");

class Rating {
    async createRating(req, res, next) {
    try {

    const userId = req.userData.id;
    const { value } = req.body;
    const { idRecipe } = req.params
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: [
            "You must signin first, because you don't have permission to access.",
          ],
        });
      }

      const newData = await rating.create({
        value: value,
        id_user: +userId,
        id_recipe: +idRecipe
      });

      res.status(201).json({ success: true, message: ["Success Add Rating"] });
    } catch (error) {
      console.log(error);
        res.status(500).json({ success: false, errors: ["Internal server error"] });
    }
  }


  async getRating(req, res, next) {
    try {

    const userId = req.userData.id;
    const { idRecipe } = req.params
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: [
            "You must signin first, because you don't have permission to access.",
          ],
        });
      }

      const data = await rating.findOne({
        where: {
          id_user: +userId,
          id_recipe: +idRecipe
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      });
      res.status(201).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
        res.status(500).json({ success: false, errors: ["Internal server error"] });
    }
  }
}

module.exports = new Rating();