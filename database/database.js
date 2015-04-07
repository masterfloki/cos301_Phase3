var mongoose = require('mongoose');

exports = module.exports = function(settings) {
    mongoose.connect(settings.database);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log("Connection to database was successful.");
    });

    var exports = {};
    exports.db = db;
    exports.mongoose = mongoose;

    return exports;
};

//exports['@singleton'] = true;
exports['@require'] = ['settings'];
