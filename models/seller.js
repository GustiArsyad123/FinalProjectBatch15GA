"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class seller extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.seller.belongsTo(models.user, { foreignKey: "id_user" });
      models.seller.belongsTo(models.recipe, { foreignKey: "id_recipe" });
      models.seller.belongsTo(models.order, { foreignKey: "id_order" });
    }
  }
  seller.init(
    {
      id_user: DataTypes.INTEGER,
      id_recipe: DataTypes.INTEGER,
      id_order: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      sellerID: DataTypes.INTEGER,
      delivery_name: DataTypes.STRING,
      delivery_address: DataTypes.STRING,
      delivery_phonenumber: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "seller",
    }
  );
  return seller;
};