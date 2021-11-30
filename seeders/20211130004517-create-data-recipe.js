'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('data_recipes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_category: {
        type: Sequelize.INTEGER
      },
      id_type: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.STRING
      },
      serving: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('data_recipes');
  }
};