"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("reviews", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      id_category: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      id_type: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      comment: {
        allowNull: false,
        type: Sequelize.STRING,
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

    // id_user foreign key
    await queryInterface.addConstraint("reviews", {
      fields: ["id_user"],
      type: "foreign key",
      name: "custom_fkey_id_userReview",
      references: {
        //Required field
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    // id_recipe foreign key
    await queryInterface.addConstraint("reviews", {
      fields: ["id_recipe"],
      type: "foreign key",
      name: "custom_fkey_id_recipeReview",
      references: {
        //Required field
        table: "recipes",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    // id_category foreign key
    await queryInterface.addConstraint("reviews", {
      fields: ["id_category"],
      type: "foreign key",
      name: "custom_fkey_id_categoryReview",
      references: {
        //Required field
        table: "categories",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    // id_type foreign key
    await queryInterface.addConstraint("reviews", {
      fields: ["id_type"],
      type: "foreign key",
      name: "custom_fkey_id_typeReview",
      references: {
        //Required field
        table: "types",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("reviews");
  },
};
