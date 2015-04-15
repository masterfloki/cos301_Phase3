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
    var express = require('express');

    var mongoose = database.mongoose;

    function getProfile(id) {
        return {title: "user " + id};
    }

    var space = mongoose.Schema({
        space_ID: String,
        space_Name: String,
        space_Description: String
    }, {
        collection: 'Spaces'
    });

    var ThreadSchema = new mongoose.Schema({
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

    function getThreads(id, callback) {
        var threadModel = mongoose.model("Threads_1", ThreadSchema);
        threadModel.find({thread_SpaceID: id}, function (err, threads) {
            if (err) {
            }
            else {
                var newData = {};
                newData.title = id;
                newData.threads = threads;
                callback(newData);
            }
        });
    }

    function getSpaces(callback) {
        var spaceModel = mongoose.model('Spaces_1', space);
        spaceModel.find({}, function (err, spaces) {
            if (err) {

            }
            else {
                callback(spaces);
            }

        });
    }

    /**
     * @type {exports}
     */
    var router = express.Router();

    /* GET home page. */
    router.get('/', function (req, res, next) {
    //Pass to page
        getSpaces(function (spaces) {
            var obj = {};
            obj.spaces = spaces;
            obj.title = "Buzz++@UP";
            //console.log(obj);
            res.render('index', obj);
        })
    });

    router.get('/blank', function (req, res, nect) {
        res.render('blank', {title: "Content Unavailable"});
    });

    router.get('/threads', function (req, res, next) {
        var space = req.query.space;
        getThreads(space, function (obj) {

            // console.log(obj);
            res.render('thread', obj);
        })
    });

    //Eg use get arguments from URL
    router.get('/testing', function (req, res, next) {
        res.render('test', getProfile(req.query.id));
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
