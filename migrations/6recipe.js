'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('recipes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_category: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      id_user: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      id_type: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      id_ingredient: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: true,
        type: Sequelize.STRING
      },
      duration: {
        allowNull: true,
        type: Sequelize.STRING
      },
      serving: {
        allowNull: true,
        type: Sequelize.STRING
      },
      image: {
        allowNull: true,
        type: Sequelize.DATE
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING
      },
      direction: {
        allowNull: true,
        type: Sequelize.STRING
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
    // id_category foreign key
    await queryInterface.addConstraint('recipes', {
      fields: ['id_category'],
      type: 'foreign key',
      name: 'custom_fkey_id_categoryRecipe',
      references: {
        //Required field
        table: 'categories',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // id_user foreign key
    await queryInterface.addConstraint('recipes', {
      fields: ['id_user'],
      type: 'foreign key',
      name: 'custom_fkey_id_userRecipe',
      references: {
        //Required field
        table: 'users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // id_type foreign key
    await queryInterface.addConstraint('recipes', {
        fields: ['id_type'],
        type: 'foreign key',
        name: 'custom_fkey_id_typeRecipe',
        references: {
          //Required field
          table: 'types',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      });

      // id_ingredient foreign key
    await queryInterface.addConstraint('recipes', {
        fields: ['id_ingredient'],
        type: 'foreign key',
        name: 'custom_fkey_id_ingredientRecipe',
        references: {
          //Required field
          table: 'ingredients',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('recipes');
  }
};