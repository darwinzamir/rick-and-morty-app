const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeInstance');

const Comment = sequelize.define('Comment', {
  character_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    defaultValue: 'Anonymous'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'character_comments'
});

module.exports = Comment;