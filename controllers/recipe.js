const { category, user, type, recipe, review, location, rating } = require("../models");
const { Op } = require("sequelize");
const { gte } = require("sequelize/dist/lib/operators");

class Recipe {
  async createRecipeOne(req, res, next) {
    try {
      const userId = req.userData.id;
      const {
        id_category,
        id_type,
        title,
        duration,
        serving,
        image,
        description,
      } = req.body;

      await recipe.create({
        id_user: +userId,
        id_category,
        id_type,
        title,
        duration,
        serving,
        image,
        description,
      });

      res
        .status(201)
        .json({ success: true, message: ["Create recipe Success!!"] });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async createRecipeTwo(req, res, next) {
    try {
      const userId = req.userData.id;
      const { amount, unit, label } = req.body;
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

      const findData = await recipe.findOne({
        where: { id: req.params.id },
      });

      let beforeIngredient = findData.dataValues.ingredient;

      let bahan = [];

      if (beforeIngredient != null) {
        bahan.push(beforeIngredient + "\n" + `${amount} ${unit} ${label}.`);
      } else {
        bahan.push(`${amount} ${unit} ${label}.`);
      }

      const updatedData = await recipe.update(
        {
          ingredient: bahan,
        },
        {
          where: { id: req.params.id },
        }
      );

      if (updatedData[0] === 0) {
        return res.status(404).json({ success: false, errors: ["recipe not found"] });
      }

      res
        .status(201)
        .json({ success: true, message: ["Success update your recipe"] });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async createRecipeThree(req, res, next) {
    try {
      const userId = req.userData.id;
      const { direction } = req.body;
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id != userId) {
        return res.status(401).json({
          success: false,
          errors: [
            "You must signin first, because you don't have permission to access.",
          ],
        });
      }

      const updatedData = await recipe.update(
        {
          direction,
        },
        {
          where: { id: req.params.id },
        }
      );

      if (updatedData[0] == 0) {
        return res.status(404).json({ success: false, errors: ["recipe not found"] });
      }

      res.status(201).json({ success: true, message: ["Success update your recipe"] });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async createRecipeFour(req, res, next) {
    try {
      const userId = req.userData.id;
      const { price, stock, id_location } = req.body;
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id != userId) {
        return res.status(401).json({
          success: false,
          errors: [
            "You must signin first, because you don't have permission to access.",
          ],
        });
      }

      const updatedData = await recipe.update(
        {
          price,
          stock,
          id_location,
        },
        {
          where: { id: req.params.id },
        }
      );

      if (updatedData[0] == 0) {
        return res.status(404).json({ success: false, errors: ["recipe not found"] });
      }

      res.status(201).json({ success: true, message: ["Success update your recipe"] });
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async getAllRecipeFiltered(req, res, next) {
    try {
      let {
        page = 1,
        limit = 6,
        cat = 5,
        type = 1,
        loc = 1,
        orders = "createdAt",
        sort = "ASC",
        gte = 0,
        lte = 100000000,
      } = req.query;

      const data = await recipe.findAll({
        where: {
          [Op.and]: {
            id_category: cat,
            id_type: type,
            id_location: loc
          },
          price: {
            [Op.between]: [gte, lte],
          },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        include: [
          {
            model: user,
            attributes: ["userName"],
          },
          {
            model: category,
            attributes: ["name"],
          },
          {
            model: location,
            attributes: ["name"],
          },
        ],
        order: [[orders || "createdAt", sort || "DESC"]],
        limit: +limit,
        offset: (+page - 1) * parseInt(limit),
      });

      if (data == null) {
        return res
          .status(404)
          .json({ success: false, errors: ["Recipe not found"] });
      }

      res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async getAllRecipe(req, res, next) {
    try {
      let { page = 1, limit = 6 } = req.query;
      const userId = req.userData.id;
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: ["You must have permission to delete it."],
        });
      }

      const data = await recipe.findAll({
        attributes: {
          exclude: ["createdAt", "deletedAt", "updatedAt"],
        },
        include: [
          {
            model: user,
            attributes: ["userName"],
          },
          {
            model: category,
            attributes: ["name"],
          },
          {
            model: type,
            attributes: ["name"],
          },
          {
            model: location,
            attributes: ["name"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: +limit,
        offset: (+page - 1) * parseInt(limit),
      });

      if (data == null) {
        return res.status(404).json({ success: false, errors: ["Recipe not found"] });
      }

      res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async getDetailRecipe(req, res, next) {
    try {
      const userId = req.userData.id;
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: ["You must have permission to delete it."],
        });
      }

      const data = await recipe.findOne({
        where: { id: req.params.id },
        attributes: {
          exclude: ["createdAt", "deletedAt", "updatedAt"],
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
            model: category,
            attributes: ["name"],
          },
          {
            model: type,
            attributes: ["name"],
          },
          {
            model: location,
            attributes: ["name"],
          }
        ],
      });

      const allComments = await review.findAll({
        include: [{ model: user, attributes: ["userName", "image"] }],
        where: { id_recipe: req.params.id },
        attributes: {
          include: ["comment"],
          exclude: ["deletedAt"],
        },
      });

      const allRatings = await rating.findAll({
        include: [{ model: user, attributes: ["userName", "image"] }],
        where: { id_recipe: req.params.id },
        attributes: {
          include: ["value"],
          exclude: ["deletedAt"],
        },
      });

      const sumRatings = await rating.sum("value", {
        where: { id_recipe: req.params.id },
      });

      const countRatings = await rating.count({
        where: { id_recipe: req.params.id },
      });

      const averageRatings = sumRatings / countRatings;

      if (data == null) {
        return res
          .status(404)
          .json({ success: false, errors: ["Recipe not found"] });
      }

      res.status(200).json({ success: true, data: data, allComments, averageRatings, peopleRatings: allRatings.length, allRatings });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async searchRecipe(req, res, next) {
    try {
      const { keyword } = req.query;
      const userId = req.userData.id;
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: ["You must have permission to delete it."],
        });
      }

      const data = await recipe.findAll({
        where: {
          title: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        include: [
          {
            model: user,
            attributes: ["userName"],
          },
          {
            model: category,
            attributes: ["name"],
          },
          {
            model: type,
            attributes: ["name"],
          },
          {
            model: location,
            attributes: ["name"],
          },
        ],
      });

      if (data.length == 0) {
        return res
          .status(404)
          .json({ success: false, errors: ["Recipe is not found"] });
      }

      res.status(200).json({ success: true, data: data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async updateRecipe(req, res, next) {
    try {
      const userId = req.userData.id;
      const {
        id_category,
        id_type,
        id_ingredient,
        title,
        duration,
        serving,
        image,
        description,
        direction,
      } = req.body;
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

      const updatedData = await recipe.update({
        id_category,
        id_type,
        id_ingredient,
        title,
        duration,
        serving,
        image,
        description,
        direction,
      });

      if (updatedData[0] === 0) {
        return res
          .status(404)
          .json({ success: false, errors: ["recipe not found"] });
      }

      const data = await recipe.findOne({
        where: { id: req.params.id },
        attributes: {
          exclude: ["cretedAt", "updatedAt", "deletedAt"],
        },
        include: [
          {
            model: category,
            attributes: ["name"],
          },
          {
            model: user,
            attributes: ["username"],
          },
          {
            model: type,
            attributes: ["name"],
          },
          {
            model: location,
            attributes: ["name"],
          },
        ],
      });

      res.status(201).json({
        success: true,
        message: ["Success update your recipe"],
        data: data,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async deleteRecipe(req, res, next) {
    try {
      const userId = req.userData.id;
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id !== userId) {
        return res.status(401).json({
          success: false,
          errors: ["You must have permission to delete it."],
        });
      }

      let data = await recipe.destroy({ where: { id: req.params.id } });

      if (!data) {
        return res
          .status(404)
          .json({ success: false, errors: ["recipe not found"] });
      }

      res
        .status(201)
        .json({ success: true, message: ["Success delete your Recipe"] });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }
}

module.exports = new Recipe();
