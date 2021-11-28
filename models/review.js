"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.review.belongsTo(models.user, { foreignKey: "id_user" });
      models.review.belongsTo(models.recipe, { foreignKey: "id_recipe" });
      models.review.belongsTo(models.category, { foreignKey: "id_category" });
      models.review.belongsTo(models.type, { foreignKey: "id_type" });
    }
  }
  review.init(
    {
      id_user: DataTypes.INTEGER,
      id_recipe: DataTypes.INTEGER,
      id_category: DataTypes.INTEGER,
      id_type: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "review",
    }
  );
  return review;
};
