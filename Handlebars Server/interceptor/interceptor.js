
var objects = require('./objects.js');
var authorization = require('buzz-authentication');
var aop = require('node-aop');


///**Mock authorization, doesnt do much just some randomness when it comes to authorizing stuff**/


function checkIfAuthorized(domain, service)
{
    var isAuthorizedResult = objects.authorization.isAuthorized();
    if(isAuthorizedResult.isAuthorized === true)
    {
        console.log("Has authroization");
    }
    else
    {
        console.log("Unathorized action");
        var noAutorization = {'status':500,'message':'Unauthorized Access Restricted'};
        throw noAutorization;
    }
};



/**Interceptors for the threads module**/
aop.before(objects.threads, 'submitPost',function(){
    checkIfAuthorized('thread','submitPost');
});
aop.after(objects.threads, 'submitPost',function(){
    //notifications
});

aop.before(objects.threads,'moveThread',function(){
    checkIfAuthorized('thread','moveThread');
});
aop.after(objects.threads,'moveThread',function(){
    //notification
});

aop.before(objects.threads, 'closeThread', function(){
    checkIfAuthorized('thread','closeThread');
});
aop.after(objects.threads,'closeThread',function(){
    //notification
});

aop.before(objects.threads, 'hideThread', function(){
    checkIfAuthorized('thread','hideThread');
});
aop.after(objects.threads,'hideThread',function(){
    //notification, Mrs Vreda said not to notify about deleting threads???
});

/**Interceptors for the resource module**/
aop.before(objects.resources, 'uploadResource',function(){
    checkIfAuthorized('resources','uploadResource');
});

aop.before(objects.resources, 'removeResource',function(){
    checkIfAuthorized('resources','removeResource');
});

aop.before(objects.resources,'addResourceType',function(){
    checkIfAuthorized('resources','addResourceType');
});

aop.before(objects.resources, 'removeResourceType', function(){
    checkIfAuthorized('resources','removeResourceType');
});

aop.before(objects.resources, 'modifyResourceType', function(){
    checkIfAuthorized('resources','modifyResourceType');
});

/**Interceptors for the status module**/
aop.before(objects.status, 'assignAppraisalToPost',function(){//do we need authorization to assign an appraisal to a post?
    checkIfAuthorized('status', 'assignAppraisalToPost');
});
aop.after(objects.status,'assignAppraisalToPost',function(){
    //notification
});

aop.before(objects.status, 'uploadResource', function(){
    checkIfAuthorized('status','uploadResource');
});

aop.before(objects.status, 'removeResource', function(){
    checkIfAuthorized('status','removeResource');
});

aop.before(objects.status, 'addResourceType', function(){
    checkIfAuthorized('status','addResourceType');
});

aop.before(objects.status, 'removeResourceType', function(){
    checkIfAuthorized('status','removeResourceType');
});

aop.before(objects.status, 'modifyResourceType', function(){
    checkIfAuthorized('status','modifyResourceType');
});

/**Interceptors for the spaces module**/
aop.before(objects.spaces, 'closeBuzzSpace', function(){
    checkIfAuthorized('spaces','closeBuzzSpace');
});

aop.before(objects.spaces, 'createBuzzSpace', function(){
    checkIfAuthorized('spaces','createBuzzSpace');
});

aop.before(objects.spaces, 'addResourceType', function(){
    checkIfAuthorized('spaces','addResourceType');
});

aop.before(objects.spaces, 'assignAdministrator', function(){
    checkIfAuthorized('spaces','assignAdministrator');
});

aop.before(objects.spaces, 'removeAdministrator', function(){
    checkIfAuthorized('spaces','removeAdministrator');
});

/**Interceptor for authorization module**/
aop.before(objects.authorization, 'addAuthorizationRestriction', function(){
    checkIfAuthorized('authorization','addAuthorizationRestriction');
});

aop.before(objects.authorization, 'editAuthorizationRestriction', function(){
    checkIfAuthorized('authorization','editAuthorizationRestriction');
});

aop.before(objects.authorization, 'removeAuthorizationRestrication', function(){
    checkIfAuthorized('authorization','removeAuthorizationRestrication');
});



//
////status.assignAppraisalToPost();
//
////module.exports.status = status;