var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fs = require('fs');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes');
var app = express();

app.locals.sslOptions = {
    key: fs.readFileSync('keys/comp2406-test-key.pem'),
    cert: fs.readFileSync('keys/comp2406-test-cert.pem')
};

app.set('views', 'views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'superSekretHere!',
                 resave: false,
                 saveUninitialized: false,
                 store: new MongoStore(
                     {url: 'mongodb://localhost/upload-demo'})}));

app.use(express.static('public'));
app.use('/', routes);

module.exports = app;
