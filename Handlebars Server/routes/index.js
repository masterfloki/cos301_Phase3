/**
 *
 * @param database {BuzzDatabase}
 * @param resources {resources}
 * @param reporting {reporting}
 * @param status {status}
 * @param threads {threads}
 * @param authentication {authentication}
 * @param csds {csds}
 * @param spaces {spaces}
 * @param notification {notification}
 * @returns {exports}
 */
module.exports = function(database, resources, reporting, status, threads, authentication, csds, spaces, notification) {
    /** Register hbs partials ***/
    var hbs = require('hbs');
    var fs = require('fs');

    var registerHbsPartials = function (dir) {
        var filenames = fs.readdirSync(dir);

        filenames.forEach(function (filename) {
            var matches = /^([^.]+).hbs$/.exec(filename);
            if (!matches) {
                return;
            }
            var name = matches[1];
            var template = fs.readFileSync(dir + '/' + filename, 'utf8');
            hbs.registerPartial(name, template);
        });
    };
    registerHbsPartials(__dirname + "/../views/notification-views");

    var mongoose = database.mongoose;
    var express = require('express');
    var router = express.Router();
    var spaceSchema = mongoose.Schema({
        moduleID: String,
        isOpen: String,
        academicYear: Number,
        name: String,
        adminUsers : Array
    }, {
        collection: 'spaces'
    });
    var threadSchema = new mongoose.Schema({
            thread_ID:String,
            thread_DateCreated: Date,
            thread_Name: String,
            thread_PostContent: Array,
            thread_CreatorID: String,
            thread_SpaceID: String,
            thread_StatusID: Array,
            thread_Parent: String,
            thread_Archived: Date,
            thread_Attachments: Array,
            thread_PostType: String,
            thread_Closed: Boolean,
            thread_DateClosed: Date
        },{
            collection: 'Threads'
        });
    var followingThread = new mongoose.Schema({
            notification_ThreadID : String,
            notification_StudentID : String
    }, {
        collection: 'Notifications_Thread'
    });


    /**** Helper functions ****/

    var getThreads = function (id, callback) {
        var threadModel = mongoose.model("Routing-Threads", threadSchema);
        threadModel.find({thread_SpaceID: id}, function (err, threads) {
            if (err) {
            }
            else {
                var newData = {};
                newData.title = id;
                newData.threads = threads;
                var updateCount = 0;
                for (var i=0; i<threads.length; ++i) {

                }


               //$.each(threads, function(key, value) {

              //  });
                callback(newData);
            }
        });
    };
    var getSpaces = function(callback) {
        var spaceModel = mongoose.model('Routing-Spaces', spaceSchema);
        spaceModel.find({isOpen: 'true'}, function (err, spaces) {
            if (!err) {
                callback(spaces);
            }
        });
    };
    global.getSessionUserID = function (req) {
        //TODO in production this should just be teh session part
        if (app.get('env') === 'production') {
            return req.session.userID;
        }
        ;//If not in production se defaulkt value
        var myUid;
        try {
            myUid = req.session.userID | 'u00000000';
        } catch (e) {
            myUid = 'u00000000'
        }
        return myUid;
    };

    router.get('/', function (req, res, next) {
        getSpaces(function (spaces) {
            var obj = {};
            obj.spaces = spaces;
            obj.title = "Buzz++@UP";
            res.render('index', obj);
        })
    });

    router.get('/blank', function (req, res, nect) {
        res.render('blank', {title: "Content Unavailable"});
    });

    router.get('/threads', function (req, res, next) {
        var space = req.query.space;
        getThreads(space, function (threads) {
            res.render('thread', threads);
        })
    });



    /******** Content Routing ****************/

    var contentRouter = require('./content');
    router = contentRouter(router, resources, reporting, status, threads);

    /******** Infrastructure Routing **********/

    var infrastructure = require('./infrastructure');
    router = infrastructure(router, database, authentication, csds, spaces, notification);


   return  router;

};

module.exports ['@singleton'] = true;
module.exports ['@require'] = ['buzz-database',
    'buzz-resources' ,'buzz-reporting', 'buzz-status', 'buzz-threads',
    'buzz-authentication', 'buzz-csds', 'buzz-spaces', 'buzz-notification'];
