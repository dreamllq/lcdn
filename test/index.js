var lcdn = require("../index");

var filepath = '/usr/local/var/www/html/react/build/Test.bundle.js';

lcdn(filepath).then(function (url) {
    console.log(url);
}).catch(function (err) {
    console.log(err);
});

console.log(lcdn.host);