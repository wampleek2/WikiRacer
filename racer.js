const WikiRacer = require('./WikiRacer')

const myArgs = process.argv.slice(2);
var start = myArgs[0];
var end = myArgs[1];

var racer = new WikiRacer();
racer
    .race(start, end)
    .then((path) => {
        console.log('Path is ' + path)
    });


