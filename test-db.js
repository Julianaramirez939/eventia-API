const { sequelize } = require('./src/models');

async function test() {
  try {
    console.log('Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✔ Conexión exitosa');

    console.log('Sincronizando modelos...');
    await sequelize.sync({ force: true }); 
    console.log('✔ Tablas creadas correctamente');

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

test();
