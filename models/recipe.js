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
      models.event.hasMany(models.review, { foreignKey: "id_recipe" });
      models.event.hasMany(models.order, { foreignKey: "id_recipe" });
      models.event.belongsTo(models.category, { foreignKey: "id_category" });
      models.event.belongsTo(models.user, { foreignKey: "id_user" });
      models.event.belongsTo(models.type, { foreignKey: "id_type" });
      models.event.belongsTo(models.ingredient, { foreignKey: "id_ingredient" });
    }
  };
  recipe.init({
    id_category: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER,
    id_type: DataTypes.INTEGER,
    id_ingredient: DataTypes.INTEGER,
    title: DataTypes.STRING,
    duration: DataTypes.STRING,
    serving: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    direction: DataTypes.STRING
  }, {
    sequelize,
    paranoid: true,
    timestamps: true,
    modelName: 'recipe',
  });
  return recipe;
};