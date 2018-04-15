var app = require('./server/app');

if (app.locals.sslOptions) {
    var http = require('https');
} else {
    var http = require('http');
}

var port=process.env.PORT || '3000';
app.set('port', port);

if (app.locals.sslOptions) {
    var server = http.createServer(app.locals.sslOptions, app);
} else {
    var server = http.createServer(app);
}

server.listen(port);
console.log('Listening on ' + port);
