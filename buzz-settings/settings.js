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

/**
 * @typedef {{address, password}} EmailSettings
 * @typedef {{base, url}} CsdsSettings
 * @typedef {{subjectRegistration, messageRegistration, subjectDeregistration, messageDeregistration, subjectNewPost, messageNewPost, subjectDeletedThread,
    messageDeletedThread, subjectMovedThread, messageMovedThread, subjectNewAppraisal, messageNewAppraisal }} NotificationSettings
 *
 * @typedef {{port : number|String, database : String, killTimeout : Number, email : EmailSettings, csds : CsdsSettings, notification: NotificationSettings}} BuzzSettings
 *
 * @returns {BuzzSettings}
 */
module.exports = function() {
    /**
     * @type {BuzzSettings|exports}
     */
    var settings = require("./settings.json");
    settings.port = normalizePort(settings.port);
    return settings;
};

module.exports['@singleton'] = true;
