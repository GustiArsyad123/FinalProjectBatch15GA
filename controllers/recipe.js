const { category, user, type, ingredient, recipe } = require("../models");

class Recipe {
   async createRecipe(req, res, next) {
    try {
      const userId = req.userData.id;
      const { id_category, id_user, id_type, id_ingredient, title, duration, serving, image, description, direction, location } = req.body;
      const data = await recipe.create({
        id_user: +userId,
        id_category,
        id_type,
        id_ingredient,
        title,
        duration,
        serving,
        image,
        description,
        direction,
        location
      });

      res.status(201).json({ success: true, message: ["Create recipe Success!!"] });
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

   async getAllRecipeFiltered(req, res, next) {
    try {
        let { page = 1, limit = 6, }
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

   async getAllRecipe(req, res, next) {
    try {
        const userId = req.userData.id;
        const checkUser = await user.findOne({
            where: { id: userId },
        })

        if (checkUser.id !== userId) {
            return res.status(401).json({ success: false, errors: ["You must have permission to delete it."]})
        } 

        const data = await recipe.findAll({
            attributes: {
                exclude: ["createdAt", "deletedAt", "updatedAt"]
            }
        })

        if (data == null) {
           return res.status(404).json({ success: false, errors: ["Recipe not found"]})
        }

        res.status(200).json({ success: true, data: data })
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

   async getDetailRecipe(req, res, next) {
    try {
        const userId = req.userData.id;
        const checkUser = await user.findOne({
            where: { id: userId },
        })

        if (checkUser.id !== userId) {
            return res.status(401).json({ success: false, errors: ["You must have permission to delete it."]})
        } 
        
        const data = await recipe.findOne({
            where: { id: req.params.id },
        })

        if(data == null) {
            return res.status(404).json({ success: false, errors: ["Recipe not found"]})
        }

        res.status(200).json({ success: true, data: data })
    } catch (error) {
      res.status(500).json({ success:false, errors: ["Internal Server Error"] });
    }
  }

   async updateRecipe(req, res, next) {
    try {
        const userId = req.userData.id;
        const {id_category, id_type, id_ingredient, title, duration, serving, image, description, direction} = req.body 
        const checkUser = await user.findOne({
            where: { id: userId},
        })

        if (checkUser.id !== userId) {
            return res.status(401).json({success: false, errors: ["You must signin first, because you don't have permission to access."]})
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
            direction
        })

        if (updatedData[0] === 0) {
            return res.status(404).json({success: false, errors: ["recipe not found"]})
        }

        const data = await recipe.findOne({
            where: { id: req.params.id },
            attributes: {
                exclude: ["cretedAt", "updatedAt", "deletedAt"]
            },
            include: [
                {
                    model: category,
                    attributes: ["name"]
                },
                {
                    model: user,
                    attributes: ["username"]
                },
                {
                    model: type,
                    attributes: ["name"]
                },
                {
                    model: ingredient,
                    attributes: ["name", "price", "unit", "stock"]
                }
            ]
        })

        res.status(201).json({ success: true, message: ["Success update your recipe"], data:data })
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

   async deleteRecipe(req, res, next) {
    try {
        const userId = req.userData.id;
        const checkUser = await user.findOne({
            where: { id: userId},
        })
        

        if (checkUser.id !== userId) {
            return res.status(401).json({ success: false, errors: ["You must have permission to delete it."]})
        }

        let data = await recipe.destroy({ where: { id: req.params.id} })

        if (!data) {
            return res.status(404).json({ success: false, errors: ["recipe not found"] })
        }

        res.status(201).json({ success: true, message: ["Success delete your Recipe"] })
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }
}

module.exports = new Recipe();
