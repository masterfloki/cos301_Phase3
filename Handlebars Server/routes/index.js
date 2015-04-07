/**
 * @param database
 * @param resources
 * @param reporting
 * @returns {Router}
 */
module.exports = function(database, resources, reporting) {
    var express = require('express');
    var router = express.Router();
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

    /* GET home page. */
    router.get('/', function (req, res, next) {
    //Pass to page
        getSpaces(function (obj2) {
            var obj = {};
            obj.spaces = obj2;
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

   return  router;

};

module.exports ['@literal'] = false;
module.exports ['@require'] = ['database', 'resources' ,'reporting'];
