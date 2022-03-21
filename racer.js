const WikiRacer = require('./WikiRacer');
const WikiNode = require('./WikiNode');


const myArgs = process.argv.slice(2);
var start = myArgs[0];
var end = myArgs[1];

var racer = new WikiRacer(start, end);

racer
    .race(start, end)
    .then((path) => {
        if(path) {
            console.log('Path is ' + path.join(" > "));
        } else {
            console.log("Unable to find a path.")
        }
    });

// var test = async function () {
//     await racer.expandTarget();
//     var path = racer.findPath("chess");
//     console.log("Found path: " + path);
// }
// test();





