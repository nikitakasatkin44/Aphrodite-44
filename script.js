const padStart = require('pad-start');
const moment = require('moment');

dateNow = moment().format('H:mm:ss MMMM Do YYYY');
padString = padStart(dateNow, 30, ' ');
console.log(padString);