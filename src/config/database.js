// src/config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

// Si estamos en pruebas (unitarias), NO crear conexión real
if (process.env.NODE_ENV === "test") {
  console.log("🟡 MODO TEST: Sequelize no se conectará a la base de datos real");
  
  // Sequelize necesita un objeto válido, pero sin conexión real
  const sequelizeMock = new Sequelize("sqlite::memory:", {
    logging: false
  });

  module.exports = sequelizeMock;
  return;
}

// Conexión normal para desarrollo / producción / CI
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false
  }
);

module.exports = sequelize;
