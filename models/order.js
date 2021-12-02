"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.order.belongsTo(models.user, {
        foreignKey: "id_user",
      });
      models.order.belongsTo(models.recipe, {
        foreignKey: "id_recipe",
      });
      models.order.belongsTo(models.type, {
        foreignKey: "id_type",
      });
      models.order.belongsTo(models.category, {
        foreignKey: "id_category",
      });
      models.order.belongsTo(models.delivery, {
        foreignKey: "id_delivery",
      });
      models.order.hasMany(models.seller, {
        foreignKey: "id_order",
      });

      // define association here
    }
  }
  order.init(
    {
      id_category: DataTypes.INTEGER,
      id_user: DataTypes.INTEGER,
      id_recipe: DataTypes.INTEGER,
      id_type: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      subtotal: DataTypes.INTEGER,
      uploadReceipt: DataTypes.STRING,
      deliveryFee: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      id_delivery: DataTypes.INTEGER,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "order",
    }
  );
  return order;
};
