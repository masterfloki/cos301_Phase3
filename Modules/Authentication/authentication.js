var Authorization;

Authorization = function () {//Authorization class

};


Authorization.prototype.updateAuthorisationRestriction=function(userId)//The  updateAuthorisationRestriction function
{
    if (!isAuthorized(userId))
    {
        return new Error("Not Authorized");
    }
    else
    {

        if(!isAuthorized(isAuthreq))
        {
            throw new Error('NotAuthorizeddException');
        }
        else
        {
            var Db = require('mongodb').Db,
                MongoClient = require('mongodb').MongoClient,
                Server = require('mongodb').Server,
                assert = require('assert');


            var db = new Db('authorization', new Server('localhost', 27017));
            // Establish connection to db
            db.open(function (err, db) {
                // Get a collection
                db.collection('Authentication', function (err, collection) {

                    // Update the document with an atomic operator
                    collection.update({_id: UpdateAuthReq.getAuthorizationRestriction().getServiceRestriction().getServiceRestrictionServiceIdentifier().getServiceIdentifierMethodName()}, {$set: {Ranking: UpdateAuthReq.getAuthorizationRestriction().getServiceRestriction().getServiceRestrictionMinimumStatusPoints()}});

                    // Wait for a second then fetch the document
                    setTimeout(function () {

                        // Fetch the document that we modified
                        collection.findOne({_id: (UpdateAuthReq.getAuthorizationRestriction().getServiceRestriction().getServiceRestrictionServiceIdentifier().getServiceIdentifierMethodName())}, function (err, item) {
                            assert.equal(null, err);
                            assert.equal(UpdateAuthReq.getAuthorizationRestriction().getServiceRestriction().getServiceRestrictionServiceIdentifier().getServiceIdentifierMethodName(), item._id);
                            assert.equal(UpdateAuthReq.getAuthorizationRestriction().getServiceRestriction().getServiceRestrictionMinimumStatusPoints(), item.Ranking);
                            db.close();
                        });
                    }, 1000);
                })
            });
        }
    }
};


///////////////////////////////Update Authorisation restriction request class and functions///////////////////////////////////////////////////
var UpdateAuthorizationRestrictionRequest;
UpdateAuthorizationRestrictionRequest=function(userID,AuthorizationRestriction)
{
    this.userID = userID;
    this.AuthorizationRestriction=AuthorizationRestriction;
};

UpdateAuthorizationRestrictionRequest.prototype.getUserID=function()
{
    return this.userID;
};

UpdateAuthorizationRestrictionRequest.prototype.setUserID=function(userID)
{
    this.userID=userID;
};

UpdateAuthorizationRestrictionRequest.prototype.setAuthorizationRestriction=function(AuthorizationRestriction)
{
    this.AuthorizationRestriction=AuthorizationRestriction;
};

UpdateAuthorizationRestrictionRequest.prototype.getAuthorizationRestriction=function()
{
    return this.AuthorizationRestriction;
};
///////////////////////////////End of Update Authorisation restriction request class and functions///////////////////////////////////////////////////


///////////////////////////////Update Authorisation restriction request class and functions///////////////////////////////////////////////////
UpdateAuthorizationRestrictionRequest=function(userID,AuthorizationRestriction) {
    this.userID = userID;
    this.AuthorizationRestriction=AuthorizationRestriction;
};

UpdateAuthorizationRestrictionRequest.prototype.getUserID=function()
{
    return this.userID;
};

UpdateAuthorizationRestrictionRequest.prototype.setUserID=function(userID)
{
    this.userID=userID;
};

UpdateAuthorizationRestrictionRequest.prototype.setAuthorizationRestriction=function(AuthorizationRestriction)
{
    this.AuthorizationRestriction=AuthorizationRestriction;
};

UpdateAuthorizationRestrictionRequest.prototype.getAuthorizationRestriction=function()
{
    return this.AuthorizationRestriction;
};

//////////////////////////////////End of Update Authorisation restriction request class and functions///////////////////////////////////////////////////////
///////////////////////////////Update Authorisation restriction result class and functions///////////////////////////////////////////////////
var UpdateAuthorizationRestrictionsResult=function()
{
    var  AuthorizationRestriction;
};
///////////////////////////////End of Update Authorisation restriction request class and functions///////////////////////////////////////////////////


