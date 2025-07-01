const { config } = require('./config');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000, // 20 segundos (20000 ms)
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ ¡Conexión exitosa a la base de datos!');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
  }
})();

module.exports = pool;
