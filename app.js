const express = require('express');
const app = express();
const router = express.Router();
const moment = require('moment');
const padEnd = require('pad-end');
const path = __dirname + '/';

router.use(function (req, res, next) {
    console.log(
        padEnd((req.method + " " + req.path), 60, ' ') +
        moment().format('H:mm:ss'));
    next();
});

router.get("/", function(req, res) {
    res.sendFile(path + "index.html");
});

router.get("/about", function(req, res) {
    res.sendFile(path + "about.html");
});

router.get("/products", function(req, res) {
    res.sendFile(path + "products.html");
});

router.get("/store", function(req, res) {
    res.sendFile(path + "store.html");
});

app.use("/", router);
app.use(express.static('public'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});