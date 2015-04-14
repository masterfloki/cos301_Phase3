
exports = module.exports = function(database, csds, threads, spaces, notifications, status, resources, reporting, authorization, settings)
{
    var aop = require('node-aop');
    var listOfInterceptorsForAuth = [];
    var listOfInterceptorsForNotify = [];
    var listOfServicesForAuth = [];
    var listOfServicesForNotify = [];

    listOfServicesForNotify.push({domain:threads, service:'submitPost', action: 'submitPost'});
    listOfServicesForNotify.push({domain:threads, service:'moveThread', action: 'moveThread'});
    listOfServicesForNotify.push({domain:threads, service:'closeThread', action: 'closeThread'});
    listOfServicesForNotify.push({domain:threads, service:'hideThread', action: 'closeThread'});
    listOfServicesForNotify.push({domain:status, service:'assignAppraisalToPost', action: 'assignAppraisalToPost'});

    listOfServicesForAuth.push({domain:threads, service:'submitPost'});
    listOfServicesForAuth.push({domain:threads, service:'moveThread'});
    listOfServicesForAuth.push({domain:threads, service:'closeThread'});
    listOfServicesForAuth.push({domain:threads, service:'hideThread'});
    listOfServicesForAuth.push({domain:resources, service:'uploadResource'});
    listOfServicesForAuth.push({domain:resources, service:'removeResource'});
    listOfServicesForAuth.push({domain:resources, service:'addResourceType'});
    listOfServicesForAuth.push({domain:resources, service:'modifyResourceType'});
    listOfServicesForAuth.push({domain:resources, service:'submitPost'});
    listOfServicesForAuth.push({domain:status, service:'assignAppraisalToPost'});
    listOfServicesForAuth.push({domain:status, service:'setStatusCalculator'});
    listOfServicesForAuth.push({domain:status, service:'createAppraisalType'});
    listOfServicesForAuth.push({domain:status, service:'removeAppraisalType'});
    listOfServicesForAuth.push({domain:status, service:'assignAppraisalTypeToBuzzSpace'});
    listOfServicesForAuth.push({domain:spaces, service:'closeBuzzSpace'});
    listOfServicesForAuth.push({domain:spaces, service:'createBuzzSpace'});
    listOfServicesForAuth.push({domain:spaces, service:'assignAdministrator'});
    listOfServicesForAuth.push({domain:spaces, service:'removeAdministrator'});
    listOfServicesForAuth.push({domain:authorization, service:'addAuthorizationRestriction'});
    listOfServicesForAuth.push({domain:authorization, service:'editAuthorizationRestriction'});
    listOfServicesForAuth.push({domain:authorization, service:'removeAuthorizationRestriction'});

    function init()
    {
        for(var i = 0; i < listOfServicesForAuth.length; i++)
        {
            var domain = listOfServicesForAuth[i].domain;
            var service = listOfServicesForAuth[i].service;
            var interceptorName = domain + service;
            listOfInterceptorsForAuth[interceptorName] = aop.before(domain, service, function(){
                //TODO get session and logged in user
                checkIfAuthorizedUser(domain, service);
            });
        }

        for(var i = 0; i < listOfServicesForNotify.length; i++)
        {
            var domain = listOfServicesForNotify[i].domain;
            var service = listOfServicesForNotify[i].service;
            var action = listOfServicesForNotify[i].action;
            var interceptorName = domain + service;
            listOfInterceptorsForNotify[interceptorName] = aop.after(domain, service,function(threadId){
                //TODO get session and logged in user
                notifyUsersAbout(action, threadId);
            });
        }



    };
    init();

    function checkIfAuthorizedUser(domain, service)
    {
        var serviceIdentifier = new authorization.ServiceIdentifier(domain, service);
        var isAuthorisedRequest = new authorization.isAuthorizedRequest('u12118282', serviceIdentifier);
        var isAuthorizedResult = new authorization.Authorization.isAuthorized(isAuthorisedRequest);//talk to ruth thi needs to be changed to just authorization.isAuthorized not 2xauthorization
        if(isAuthorizedResult.isAuthorized === true)
        {
            console.log("Authorized");
        }
        else
        {
            console.log("Not Authorized");
            throw {'status':500,'message':'Unauthorized Access Restricted'};
        }
    };

    function notifyUsersAbout(action, threadId)
    {
        //TODO Maybe uee switch instead? its much more readable.
        if(action === 'moveThread')
        {
            notifications.notifyMovedThread(threadId);
        }
        else if(action === 'submitPost')
        {
            notifications.notifyNewPost(threadId);
        }
        else if(action === 'closeThread')
        {

        }
        else if(action === 'hideThread')
        {
            notifications.notifyDeletedThread(threadId);
        }
        else if(action === 'assignAppraisalToPost')
        {
            notifications.appraisalNotify(threadId);
        }
        //this isnt final still need to get from notifications how their stuff works :/
    };





};

exports['@singleton'] = true;
exports['@require'] = ['buzz-database', 'buzz-csds', 'buzz-threads', 'buzz-spaces', 'buzz-notification', 'buzz-status', 'buzz-resources','buzz-reporting', 'buzz-authentication'];

///**Mock authorization, doesnt do much just some randomness when it comes to authorizing stuff**/

