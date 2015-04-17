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
var qstring = require('querystring');
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
        var context = {title:"Add Appraisal"};
        context.message = req.query.message;
        context.messageType = req.query.messageType;
        res.render('./status-views/addAppraisalType', context);
    });
	
	
	router.post('/submitAppraisal',function(req, res, next){
		var appraisalName = req.body.appraisal_name;
		var appraisalDescription = req.body.appraisal_description;
        var appraisalLevels = [];
		for(i = 1; true; i++)
        {
            var nameLevel = "appraisal_name_level_" + i.toString();
            var ratingLevel = "appraisal_reporting_level_" + i.toString();
            if(req.body[nameLevel] === undefined)
            {
                break;
            }
            //console.log('this is it: ' + req.body[nameLevel]);
            var appraisalLevel = new status.AppraisalLevel(nameLevel, ratingLevel, "null");
            //appraisalLevel.name = nameLevel;
            appraisalLevels.push(appraisalLevel);
        }
        var appraisalType = new status.AppraisalType(appraisalName, appraisalDescription, "null", appraisalLevels);

        var randomObject = {};
        randomObject.appraisalType = appraisalType;
        function checkIfSuccess(obj)
        {
            //console.log(obj.appraisalTypeID + " this is the id");
            if(obj.appraisalTypeID !== undefined)
            {
                res.redirect("/addAppraisalType?"+ qstring.stringify({message:"Appraisal Added", messageType:"success"}));
            }
            else
            {
                res.redirect("/addAppraisalType?"+ qstring.stringify({message:"Appraisal Added", messageType:"danger"}));
            }

        };

        status.createAppraisalType(randomObject, checkIfSuccess);
		
		//console.log(req.body);

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