Authorization.prototype.removeAuthorisationRestriction=function(RemoveAuthorizationReq)//The  removeAuthorisationRestriction function
{
    //var isAuthRequest=new IsAuthorisedRequest();
    var isAuthResult=new IsAuthorisedResult();
    if(isAuthResult(RemoveAuthorizationReq)){
        RemoveAuthorizationReq.getAuthorizationRestriction().getServiceRestriction().setServiceRestrictionStatusPoints(0);
        var uRestriction = new Authorization();
        uRestriction.updateAuthorisationRestriction(RemoveAuthorizationReq);
    }
    return new RemoveAuthorizationRestrictionsResult();
    // the spec says that there is no need to return anything for remove
};
///////////////////////////////RemoveAuthorisationRestrictionResult class and functions//////////////////////////
var RemoveAuthorizationRestrictionsResult;
RemoveAuthorizationRestrictionsResult = function () {
    var AuthorizationRestriction;
};
//////////////////////End of RemoveAuthorisationRestrictionResult class and functions//////////////////////////

//////////////////////////////RemoveAuthorisationRestrictionRequest class and functions//////////////////////////////////////////

var RemoveAuthorizationRestrictionRequest;
RemoveAuthorizationRestrictionRequest=function(userID,_AuthorizationRestriction)
{
    var userID;
    this.userID = userID;
    var AuthorizationRestriction;
    this.AuthorizationRestriction=_AuthorizationRestriction;
};

RemoveAuthorizationRestrictionRequest.prototype.getUserID=function()
{
    return this.userID;
};

RemoveAuthorizationRestrictionRequest.prototype.setUserID=function(_userID)
{
    this.userID=_userID;
};

RemoveAuthorizationRestrictionRequest.prototype.setAuthorizationRestriction=function(_AuthorizationRestriction)
{
    this.AuthorizationRestriction=_AuthorizationRestriction;
};
RemoveAuthorizationRestrictionRequest.prototype.getAuthorizationRestriction=function()
{
    return this.AuthorizationRestriction;
};

///////////////////////////////End of RemoveAuthorisationRestriction request class and functions///////////////////////////////////////////////

//////////////////////////////AddAuthorizationRestrictionRequest class and functions////////////////////////////////////

var AddAuthorizationRestrictionRequest;
AddAuthorizationRestrictionRequest = function()
{
    var AuthorizationRestriction;
    this.AuthorizationRestriction=_AuthorizationRestriction;
}

AddAuthorizationRestrictionRequest.prototype.setAuthorizationRestriction=function(_AuthorizationRestriction)
{
    this.AuthorizationRestriction=_AuthorizationRestriction;
};

AddAuthorizationRestrictionRequest.prototype.getAuthorizationRestriction=function()
{
    return this.AuthorizationRestriction;
};
//////////////////////////////End of AddAuthorizationRestrictionRequest class and functions/////////////////////////////
//////////////////////////////AddAuthorisationRestriction class and functions///////////////////////////////////////////
Authorization.prototype.addAuthorisationRestriction=function(AddAuthorizationReq)
{
    var isAuthResult = new IsAuthorisedResult();
    if(isAuthResult(AddAuthorizationReq)){
        var auth = new Authorization;
        auth.updateAuthorisationRestriction(AddAuthorizationReq);
    }
    return new AddAuthorizationRestrictionsResult();
};

///////////////////////////////End of AddAuthorisationRestriction class and functions///////////////////////////////////
///////////////////////////////AddAuthorisationRestrictionResult class and functions////////////////////////////////////
var AddAuthorizationRestrictionsResult;
AddAuthorizationRestrictionsResult = function ()
{
    var AuthorizationRestriction;
};
//////////////////////End of AddAuthorisationRestrictionResult class and functions//////////////////////////

///////////////////////////////Authorisation restriction class and functions///////////////////////////////////////////////////
var AuthorizationRestriction=function(serviceRestriction)//used by everyone
{
    var ServiceRestriction;
    this.ServiceRestriction=serviceRestriction;
};
AuthorizationRestriction.prototype.setServiceRestriction=function(ServiceRestriction)

