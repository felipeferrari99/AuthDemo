const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const User = require('./models/user');
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
        return res.redirect('/');
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
    const hashedPassword = await User.hashPassword(password);
    connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
        res.redirect('/');
    });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.user_id = foundUser.id;
        return res.redirect('/secret');
    } else {
        return res.redirect('/');
    }
});

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/');
})

app.get('/secret', requireLogin, (req, res, next) => {
    res.render('secret')  
})

app.listen(3000, () => {
    console.log("App listening on port 3000");
});