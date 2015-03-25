/**
 * Created by Jaco-Louis on 2015/03/19.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://45.55.154.156:27017/Buzz');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Connection to database was successful.");
});

module.exports.db = db;
module.exports.mongoose = mongoose;