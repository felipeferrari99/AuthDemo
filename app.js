const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const connection = require('./db');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded( {extended: true}));
const sessionConfig = {
    secret: 'notagoodsecret',
    resave: false,
    saveUninitialized: true
}
app.use(session(sessionConfig));

const requireLogin = (req, res, next) => {
    if(!req.session.user_id){
        res.redirect('/');
    }
    next();
}

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function (err) {
        if (err) {
            console.log("NOT ALLOWED!!!")
        } else {
            res.redirect('/');
        }
    });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const queryResult = await new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
            resolve(results);
            });
        });
        if (queryResult.length === 0) {
            res.send('Error logging in');
            return;
        }
        const user = queryResult[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            req.session.user_id = user.id;
            res.redirect('/secret');
        } else {
            res.redirect('/');
        }
});

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/');
})

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret')  
})

app.listen(3000, () => {
    console.log("App listening on port 3000");
});