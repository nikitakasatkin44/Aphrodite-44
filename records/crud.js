'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('records/example1.pug', {

    });
});

module.exports = router;