"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class xendit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  xendit.init(
    {
      id_user_chefbox: DataTypes.INTEGER,
      id_xendit: DataTypes.STRING,
      user_id_xendit: DataTypes.STRING,
      status: DataTypes.STRING,
      payment_method: DataTypes.STRING,
      amount: DataTypes.STRING,
      paid_at: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "xendit",
    }
  );
  return xendit;
};
