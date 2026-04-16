'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('character_comments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      character_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'characters', key: 'id' },
        onDelete: 'CASCADE'
      },
      author: { type: Sequelize.STRING, defaultValue: 'Anonymous' },
      content: { type: Sequelize.TEXT, allowNull: false },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('character_comments');
  }
};