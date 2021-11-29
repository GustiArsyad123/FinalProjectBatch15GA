"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.location.hasMany(models.recipe, {
        foreignKey: "id_location",
      });
      models.location.hasMany(models.user, {
        foreignKey: "id_location",
      });

      // define association here
    }
  }
  location.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "location",
    }
  );
  return location;
};
