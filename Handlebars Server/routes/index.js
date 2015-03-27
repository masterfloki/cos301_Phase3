var express = require('express');
var router = express.Router();

var bodyparser = require('body-parser');
var urlencodedparser = bodyparser.urlencoded({extended:false});
var resources = require('resources');
var reports = require('reporting');
var formidable = require('formidable');
var database = require('database');
var mongoose = database.mongoose;

function getProfile (id) {
    return {title: "user " + id};
}

var space = mongoose.Schema({
    space_ID : String,
    space_Name: String,
    space_Description : String
}, {
    collection:'Spaces'
});

var ThreadSchema = new mongoose.Schema
(
    {
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
    },
    {
        collection: 'Threads'
    }
);

function getThreads(id, callback)
{
    var threadModel = mongoose.model("Threads_1", ThreadSchema);
    threadModel.find({thread_SpaceID:id},function(err, threads){
        if(err) {
        }
        else
        {
            var newData = {};
            newData.title = id;
            newData.threads = threads;
            callback(newData);
        }
    });
}

function getSpaces(callback) {
   var spaceModel = mongoose.model('Spaces_1',space);
    spaceModel.find({}, function(err, spaces){
        if(err)
        {

        }
        else
        {
            callback(spaces);
        }

    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
//Pass to page
 getSpaces(function(obj2) {
     var obj = {};
     obj.spaces = obj2;
     obj.title = "Buzz++@UP";
     //console.log(obj);
     res.render('index', obj);
 })
});

router.get('/blank', function(req, res, nect) {
    res.render('blank', {title:"Content Unavailable"});
})

router.get('/threads', function(req, res, next) {
    var space = req.query.space;
    getThreads(space, function(obj) {

       // console.log(obj);
        res.render('thread', obj);
    })
});


//Eg use get arguments from URL
router.get('/testing', function(req, res, next) {
//Pass to page
  res.render('test', getProfile(req.query.id));
});

//************************ CONTENT ****************************//

// loads test page for DEMO
router.get('/testPost', function(req, res, next){

    res.render('dynamic_views/postInput', {
        success : ""
    });
});

// loads manage constraints page for DEMO
router.get('/manageConstraints', function(req, res, next){
    resources.getConstraints(function(err, results){
        if (err){
            var html = "<p>Could not retrieve requested information from the database.</p>"
        } else {
            html = "<table><tr><td>Mime Type</td><td>File Size Limit</td></tr>\r\n";
            results.forEach(function(con){
                html += "<tr><td>"+con.mime_type+
                "</td><td>"+Math.round(con.size_limit/(1024*1024))+
                " MB</td><td><a href='/removeConstraint/"+con._id+"'>remove</a></td></tr>\r\n";
            });
            html += "</table>";
            res.render('dynamic_views/constraintsManagement', { results:  html});
        }
    });
});

// add constraint page for DEMO
router.get('/addConstraint', function(req, res, next){

    res.render('dynamic_views/addConstraint', {
        success : ""
    });
});

// remove constraint from database
router.get('/removeConstraint/*', function(req, res, next){

    var id = req.url.replace('/removeConstraint/', "");
    resources.removeConstraint(id, function(truth){
        if (!truth){
                res.render('dynamic_views/constraintsManagement', {
                    results: "An error occurred!"
                });
        } else {
            resources.getConstraints(function(err, results){
                if (err){
                    var html = "<p>Could not retrieve requested information from the database.</p>";
                } else {
                    html = "<table><tr><td>Mime Type</td><td>File Size Limit</td></tr>\r\n";
                    results.forEach(function(con){
                        html += "<tr><td>"+con.mime_type+
                        "</td><td>"+Math.round(con.size_limit/(1024*1024))+
                        " MB</td><td><a href='/removeConstraint/"+con._id+"'>remove</a></td></tr>\r\n";
                    });
                    html += "</table>";
                    res.render('dynamic_views/constraintsManagement', { results:  html});
                }
            });
        }
    });
});

// adds a new constraint (for DEMO)
router.post('/submitConstraint', urlencodedparser, function(req, res, next){
    resources.addConstraint(req.body.mime_type, req.body.size_limit, function(truth){
        if (!truth){
            res.render('dynamic_views/constraintsManagement', {
                results: "An error occurred!"
            });
        } else {
            resources.getConstraints(function(err, results){
                if (err){
                    var html = "<p>Could not retrieve requested information from the database.</p>"
                } else {
                    html = "<table><tr><td>Mime Type</td><td>File Size Limit</td></tr>\r\n";
                    results.forEach(function(con){
                        html += "<tr><td>"+con.mime_type+
                        "</td><td>"+Math.round(con.size_limit/(1024*1024))+
                        " MB</td><td><a href='/removeConstraint/"+con._id+"'>remove</a></td></tr>\r\n";
                    });
                    html += "</table>";
                    res.render('dynamic_views/constraintsManagement', { results:  html});
                }
            });
        }
    });
});

// upload a new file (for DEMO)
router.post('/submitPost', [ function(req, res, next){

    //var form = new formidable.IncomingForm();
    //
    //form.parse(req, function(err, fields, files){
    //
    //    // create post object
    //    var id = 0; // get postID
        resources.uploadFile(req, res, next, 0);
    //});
}, function(req, res, next){
    res.render('dynamic_views/postInput', {
        success : res.fileState
    });
}]);


//****************** INFRASTRUCURE *******************************//


module.exports = router;
