'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_user: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      id_recipe: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });

    // id_user foreign key
    await queryInterface.addConstraint('carts', {
      fields: ['id_user'],
      type: 'foreign key',
      name: 'custom_fkey_id_userCart',
      references: {
        //Required field
        table: 'users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });


     // id_recipe foreign key
    await queryInterface.addConstraint('carts', {
        fields: ['id_recipe'],
        type: 'foreign key',
        name: 'custom_fkey_id_recipeCart',
        references: {
          //Required field
          table: 'recipes',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      });

  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('carts');
  }
};