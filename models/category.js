"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.category.hasMany(models.recipe, {
        foreignKey: "id_category",
      });
      models.category.hasMany(models.order, {
        foreignKey: "id_category",
      });
      models.category.hasMany(models.review, {
        foreignKey: "id_category",
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
      modelName: "users",
    }
  );
  return category;
};
