'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

function getModel() {
    return require(`./model-${require('../config').get('DATA_BACKEND')}`);
}

function getMessages () {
    return require(`./model-${require('../config').get('DATA_BACKEND')}`);
}

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use((req, res, next) => {
    res.set('Content-Type', 'text/html');
    next();
});

router.post('/add', (req, res, next) => {
    const data = req.body;
    data['messageTime'] = moment().format('H:mm:ss DD-MM-YYYY');

    getMessages().create(data, (err, savedData) => {
        if (err) {
            console.log('ОШИБКА!!!');
            next(err);
        }

        console.log(savedData.author + ': ' + savedData.message);
        res.redirect('/');
    });
});

module.exports = router;