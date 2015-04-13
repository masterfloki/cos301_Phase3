/**
 * Normalize a port into a number, string, or false.
 * @param val
 * @returns {string|Number|Boolean}
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

module.exports = function() {
    var settings = require("./settings.json");
    settings.port = normalizePort(settings.port);
    return settings;
};

module.exports['@singleton'] = true;
