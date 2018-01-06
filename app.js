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
app.use('/chat', require('./chat/crud'));

function getBooks () {
    return require(`./books/model-${require('./config').get('DATA_BACKEND')}`);
}

function getMessages () {
    return require(`./chat/model-${require('./config').get('DATA_BACKEND')}`);
}

const recordPerPage = 5;

router.get('/', (req, res) => {
    getMessages().list(recordPerPage, req.query.page * recordPerPage || 0, (err, entities, cursor) => {
        if (err) {
            next(err);
            return;
        }

        const page = req.query.page;

        res.render('index.pug', {
            messages: entities,
            nextPageToken: cursor / recordPerPage,
            prevPageToken: page !== '0',
            page: page,
            activeLink: 'books'
        });
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
app.use(function(req, res, next) {
    const err = new Error('Oops!');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

module.exports = app;