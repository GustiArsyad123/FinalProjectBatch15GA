"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.user.hasMany(models.recipe, {
        foreignKey: "id_user",
      });
      models.user.hasMany(models.review, {
        foreignKey: "id_user",
      });
      models.user.hasMany(models.order, {
        foreignKey: "id_user",
      });
      models.user.hasMany(models.cart, {
        foreignKey: "id_user",
      });
      models.user.hasMany(models.seller, {
        foreignKey: "id_user",
      });
      models.user.hasMany(models.rating, {
        foreignKey: "id_user",
      });
      models.user.belongsTo(models.location, { foreignKey: "id_location" });
      // define association here
    }
  }
  user.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      userName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      address: DataTypes.STRING,
      image: DataTypes.STRING,
      id_location: DataTypes.INTEGER,
      idfacebook: DataTypes.INTEGER
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "user",
    }
  );
  return user;
};
