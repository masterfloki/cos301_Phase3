
/*var objects = require('./objects.js');
var authorization = require('buzz-authentication');
var aop = require('node-aop');*/

exports = module.exports = function(database, csds, aop, authorization, threads, spaces, notifications, status, resources, settings)
{

    function checkIfAuthorized(domain, service)
    {
        var serviceIdentifier = new authorization.please(settings, database, csds).ServiceIdentifier(domain, service);
        var isAuthorisedRequest = new authorization.please(settings, database, csds).isAuthorizedRequest('u12118282', serviceIdentifier);
        var isAuthorizedResult = authorization.please(settings, database, csds).isAuthorized(isAuthorisedRequest);

        if(isAuthorizedResult.isAuthorized === true)
        {
            console.log("Has authroization");
        }
        else
        {
            console.log("Unathorized action");
            throw {'status':500,'message':'Unauthorized Access Restricted'};
        }
    };



    /**Interceptors for the threads module**/
    aop.before(threads, 'submitPost',function(){
        checkIfAuthorized('thread','submitPost');
    });
    aop.after(threads, 'submitPost',function(){
        //notifications
    });

    aop.before(threads,'moveThread',function(){
        checkIfAuthorized('thread','moveThread');
    });
    aop.after(threads,'moveThread',function(){
        //notification
    });

    aop.before(threads, 'closeThread', function(){
        checkIfAuthorized('thread','closeThread');
    });
    aop.after(threads,'closeThread',function(){
        //notification
    });

    aop.before(threads, 'hideThread', function(){
        checkIfAuthorized('thread','hideThread');
    });
    aop.after(threads,'hideThread',function(){
        //notification, Mrs Vreda said not to notify about deleting threads???
    });

    /**Interceptors for the resource module**/
    aop.before(resources, 'uploadResource',function(){
        checkIfAuthorized('resources','uploadResource');
    });

    aop.before(resources, 'removeResource',function(){
        checkIfAuthorized('resources','removeResource');
    });

    aop.before(resources,'addResourceType',function(){
        checkIfAuthorized('resources','addResourceType');
    });

    aop.before(resources, 'removeResourceType', function(){
        checkIfAuthorized('resources','removeResourceType');
    });

    aop.before(resources, 'modifyResourceType', function(){
        checkIfAuthorized('resources','modifyResourceType');
    });

    /**Interceptors for the status module**/
    aop.before(status, 'assignAppraisalToPost',function(){//do we need authorization to assign an appraisal to a post?
        checkIfAuthorized('status', 'assignAppraisalToPost');
    });
    aop.after(status,'assignAppraisalToPost',function(){
        //notification
    });

    aop.before(status, 'uploadResource', function(){
        checkIfAuthorized('status','uploadResource');
    });

    aop.before(status, 'removeResource', function(){
        checkIfAuthorized('status','removeResource');
    });

    aop.before(status, 'addResourceType', function(){
        checkIfAuthorized('status','addResourceType');
    });

    aop.before(status, 'removeResourceType', function(){
        checkIfAuthorized('status','removeResourceType');
    });

    aop.before(status, 'modifyResourceType', function(){
        checkIfAuthorized('status','modifyResourceType');
    });

    /**Interceptors for the spaces module**/
    aop.before(spaces, 'closeBuzzSpace', function(){
        checkIfAuthorized('spaces','closeBuzzSpace');
    });

    aop.before(spaces, 'createBuzzSpace', function(){
        checkIfAuthorized('spaces','createBuzzSpace');
    });

    aop.before(spaces, 'addResourceType', function(){
        checkIfAuthorized('spaces','addResourceType');
    });

    aop.before(spaces, 'assignAdministrator', function(){
        checkIfAuthorized('spaces','assignAdministrator');
    });

    aop.before(spaces, 'removeAdministrator', function(){
        checkIfAuthorized('spaces','removeAdministrator');
    });

    /**Interceptor for authorization module**/
    aop.before(authorization, 'addAuthorizationRestriction', function(){
        checkIfAuthorized('authorization','addAuthorizationRestriction');
    });

    aop.before(authorization, 'editAuthorizationRestriction', function(){
        checkIfAuthorized('authorization','editAuthorizationRestriction');
    });

    aop.before(authorization, 'removeAuthorizationRestrication', function(){
        checkIfAuthorized('authorization','removeAuthorizationRestrication');
    });



};

exports['@literal'] = false;
exports['@require'] = ['buzz-database', 'buzz-csds', 'node-aop', 'buzz-authentication', 'buzz-threads', 'buzz-spaces', 'buzz-notification', 'buzz-status', 'buzz-resources'];
///**Mock authorization, doesnt do much just some randomness when it comes to authorizing stuff**/

