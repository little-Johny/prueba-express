
const config = {
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASS,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET
};

console.log(config)

module.exports = {
  config
}