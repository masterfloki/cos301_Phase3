/**
 * Normalize a port into a number, string, or false.
 * @param val
 * @returns {string|Number|Boolean}
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

exports = module.exports = function() {
    return {
        "port": normalizePort(process.env.PORT || '3000'),
        "database":"mongodb://45.55.154.156:27017/Buzz",
        "ldap" : ""
    };
};

exports['@singleton'] = true;
