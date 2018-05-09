// Basic express + handlebars server standup example.

const express = require('express'); // load the express library that was installed by "npm install --save express"
const path = require('path'); // to use local files on the server.  Defaulted in most OS, but not all.
const bodyParser = require("body-parser"); // used to handle parsing out "post" parameters -- extends req with "req.body.foo", where foo is an AJAX variable.
var app = express(); // instance express as "app"
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + "/public")); // make the direcotry with this script + "/public" a static directory that is blindly served.
// Hard set UTF-8 (normal american ASCII encoding)
app.use(function (req, res, next) {
    if (req.is('text/*')) {
        req.text = '';
        req.setEncoding('utf8');
        req.on('data', function (chunk) { req.text += chunk });
        req.on('end', next);
    } else {
        next();
    }
});

// setup handlebars
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' }); // to identify the file  ./views/layouts/main.handlebars as a default layout
app.engine('handlebars', handlebars.engine); // to plumb in handlebars framework.
app.set('view engine', 'handlebars'); // to start the engine handler.

// start listening for connection requests from browsers
app.set('port', process.env.PORT || 3000); // listen on the system environment variable "PORT", or 3000 if undefined
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; Press CTRL-C to terminate.');
});

// Ready to begin routing.
app.get("/", function (req, res) {
    //res.status(200).send("Hello, world"); // this sends status code 200 (ok) to the browser, with string, "Hello world" for rendering.
    // For in-class exercise, comment out above line of code and add your own like the below. 
    res.render('home');
});

app.get("/candidates/AddCandidate/", function (req, res) {
    // Let's show a page for adding a new candidate
    res.render('AddCandidate');
});