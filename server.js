require("dotenv").config();
const app = require("./src/app");
const sequelize = require("./src/config/database");
const { connectRedis } = require("./src/cache/redisClient");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log("Base de datos conectada");

    // Crear tablas si no existen
    await sequelize.sync({ force: false }); // force: true reinicia las tablas
    console.log("Tablas sincronizadas");

    //Conexión opcional a Redis
    await connectRedis();
    console.log("Redis conectado");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
}

start();
