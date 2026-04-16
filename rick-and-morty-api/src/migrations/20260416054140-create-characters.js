'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('characters', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false
      },
      name: { type: Sequelize.STRING, allowNull: false },
      status: {
        type: Sequelize.ENUM('Alive', 'Dead', 'unknown'),
        allowNull: false
      },
      species: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, defaultValue: '' },
      gender: {
        type: Sequelize.ENUM('Female', 'Male', 'Genderless', 'unknown'),
        allowNull: false
      },
      origin: { type: Sequelize.STRING, defaultValue: 'unknown' },
      location: { type: Sequelize.STRING, defaultValue: 'unknown' },
      image: { type: Sequelize.STRING, allowNull: false },
      is_deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('characters');
  }
};
