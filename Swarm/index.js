// This example is about how to upload/download images from swarm using the SWARM http api.

const express = require('express'); // load the express library that was installed by "npm install --save express"
const path = require('path'); // to use local files on the server.  Defaulted in most OS, but not all.
const fs = require('fs');
const bodyParser = require("body-parser"); // used to handle parsing out "post" parameters -- extends req with "req.body.foo", where foo is an AJAX variable.
const multer = require('multer');
const upload = multer({ dest: '/home/imran/tmp' }); // WARNING -- need to set a directory to upload to.
const axios = require('axios'); // a REST helper that simplifies making HTTP(s) REST callouts
const app = express(); // instance express as "app"
let swarm = require("swarm-js").at("http://localhost:8500"); // This is super difficult and buggy, but is the official JS api.
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

app.post('/v1/uploadFile', upload.single('file'), function (req, res, next) {
    // multer has already uploaded the file via the upload.single param and placed metadata into req.file
    // we can now safely read it.

    let fileObject = req.file;
    //swarm.upload(fileObject.path).then(hash => res.send(hash)); // this stopped working, do it the hard way.
    fs.readFile(fileObject.path, (err, data) => {
        // prep a post with the data and send to the BZZ endpoint.
        let axiosOptions = {
            url: 'http://127.0.0.1:8500/bzz:/',
            method: 'post',
            headers: { 'Content-Type': fileObject.mimetype },
            data: data
        };
        axios(axiosOptions).then(result => {
            // result is a response itself
            if (result.status == 200) {
                res.send(result.data)
            }
            else {
                res.send(500, "The bees could not find their hive.")
            }
        }).catch(err => {
            res.send(err)
        });
    });
});

app.post('/v1/getFile', function (req, res) {
    let fileHash = req.body.fileHash;

    // the Swarm http interface can tell you a lot.  If you replace bzz:/hash
    // with bzz-raw, you can get the mimetype and metadata.


    // use axios and request the filehash, return the data stream as base64 encoded.
    let axiosOptions = {
        url: 'http://127.0.0.1:8500/bzz:/' + fileHash + '/',
        method: 'get',
        responseType: 'arraybuffer'
    };
    axios(axiosOptions).then(result => {
        let base64Data = new Buffer(result.data, 'binary').toString('base64');
        res.send(base64Data);
    });
});
