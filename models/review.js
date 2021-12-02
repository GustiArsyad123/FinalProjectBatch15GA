"use strict";
const moment = require("moment");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.review.belongsTo(models.user, { foreignKey: "id_user" });
      models.review.belongsTo(models.recipe, { foreignKey: "id_recipe" });
      models.review.belongsTo(models.category, { foreignKey: "id_category" });
      models.review.belongsTo(models.type, { foreignKey: "id_type" });
    }
  }
  review.init(
    {
      id_user: DataTypes.INTEGER,
      id_recipe: DataTypes.INTEGER,
      id_category: DataTypes.INTEGER,
      id_type: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "review",
    }
  );

  review.afterFind((instance) => {
    if (instance.length > 0) {
      instance.forEach((el) => {
        let waktu = new Date(el.dataValues.updatedAt).toLocaleString(
          "en-US",
          {
            timeZone: "Asia/Jakarta",
          }
        );

        el.dataValues.commentTime = moment(
          waktu,
          "MM/DD/YYYY hh:mm:ss A"
        ).fromNow();
      });
    }
  });
  return review;
};
