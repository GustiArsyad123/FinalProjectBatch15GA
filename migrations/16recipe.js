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
        type: Sequelize.STRING
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      direction: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      ingredient: {
        allowNull: true,
        type: Sequelize.JSONB
      },
      stock: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      price: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      id_location: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      location: {
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
      name: 'custom_fkey_id_catRecipe',
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

          // id_location foreign key
    await queryInterface.addConstraint('recipes', {
      fields: ['id_location'],
      type: 'foreign key',
      name: 'custom_fkey_id_locationRecipe',
      references: {
        //Required field
        table: 'locations',
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