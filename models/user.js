const connection = require('../db');
const bcrypt = require('bcrypt');

const userSchema = `CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL
                    )`;
connection.query(userSchema, function(err, results) {
    if (err) throw err;
    console.log("Users table created or already exists");
});

async function findAndValidate(username, password) {
    const rows = await new Promise((resolve) => {
        connection.query('SELECT * FROM users WHERE username=?', [username], function (err, rows) {
            resolve(rows);
        });
    });
    if (rows.length === 0) {
        return false;
    }

    const foundUser = rows[0];
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
}
  
module.exports = {
    findAndValidate: findAndValidate,
    hashPassword: hashPassword
};