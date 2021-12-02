"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The models/index file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.rating.belongsTo(models.user, {
        foreignKey: "id_user",
      });
      models.rating.belongsTo(models.recipe, {
        foreignKey: "id_recipe",
      });
    }
  }
  rating.init(
    {
        id_user: DataTypes.INTEGER,
        id_recipe: DataTypes.INTEGER,
        rating: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "rating",
    }
  );
  return rating;
};