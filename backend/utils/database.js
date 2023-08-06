const Sequelize = require("sequelize");
const sequelize = new Sequelize("expense-tracker-project", "root", "ayub1234", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
