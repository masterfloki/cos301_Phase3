var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var scribe = require('scribe-js')();
var IoC = require('electrolyte');
var express = require('express');

try {
  global.settings = require("./settings.json");
}
catch(err) {
  console.log("No ./settings.json exist. Loading Default...");
}

var app = express();
module.exports = app;
global.app = app;

IoC.loader(IoC.node( __dirname + "/node_modules"));

var session = require('express-session');
var sessionStore = require('session-file-store')(session);
var secretString = (Math.random() + 1).toString(36).substring(10);

app.use(session({
    store: new sessionStore(),
    secret: secretString,
    rolling: true,
    cookie : { path: '/', httpOnly: true, secure: false, maxAge: 3600000 },
    resave: false,
    saveUninitialized: false
}));

/**
 * Set up the routing, interceptors, settings and commands.
 * .. is used when it lies in the parent directory of the IoC loader
 */
app.interceptor = IoC.create('../interceptor/interceptor.js', app);
app.routes = IoC.create('../routes', app);
app.settings.port = IoC.create('buzz-settings', app).port;
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

// error handlers
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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
