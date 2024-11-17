// db.js
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance to connect to PostgreSQL
const sequelize = new Sequelize({
  host: 'localhost',               // PostgreSQL host (usually 'localhost' or IP address)
  dialect: 'postgres',             // Dialect for PostgreSQL
  username: process.env.DB_USERNAME,       // PostgreSQL username
  password: process.env.DB_PASSWORD,       // PostgreSQL password
  database: 'Polling System',       // PostgreSQL database name
  logging: true,                  // Disable logging, set to true if you want SQL queries logged
});

async function authenticate() {
  try {
    await sequelize.authenticate(); // Test the connection
    console.log('Connection to PostgreSQL has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

authenticate();

module.exports = sequelize;
