const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL || process.env.MYSQL_URL, {
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
