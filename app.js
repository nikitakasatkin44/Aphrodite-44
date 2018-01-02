'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const moment = require('moment');
const padEnd = require('pad-end');
const path = require('path');
const config = require('./config');
const curPath = __dirname + '/';

app.disable('etag');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', true);

router.use(function (req, res, next) {
    console.log(
        padEnd((req.method + " " + req.path), 60, ' ') +
        moment().format('H:mm:ss'));
    next();
});

app.use('/books', require('./books/crud'));
app.use('/records', require('./records/crud'));

router.get('/', (req, res) => {
    res.render('index.pug', {
        activeLink: 'home'
    });
});

router.get('/test', (req, res) => {
    res.render('test.pug', {

    });
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

app.use("/", router);
app.use(express.static('public'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

module.exports = app;