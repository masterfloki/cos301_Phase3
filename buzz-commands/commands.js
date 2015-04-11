/**
 * Created by Renette on 2015-04-11.
 */

module.exports = function(settings, database) {
    var chalk = require("chalk");
    var commandList = {
        'commands' : {
            'description': 'Lists all available commands.',
            'action': function () {
                console.log(chalk.yellow.bold("Available server commands: "));
                for (var key in commandList) {
                    if (commandList.hasOwnProperty(key))
                        console.log(chalk.yellow('\t',chalk.bold('%s'),': %s'), key, commandList[key]['description']);
                }
            }
        },
        'stop' : {
            'description' : 'Stops server and closes all active connections.',
            'action' : function () {
                /**
                 * App is a
                 * @type {express}
                 */
                var app = global.app;
                if (!app.server) {
                    console.log('Server not fully initialized.')
                } else {
                    console.log('Server is being stopped.');

                    database.mongoose.disconnect(function () {
                        console.log('Database disconnected');
                        app.server.close(function () {
                            console.log('Server stopped');
                            process.exit(0);
                        });
                        setTimeout(function () {
                            console.log('Process will now be forcibly killed.');
                            process.exit(1);
                        }, settings.killTimeout);

                    });
                }
            }

        }
    };

    var stdin = process.stdin;
    stdin.resume();
    /**
     * Listen for commands from terminal.
     */
    stdin.on('data', function (chunk) {
        var line = chunk.toString();
        line.replace(/\n/, '\\n');
        line = line.trim();

        try {
            commandList[line]['action']();
        } catch (e) {
            console.log('Unknown command: ' + line);
        }
    }).on('end', function () { // called when stdin closes (via ^D)
        console.log('stdin:closed');
    });

   commandList['commands']['action']();
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['buzz-settings', 'buzz-database'];