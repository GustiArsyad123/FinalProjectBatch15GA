"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.type.hasMany(models.recipe, {
        foreignKey: "id_type",
      });
      models.type.hasMany(models.review, {
        foreignKey: "id_type",
      });

      // define association here
    }
  }
  type.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "type",
    }
  );
  return type;
};
