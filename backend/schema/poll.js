// models/Poll.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Poll = sequelize.define('Poll', {
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Poll;