{
    this.ServiceRestriction=ServiceRestriction;
};
AuthorizationRestriction.prototype.getServiceRestriction=function()
{
    return this.ServiceRestriction;
};

{
    this.ServiceRestriction=ServiceRestriction;
};
AuthorizationRestriction.prototype.getServiceRestriction=function()
{
    return this.ServiceRestriction;
};
///////////////////////////////End of Authorisation restriction class and functions///////////////////////////////////////////////////
///////////////////////////////Service restriction class and functions///////////////////////////////////////////////////
var ServiceRestriction=function(minimumStatusPoints,serviceIdentifier)//used by everyone
{
    var minimumStatusPoints;
    this.minimumStatusPoints=minimumStatusPoints;
    var ServiceIdentifier;
    this.ServiceIdentifier=serviceIdentifier;
};
ServiceRestriction.prototype.setServiceRestrictionStatusPoints=function(minimumStatusPoints)
{
    this.minimumStatusPoints=minimumStatusPoints;
};
ServiceRestriction.prototype.setServiceRestrictionStatusPoints=function(minimumStatusPoints)
{
    this.minimumStatusPoints=minimumStatusPoints;
};

ServiceRestriction.prototype.setServiceRestrictionServiceIdentifier=function(serviceIdentifier)
{
    this.ServiceIdentifier=serviceIdentifier;
};

ServiceRestriction.prototype.getServiceRestrictionMinimumStatusPoints=function() {
    return this.minimumStatusPoints;
};
ServiceRestriction.prototype.getServiceRestrictionServiceIdentifier=function() {
    return this.ServiceIdentifier;
};
///////////////////////////////End of Service restriction class and functions///////////////////////////////////////////////////
///////////////////////////////Service Identifier class and functions///////////////////////////////////////////////////
var ServiceIdentifier=function(fullyQualifiedInterfaceName,methodName)//used by everyone
{
    var fullyQualifiedInterfaceName;
    var methodName;
    this.fullyQualifiedInterfaceName=fullyQualifiedInterfaceName;
    this.methodName=methodName;
};
ServiceIdentifier.prototype.setServiceIdentifierMethodName=function(methodName)
{
    this.methodName=methodName;
};
ServiceIdentifier.prototype.setServiceIdentifierInterfaceName=function(fullyQualifiedInterfaceName)
{
    this.fullyQualifiedInterfaceName=fullyQualifiedInterfaceName;
};
ServiceIdentifier.prototype.getServiceIdentifierMethodName=function()
{
    return this.methodName;
};
ServiceIdentifier.prototype.getServiceIdentifierInterfaceName=function()
{
    return this.fullyQualifiedInterfaceName;
};
///////////////////////////////End of Service Identifier class and functions//////////////////////////////////////////////////

////////////////////////////test////////////////////////////////////
var sIdentifier=new ServiceIdentifier("Authorization","updateAuthorisationRestriction");
var serviceRestriction=new ServiceRestriction(2,sIdentifier);
var authRestriction=new AuthorizationRestriction(serviceRestriction);
var updateAuth=new UpdateAuthorizationRestrictionRequest("u12118282",authRestriction);
var auth=new Authorization;
auth.updateAuthorisationRestriction(updateAuth);
/////////////////////////test end//////////////////////////////////

////////////////////////////test add////////////////////////////////////
var sIdentifier=new ServiceIdentifier("Authorization","addAuthorisationRestriction");
var serviceRestriction=new ServiceRestriction(4,sIdentifier);
var authRestriction=new AuthorizationRestriction(serviceRestriction);
var addAuth=new AddAuthorizationRestrictionRequest("u13397134",authRestriction);
var auth=new Authorization;
auth.addAuthorisationRestriction(addAuth);
/////////////////////////test add end//////////////////////////////////

