const mysql = require("mysql2")
require("dotenv").config()
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: process.env.DB_PW,
      database: 'Employee_db'
    },
    console.log(`Connected to the Employee_db database.`)
  );

  module.exports = db;