const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: '1234',
    database: 'authdemo',
  });
  
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
    } else {
      console.log('Connected to MySQL database');
    }
});

connection.query("SHOW TABLES LIKE 'users'", (err, userRows) => {
  if (err) throw err;

  if (userRows.length === 0) {
    const createUserTable = `
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      )`;

    connection.query(createUserTable, (err, result) => {
      if (err) throw err;
      console.log('Users table created');
    });
  }
});

module.exports = connection