////////////////////////////test remove////////////////////////////////////
var rSIdentifier =new ServiceIdentifier("Authorization","removeAuthorisationRestriction");
var rServiceRestriction =new ServiceRestriction(5,rSIdentifier);
var rAuthRestriction;
rAuthRestriction = new AuthorizationRestriction(rServiceRestriction);
var removeAuth;
removeAuth = new RemoveAuthorizationRestrictionRequest("u12230830", authRestriction);
var rAuth;
rAuth = new Authorization;
rAuth.removeAuthorisationRestriction(removeAuth);
/////////////////////////test remove end//////////////////////////////////





//**************************getAuthorizationRestriction***************************//
Authorization.prototype.getAuthorizationRestriction = function(userId)
{
    //this holds the returned (cursor) object which is going to be decoded to get the rest of the information.
    var getAuthorizationRequestResult;

    MongoClient.connect("mongodb://45.55.154.156:27017/Buzz", function(err, db)
    {
        var collection = db.collection('Authorization');

        if(err)
        {
            console.log("Error occured could not connect to the database");
        }
        else
        {
            console.log("Connection success...");

            var results = collection.findOne({ methodName:closeThread}, function(err, item)
            {
                if(!err)
                {
                    /*
                     * Check if item is null if yes set boolisAuthorized to false.
                     */
                    if(item != null)
                    {
                        console.log(results);
                        getAuthorizationRequestResult = results;
                    }
                    else
                    {
                        console.log('No such restriction in data base');
                    }

                }
            });

        }
        console.log('got it '+ getAuthorizationRequestResult);


    });
    return getAuthorizationRequestResult;
}
//***********************************end************************************//


/*
 * class buzzAuthorization has a function prototype called isAuthorized.
 */
//#START isAuthorized
buzzAuthorization = function(){

};


/*
 * ServiceIdentifier inherits from buzzAuthorization
 * It has two virables:
 * 	- fullyQualifiedInterfaceName:String
 * 	- methodName: String
 */

buzzAuthorization.prototype.ServiceIdentifier = function()
{
    var fullyQualifiedInterfaceName;
    var methodName;
};

/*
 * isAuthorizedRequest inherits from buzzAuthorization has one virable and two objects:
 * 	- userId: variable
 *	- serviceIdentifierOject: ServiceIdentifier
 *	- contextInfo: Map from generic
 */
buzzAuthorization.prototype.isAuthorizedRequest = function()
{
    var userId;
    var serviceIdentifierOject = new ServiceIdentifier();
    //var contextInfo = new Map();
};






/*
 * BuzzAuthorization connects to the database compares status points from status and returns true if
 * the status point in Buzz is less than that retrieved from status false otherwise.
 */

function isAuthorized(userId)
{
    if(userId != null)
    {
        /*
         * test weather the request is null before doing anything.
         */
        var getStatusProfilevalue;
        /*
         * @Charles please enter code to get methodName
         */
        var request  = new isAuthorizedRequest();
        var AuthorizationRestrictionsMethodName = request.serviceIdentifierObject.getServiceIdentifierMethodName();
        var MongoClient = require('mongodb').MongoClient;



        MongoClient.connect("mongodb://45.55.154.156:27017/Buzz", function(err, db)
        {
            var collection = db.collection('Authorization');
            var boolisAuthorized = false;
            /*
             * Check if there is a connection error if not, find the ranking depending on it
             * set boolisAuthorized to true else false, else if the is an error set boolisAuthorized to false.
             */
            if(err)
            {
                boolisAuthorized = false;
                console.log("Error occured could not connect to the database");
            }
            else
            {
                console.log("Connection success...");

                var results = collection.findOne({ methodName:AuthorizationRestrictionsMethodName}, function(err, item)
                {
                    if(!err)
                    {
                        /*
                         * Check if item is null if yes set boolisAuthorized to false.
                         */
                        if(item != null)
                        {

                            var point = parseInt(item.StatusPoints)

                            /*
                             * call getStatusForProfile from status and parse in the isAuthorizedRequest as a parameter
                             * it is a userId.
                             */
                            getStatusProfilevalue = new getStatusForProfile(userId);

                            if((getStatusProfilevalue > point))
                            {
                                boolisAuthorized = true;
                            }
                            else
                            {
                                boolisAuthorized = false;
                            }
                        }
                        else
                        {
                            boolisAuthorized = false;
                        }

                    }
                });



            }

            return boolisAuthorized;
        });
    }
    return false;
}



