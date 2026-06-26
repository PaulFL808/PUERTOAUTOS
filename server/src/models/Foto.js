const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Foto = sequelize.define('Foto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Foto;
