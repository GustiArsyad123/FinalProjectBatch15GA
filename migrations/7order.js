'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
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
      id_recipe: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      id_delivery: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      quantity: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      subtotal: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      uploadReceipt: {
        allowNull: true,
        type: Sequelize.STRING
      },
      deliveryFee: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      total: {
        allowNull: true,
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
    // id_category foreign key
    await queryInterface.addConstraint('orders', {
      fields: ['id_category'],
      type: 'foreign key',
      name: 'custom_fkey_id_categoryOrder',
      references: {
        //Required field
        table: 'categories',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // id_user foreign key
    await queryInterface.addConstraint('orders', {
      fields: ['id_user'],
      type: 'foreign key',
      name: 'custom_fkey_id_userOrder',
      references: {
        //Required field
        table: 'users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // id_type foreign key
    await queryInterface.addConstraint('orders', {
        fields: ['id_type'],
        type: 'foreign key',
        name: 'custom_fkey_id_typeOrder',
        references: {
          //Required field
          table: 'types',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      });

     // id_recipe foreign key
    await queryInterface.addConstraint('orders', {
        fields: ['id_recipe'],
        type: 'foreign key',
        name: 'custom_fkey_id_recipeOrder',
        references: {
          //Required field
          table: 'recipes',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      });

     // id_delivery foreign key
    await queryInterface.addConstraint('orders', {
      fields: ['id_delivery'],
      type: 'foreign key',
      name: 'custom_fkey_id_deliveryOrder',
      references: {
        //Required field
        table: 'deliveries',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};