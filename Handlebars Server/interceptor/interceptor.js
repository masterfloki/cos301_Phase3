
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
    //listOfServicesForAuth.push({domain:reporting, service:'testFunction'});

    function init()
    {

        for(var i = 0; i < listOfServicesForNotify.length; i++)
        {
            var domain = listOfServicesForNotify[i].domain;
            var service = listOfServicesForNotify[i].service;
            var action = listOfServicesForNotify[i].action;
            var interceptorName = domain + service;
            listOfInterceptorsForNotify[interceptorName] = aop.before(domain, service,function(objectIntercepted){
                notifyUsersAbout(action, objectIntercepted);
            });
        }
        //note notifications are done on aop.before as it allows me to get the threadId

        for(var i = 0; i < listOfServicesForAuth.length; i++)
        {
            var domain = listOfServicesForAuth[i].domain;
            var service = listOfServicesForAuth[i].service;
            var interceptorName = domain + service;
            listOfInterceptorsForAuth[interceptorName] = aop.before(domain, service, function(objectIntercepted){
                checkIfAuthorizedUser(domain, service, objectIntercepted);
            });
        }
    };
    init();

    function checkIfAuthorizedUser(domain, service, objectIntercepted)
    {
        if(objectIntercepted.userId === undefined)
        {
            console.log("could not authorize")
        }
        else
        {
            var userId = objectIntercepted.userId;
            var serviceIdentifier = new authorization.ServiceIdentifier(domain, service);
            var isAuthorisedRequest = new authorization.isAuthorizedRequest(userId, serviceIdentifier);
            var isAuthorizedResult = new authorization.Authorization.isAuthorized(isAuthorisedRequest);//talk to ruth thi needs to be changed to just authorization.isAuthorized not 2xauthorization
            if(isAuthorizedResult.isAuthorized === true)
            {
                //console.log("Authorized");
            }
            else
            {
                //console.log("Not Authorized");
                throw {'status':401,'message':'Unauthorized Access Restricted'};
            }
        }
    };

    function notifyUsersAbout(action, objectIntercepted)
    {
        if(objectIntercepted.threadId === undefined)
        {
            console.log("could not notify")
        }
        else
        {
            var threadId = {threadId : objectIntercepted.threadId};
            switch(action) {
                case 'moveThread':
                    notifications.notifyMovedThread(threadId);
                    break;
                case 'submitPost':
                    notifications.notifyNewPost(threadId);
                    break;
                case 'closeThread':
                    notifications.notifyDeletedThread(threadId);//notifications say use this for closed threads
                    break;
                case 'hideThread':
                    notifications.notifyDeletedThread(threadId);
                    break;
                case 'assignAppraisalToPost':
                    notifications.appraisalNotify(threadId);
                    break;
                default:
                    break;
            }
        }

    };
};

exports['@literal'] = false;
exports['@singleton'] = true;
exports['@require'] = ['buzz-database', 'buzz-csds', 'buzz-threads', 'buzz-spaces', 'buzz-notification', 'buzz-status', 'buzz-resources','buzz-reporting', 'buzz-authentication'];

///**Mock authorization, doesnt do much just some randomness when it comes to authorizing stuff**/
