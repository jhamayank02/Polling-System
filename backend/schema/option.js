// models/Poll.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Poll = require('./poll');

const Option = sequelize.define('Option', {
  option: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  voteCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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

// Defining the relationship: One Poll has many options
Poll.hasMany(Option, { foreignKey: 'pollId' });
Option.belongsTo(Poll, { foreignKey: 'pollId' });

module.exports = Option;
