const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'nhhminhi_aodai', // database
  'nhhminhi_admin', // username
  process.env.DB_PASSWORD, // password
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306, 
    logging: false, // hoặc true nếu muốn log query
  }
);

module.exports = sequelize;