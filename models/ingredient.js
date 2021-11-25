"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     models.Ingredient.hasMany(models.recipe, {
       foreignKey: "id_ingredient",
     });

      // define association here
    }
  }
  users.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "ingredient",
    }
  );
  return Ingredient;
};