//#END isAuthorized -----------------------

/*method name and user id <auth>request*/
function serviceIdentifierIsAuth(userid, fullyQualifiedInterfaceName, methodName)
{
    //construct json object
    var isAuthorizedRequest = {
        userId: userid,
        fullyQualifiedInterfaceName: fullyQualifiedInterfaceName,
        methodName: methodName
    };
    isAuthorizedRequest.write(JSON.stringify(isAuthorizedRequest));

    return isAuthorizedRequest;


}

function GetAuthorizationRestrictionsRequest(userid, fullyQualifiedInterfaceName, methodName)
{
    //construct json object
    var getAuthorizationRequest = {
        userId: userid,
        fullyQualifiedInterfaceName: fullyQualifiedInterfaceName,
        methodName: methodName
    };
    getAuthorizationRequest.write(JSON.stringify(getAuthorizationRequest));

    return isAuthorizedRequest;


}

function GetAuthorizationRestrictionsResult(userid, fullyQualifiedInterfaceName, methodName)
{
    //construct json object
    var getAuthorizationResult = {
        userId: userid,
        fullyQualifiedInterfaceName: fullyQualifiedInterfaceName,
        methodName: methodName
    };
    getAuthorizationResult.write(JSON.stringify(getAuthorizationResult));

    return getAuthorizationResult;


}

//For some user and some domain with a particular method, request a restriction
function AddAuthorizationRestrictionsRequest(userid, fullyQualifiedInterfaceName, methodName)
{
    //construct json object
    var addAuthorizationRequest = {
        userId: userid,
        fullyQualifiedInterfaceName: fullyQualifiedInterfaceName,
        methodName: methodName
    };
    addAuthorizationRequest.write(JSON.stringify(addAuthorizationRequest));

    return addAuthorizationRequest;


}

//For some user and some domain with a particular method, add a restriction
function AddAuthorizationRestrictionsResult(userid, fullyQualifiedInterfaceName, methodName)
{
    //construct json object
    var addAuthorizationResult = {
        userId: userid,
        fullyQualifiedInterfaceName: fullyQualifiedInterfaceName,
        methodName: methodName
    };
    addAuthorizationResult.write(JSON.stringify(addAuthorizationResult));

    return addAuthorizationResult;


}

function UpdateAuthorizationRestrictionRequest(userid, fullyQualifiedInterfaceName, methodName)
{
    //construct json object
    var updateAuthorizationRequest = {
        userId: userid,
        fullyQualifiedInterfaceName: fullyQualifiedInterfaceName,
        methodName: methodName
    };
    updateAuthorizationRequest.write(JSON.stringify(updateAuthorizationRequest));

    return updateAuthorizationRequest;


}

function UpdateAuthorizationRestrictionResult(userid, fullyQualifiedInterfaceName, methodName)
{
    //construct json object
    var updateAuthorizationResult = {
        userId: userid,
        fullyQualifiedInterfaceName: fullyQualifiedInterfaceName,
        methodName: methodName
    };
    updateAuthorizationResult.write(JSON.stringify(updateAuthorizationResult));

    return updateAuthorizationResult;


}


function RemoveAuthorizationRestrictionsRequest(userid, fullyQualifiedInterfaceName, methodName)
{
    //construct json object
    var removeAuthorizationRequest = {
        userId: userid,
        fullyQualifiedInterfaceName: fullyQualifiedInterfaceName,
        methodName: methodName
    };
    removeAuthorizationRequest.write(JSON.stringify(removeAuthorizationRequest));

    return removeAuthorizationRequest;


}

function RemoveAuthorizationRestrictionsResult(userid, fullyQualifiedInterfaceName, methodName)
{
    //construct json object
    var removeAuthorizationResult = {
        userId: userid,
        fullyQualifiedInterfaceName: fullyQualifiedInterfaceName,
        methodName: methodName
    };
    removeAuthorizationResult.write(JSON.stringify(removeAuthorizationResult));

    return removeAuthorizationResult;


}

