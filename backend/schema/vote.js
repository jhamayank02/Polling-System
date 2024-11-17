// models/Vote.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Option = require('./option');

const Vote = sequelize.define('Vote', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

// Defining the relationship: A Vote belongs to a option which further belong to a poll
Option.hasMany(Vote, { foreignKey: 'optionId' });

module.exports = Vote;
