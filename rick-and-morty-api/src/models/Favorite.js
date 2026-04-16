const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeInstance');

const Favorite = sequelize.define('Favorite', {
  character_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'character_favorites'
});

module.exports = Favorite;