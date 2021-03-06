'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const moment = require('moment');
const padEnd = require('pad-end');
const path = require('path');
const config = require('./config');
const curPath = __dirname + '/';

const mongoose = require('mongoose');
const passport = require('passport');
require('./config/passport')(passport);
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const configDB = require('./config/database.js');
const bodyParser = require('body-parser');

app.disable('etag');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', true);

// mongoose.connect(config.get('MONGO_URL'));
mongoose.connect(configDB.url);

// app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'abrakadabra' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



router.use(function (req, res, next) {
    console.log(
        padEnd((req.method + " " + req.path), 60, ' ') +
        moment().format('H:mm:ss'));
    next();
});

app.use('/books', require('./books/crud'));
app.use('/records', require('./records/crud'));
app.use('/chat', require('./chat/crud'));

function getBooks () {
    return require(`./books/model-${require('./config').get('DATA_BACKEND')}`);
}

function getMessages () {
    return require(`./chat/model-${require('./config').get('DATA_BACKEND')}`);
}

const recordPerPage = 5;

router.get('/', (req, res) => {

    let user;
    if (isLoggedIn) {
        user = req.user
    } else {
        user = ''
    }



    getMessages().list(recordPerPage, req.query.page * recordPerPage || 0, (err, entities, cursor) => {
        if (err) {
            next(err);
            return;
        }

        const page = req.query.page;

        res.render('index.pug', {
            user: user,
            messages: entities,
            nextPageToken: cursor / recordPerPage,
            prevPageToken: page !== '0',
            page: page,
            activeLink: 'books'
        });
    });
});

router.get('/login', (req, res) => {
    res.render('login.pug', {
        message: req.flash('loginMessage')
    });
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/signup', (req, res) => {
    res.render('signup.pug', {
        message: req.flash('signupMessage')
    });
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.pug', {
        user: req.user
    })
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get("/about", function(req, res) {
    res.sendFile(curPath + "about.html");
});

router.get("/products", function(req, res) {
    res.sendFile(curPath + "products.html");
});

router.get("/store", function(req, res) {
    res.sendFile(curPath + "store.html");
});

router.get("/test", function(req, res) {
    res.render("test.pug", {
    })
});

router.get("/test2", function(req, res) {
    res.render("test2.pug", {
    })
});

app.use("/", router);
app.use(express.static('public'));
// app.use(function(req, res, next) {
//     const err = new Error('Oops!');
//     err.status = 404;
//     next(err);
// });

// app.use(function(err, req, res, next) {
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     res.status(err.status || 500);
//     res.render('error');
// });

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

module.exports = app;