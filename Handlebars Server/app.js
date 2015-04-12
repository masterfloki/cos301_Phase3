var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var scribe = require('scribe-js')();
var IoC = require('electrolyte');

var express = require('express');

var app = express();
module.exports = app;
global.app = app;

IoC.loader(IoC.node( __dirname + "/node_modules"));

/**
 * Set up the routing, interceptors, settings and commands.
 * .. is used when it lies in the parent directory of the IoC loader
 */
app.interceptor = IoC.create('../interceptor/interceptor.js', app);
app.routes = IoC.create('../routes', app);
//app.settings = IoC.create('buzz-settings', app);
app.commands = IoC.create('buzz-commands', app);

app.use(scribe.express.logger()); //Log each request
app.use('/logs', scribe.webPanel());


var aop = require("node-aop");// Node.js require. Use window.aop in browser
var i18n = new (require('i18n-2'))({
 // setup some locales - other locales default to the first locale
 locales: ['en']
 });



//var connection = IoC.create('database'); //Initial connection to the database

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', app.routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

