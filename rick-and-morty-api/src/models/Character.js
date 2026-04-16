const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeInstance');

const Character = sequelize.define('Character', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false
  },
  name: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('Alive', 'Dead', 'unknown'), allowNull: false },
  species: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: '' },
  gender: {
    type: DataTypes.ENUM('Female', 'Male', 'Genderless', 'unknown'),
    allowNull: false
  },
  origin: { type: DataTypes.STRING, defaultValue: 'unknown' },
  location: { type: DataTypes.STRING, defaultValue: 'unknown' },
  image: { type: DataTypes.STRING, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'characters'
});

module.exports = Character;