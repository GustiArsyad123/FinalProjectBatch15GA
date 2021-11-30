"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sellers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_order: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      id_user: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      id_recipe: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
    // id_order foreign key
    await queryInterface.addConstraint("sellers", {
      fields: ["id_order"],
      type: "foreign key",
      name: "custom_fkey_id_orderSeller",
      references: {
        //Required field
        table: "orders",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    // id_user foreign key
    await queryInterface.addConstraint("sellers", {
      fields: ["id_user"],
      type: "foreign key",
      name: "custom_fkey_id_userSeller",
      references: {
        //Required field
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    // id_recipe foreign key
    await queryInterface.addConstraint("sellers", {
      fields: ["id_recipe"],
      type: "foreign key",
      name: "custom_fkey_id_typdfdeRecipe",
      references: {
        //Required field
        table: "recipes",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("sellers");
  },
};
