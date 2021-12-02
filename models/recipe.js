'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.recipe.hasMany(models.review, { foreignKey: "id_recipe" });
      models.recipe.hasMany(models.order, { foreignKey: "id_recipe" });
      models.recipe.hasMany(models.cart, { foreignKey: "id_recipe" });
      models.recipe.hasMany(models.seller, { foreignKey: "id_recipe" });
      models.recipe.belongsTo(models.category, { foreignKey: "id_category" });
      models.recipe.belongsTo(models.user, { foreignKey: "id_user" });
      models.recipe.belongsTo(models.type, { foreignKey: "id_type" });
      models.recipe.belongsTo(models.location, { foreignKey: "id_location" });
    }
  };
  recipe.init({
    id_category: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER,
    id_type: DataTypes.INTEGER,
    title: DataTypes.STRING,
    duration: DataTypes.STRING,
    serving: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    direction: DataTypes.TEXT,
    ingredient: DataTypes.JSONB,
    stock: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    id_location: DataTypes.INTEGER,
  }, {
    sequelize,
    paranoid: true,
    timestamps: true,
    modelName: 'recipe',
  });
  return recipe;
};