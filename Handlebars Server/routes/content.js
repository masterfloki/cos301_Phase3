/**
 * Created by Paul Engelke (13093500) on 2015/04/10.
 * Adapted by Renette Ros for Top-Level Demo.
 */
var querystring = require('querystring');
/**
 * Appends Content routing to router
 * @param router {exports} A Router object
 * @param resources Buzz-Resources Module
 * @param reporting Buzz-Reporting Module
 * @param status Buzz-Status Module
 * @param threads Buzz-Threads Module
 * @returns {exports} The router object with handlers appended
 */
module.exports = function(router, database, resources, reporting, status, threads){

    var bodyparser = require('body-parser');
    var urlencodedparser = bodyparser.urlencoded({extended:false});


    /**
     * File constrints routing
     */
    router.get('/file-constraints', function(req, res, next){

        resources.getConstraints(function(err, results){
            if (err){
                res.render('error', {
                    message : "No data could be retrieved",
                    error : err
                });
            } else {
                results.forEach(function(con){ // set unit to MB
                   con.size_limit = (con.size_limit/(1024*1024)).toFixed(3);
                });

                var context = {};
                context.title = "Constraint Management";
                context.constraints = results;
                context.message = req.query.message;
                context.messageType = req.query.messageType;
                res.render('resources-views/file-constraints', context);
            }
        });
    });

    //TODO Handle this with Ajax
    router.post('/submitConstraint', urlencodedparser, function(req, res, next){

        resources.addConstraint(req.body["mime-type"], req.body["size-limit"]*req.body['size-unit'], function(success){
            if (!success){

                res.render('error', {
                    message : "Constraint could not be added.",
                    error : {}
                });
            } else {
                res.redirect("/file-constraints");
            }
        });
    });

    router.post('/removeConstraint', urlencodedparser, function(req, res, next){
        resources.removeConstraint(req.body._id, function(success){
            if (!success){
                res.render('error', {
                    message : "Constraint could not be removed.",
                    error : {}
                });
            } else {
                res.redirect("/file-constraints");
            }
        });
    });

    router.get('/manageResources', function(req, res, next){
        res.render('blank');
    });


    router.post('/submitPost', function(req, res, next){


    });

    var mongoose = database.mongoose;
    var spaceSchema = mongoose.Schema({
        moduleID: String,
        isOpen: String,
        academicYear: Number,
        name: String,
        adminUsers : Array
        }, {
        collection: 'spaces'
    });

    var getSpaces = function(callback) {
        var spaceModel = mongoose.model('Reporting-Spaces', spaceSchema);
        spaceModel.find({isOpen: 'true'}, function (err, spaces) {
            if (!err) {
                callback(spaces);
            }
        });
    };

    router.get('/report', function(req, res, next){
        getSpaces(function (spaces) {
            var obj = {};
            obj.spaces = spaces;
            obj.title = 'Reports';
            res.render('./reporting-views/reports', obj);
        })

    });








    router.post('/downloadreport',function(req, res, next){

        var reportType = req.body.reportType;
        switch(reportType)
        {
            case 'subTypeStudent':
                var subTypeStudent = req.body.subTypeStudent;
                reporting.getStudents(res);
                break;
            case 'subTypeLecturers':
                var subTypeLecturers = req.body.subTypeLecturers;
                reporting.getLecturers(res);
                break;
            case 'subTypeThreads':
                var subTypeThreads = req.body.subTypeThreads;
                switch(subTypeThreads)
                {
                    case 'allThreads':
                        reporting.getThreads(res);
                        break;
                    case 'spaceThreads':
                        var course = req.body.spacesSelect;
                        reporting.getThreadsBy(course,res);
                        break;
                    default:
                        break;
                }

                break;
            default:
                break;    
        }




    });

    router.get('/addAppraisalType',function(req, res, next){
        res.render('./status-views/addAppraisalType');
    });

    router.post('/updateConstraint', function(req, res) {

        resources.updateConstraint(req.body["mime-type"], req.body["size-limit"] * req.body['size-unit'], function (success) {
            if (!success) {

                res.redirect('/file-constraint?' + querystring.stringify( {
                    message: "Constraint could not be updated.",
                    error: {}
                }));
            } else {
                res.redirect('file-constraints');
            }
        });

        var renderConstraints = function (res, err, results) {

            if (err) {

                res.render('error', {
                    message: "No data could be retrieved",
                    error: err
                });
            } else {

                results.forEach(function (con) { // set unit to MB
                    con.mb_size = (con.size_limit / (1024 * 1024)).toFixed(3);
                });

                var object = {};
                object.title = "Constraint Management";
                object.constraints = results;
                res.render('content/manageConstraints', object);
            }
        };
    });
            return router;
}
