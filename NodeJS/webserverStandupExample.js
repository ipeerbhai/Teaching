// Basic express + handlebars server standup example.

const express = require('express');
const path = require('path');
var app = express();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.static(__dirname + "/public"));
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
const handlebars = require('express-handlebars').create({defaultLayout: 'main'}); // to name ./views/layouts/main.handlebars as rendered
app.engine('handlebars', handlebars.engine); // to plumb in handlebars framework.
app.set('view engine', 'handlebars'); // to start the engine handler.

// start listening
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; Press CTRL-C to terminate.');
});

// Ready to begin routing.
app.get("/", function(req, res){
    res.status(200).send("Hello, world");
});