const request = require('request');
const url = 'http://www.google.com';
const url2 = 'http://localhost:8080/books';

request(url2, function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
});