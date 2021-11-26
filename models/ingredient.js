"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ingredient extends Model {
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
  ingredient.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      unit: DataTypes.STRING,
      stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "ingredient",
    }
  );
  return ingredient;
};
