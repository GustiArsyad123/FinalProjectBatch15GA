"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.users.hasMany(models.recipe, {
        foreignKey: "id_user",
      });
      models.users.hasMany(models.review, {
        foreignKey: "id_user",
      });
      models.users.hasMany(models.order, {
        foreignKey: "id_user",
      });
      // define association here
    }
  }
  users.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      userName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      location: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "users",
    }
  );
  return users;
};
