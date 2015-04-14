/**
 * Created by Paul Engelke (13093500) on 2015/04/10.
 * Adapted by Renette Ros for Top-Level Demo.
 */

/**
 * Appends Content routing to router
 * @param router {exports} A Router object
 * @param resources Buzz-Resources Module
 * @param reporting Buzz-Reporting Module
 * @param status Buzz-Status Module
 * @param threads Buzz-Threads Module
 * @returns {exports} The router object with handlers appended
 */
module.exports = function(router, resources, reporting, status, threads){

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

                var object = {};
                object.title = "Constraint Management";
                object.constraints = results;
                res.render('resources-views/file-constraints', object);
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


    router.post('/addPost', function(req, res, next){


    });


    return router;
};
