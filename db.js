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

module.exports = connection