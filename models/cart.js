'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.cart.belongsTo(models.user, {
        foreignKey: "id_user"
      });
      models.cart.belongsTo(models.recipe, {
        foreignKey: "id_recipe"
      });
    }
  };
  cart.init(
    {
      id_user: DataTypes.INTEGER,
      id_recipe: DataTypes.INTEGER,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "cart",
    }
  );
  return cart;
};