/**
 * Created by Renette on 2015-04-13.
 */

/**
 * Appends infrastructure routing to router.
 * @param router {exports}
 * @param database {BuzzDatabase}
 * @param authentication {authentication}
 * @param csds {csds}
 * @param spaces {spaces}
 * @param notification {notification}
 * @returns {exports}
 */

var querystring = require('querystring');
module.exports = function (router, database, authentication, csds, spaces, notification) {
    var mongoose = database.mongoose;

    function FindUserModules(memberUid, result) {
        //TODO memberUid - get from session
        csds.findUserModules(memberUid, function (res) {
            try {
                result.render('./infrastructure', {modules: res});
            }
            catch (err) {
                console.log(err);
            }
        });
    }

    function GetActiveModulesForYear() {
        csds.getActiveModulesForYear(function (res) {
            try {
                console.log(res);
            }
            catch (err) {
                console.log(err);
            }
        });
    }

    /**
     * Handles login based on username and password.
     * @param username {String}
     * @param password {String}
     * @param res res from calling middleware
     * @param req
     * @param [lastPage] {String} URL of page that needs to be opened after login request
     */
    function Login(username, password, req, res, lastPage) {
        if (app.get('env') !== 'production' && username == 'u12345678') {
            var session = req.session;
            session.userId = username;//this is assuming we only log in with our userids which are our student numbers
            if (lastPage) {
                res.redirect(lastPage);
            } else {
                res.redirect("/");
            }
        } else {
            csds.login(username, password, function (data) {
                if (data === true) {
                    //FindUserModules(username, password);
                    //GetUserRolesForModules(obj.usmemberID);

                    var session = req.session;
                    session.userId = username;//this is assuming we only log in with our userids which are our student numbers
                    if (lastPage) {
                        res.redirect(lastPage);
                    } else {
                        res.redirect("/");
                    }
                }
                else {

                    res.redirect('/login?' + querystring.stringify({
                        message: 'Failed to login',
                        messageType: 'danger'
                    }));
                }
            });
        }
    }

    router.get('/closeSpace', function (req, res, next) {
        res.render('./spaces-views/closeSpace');
    });

    router.get('/infrastructure', function (req, res, next) {
        res.render('infrastructure', {modules: '', 'title': 'Infrastructure integration'});
    });

    router.get('/manageSpace', function (req, res, next) {
        res.render('./spaces-views/manageSpace');
    });

    router.post('/ajax/newSpace', function (req, res, next) {
        var obj = {};
        /**
         * Body of POST request
         * @type {{moduleID : String, moduleName : String, academicYear : number}}
         */
        var request = req.body;
        var myId = global.getSessionUserID(req);
        obj.academicYear = request.academicYear;
        obj.isOpen = true;
        obj.moduleID = request.moduleID;
        obj.name = request.moduleName;

        obj.adminUsers = [myId];

        var result = spaces.createBuzzSpace(obj);

        res.send(result);
    });

    router.post('/ajax/addNotification', function (req, res, next) {
        /**
         * @type {{action : string, target : string}}
         */
        var data = req.body;
        var myId = global.getSessionUserID(req);

        switch(data.action)  {
            case 'followThread':
                notification.notifyRegistration({type:'follow_Thread', threadID:data.target, studentID:myId});
                break;
            case 'followUSer':
                notification.notifyRegistration({type:'follow_User', userID:data.target, studentID:myId});
                break;
            case 'followAppraisal':
                notification.appraisalDeregister({appraisalType:data.target, studentID:myId});
                break;

            case 'unfollowThread':
                notification.notifyDeregistration({type:'deregister_Thread', threadID:data.target, studentID:myId});
                break;
            case 'unfollowUser':
                notification.notifyDeregistration({type:'deregister_User', userID:data.target, studentID:myId});
                break;
            case 'unfollowAppraisal':
                notification.appraisalDeregister({appraisalType:data.target, studentID:myId});
                break;
            default:
                console.log("unknown Action " + data.action + " by " + myId);
        }

        res.status(200).send({message:myId + '\'s  notification settings has been changed.'});
    });

    router.post('/submitRS', function (req, res, next) {

        var obj = {};
        obj.moduleID = req.body.RSmodule;

        obj.callback = function (err, response) {
            console.log(response);
        };
        var result = spaces.closeBuzzSpace(obj);

        res.render('./spaces-views/closeSpace', {message: result});
    });

    router.post('/submitAAM', function (req, res, next) {
        var obj = {};
        obj.moduleID = req.body.Aadmin;
        obj.userID = req.body.AAid;

        var result = spaces.assignAdministrator(obj);

        res.render('./spaces-views/adminManagement', {message: result});
    });

    router.post('/submitRAM', function (req, res, next) {
        var obj = {};
        obj.moduleID = req.body.Radmin;
        obj.userID = req.body.RAid;

        obj.callback = function (err, response) {
            console.log(response);
        };
        var result = spaces.removeAdministrator(obj);
        res.render('./spaces-views/adminManagement', {message: result});
    });

    router.get('/registerUser', function (req, res, next) {
        res.render('./spaces-views/registerUser');
    });

    router.post('/submitRU', function (req, res, next) {
        var obj = {};
        obj.userNameForBuzzSpace = req.body.RUuserName;
        obj.signature = req.body.RUsignature;
        obj.userID = req.body.RUuserid;
        obj.moduleID = req.body.RUmoduleid;

        obj.callback = function (err, response) {
            console.log(response);
        };
        var result = spaces.registerOnBuzzSpace(obj);

        //console.log("this is the result " + result);
        res.render('./spaces-views/registerUser', {message: result});
    });

    var authSchema = mongoose.Schema({
            methodName: String,
            moduleID: String,
            roleName: String,
            StatusPoints: Number
        },
        {collection: 'Authorization'});


    function getRestrictions(callback) {
        var auth = mongoose.model('Authorization', authSchema);
        //auth.find().select('methodName - _id');
        auth.find({}, 'methodName', function (err, restrictions) {
            if (err) {
                console.log('unable to find list');
            }
            else {
                callback(restrictions);
            }
        });
    }

    router.get('/getRestrictions', function (req, res) {

        getRestrictions(function (restr) {
            var rest = {};
            rest.list = restr;
            rest.title = 'Authorization Restrictions List';

            res.render('./auth-views/authorization', rest);
        })

    });


    router.get('/login', function (req, res, next) {

        var context = {title:"login"};
        if (req.query) {
            context.lastPage = req.query.from;
            context.message = req.query.message;
            context.messageType = req.query.messageType;
        }
        res.render('./csds-views/login', context);
    });

    router.get('/logout', function(req, res, next) {
        var session = req.session;
        if(session !== null)
        {
            res.redirect('/login?' + querystring.stringify({'message': 'You have been logged out of the system.', 'messageType':'notify'}));
            session.destroy();
        }
        else
        {
            res.redirect('/login')
        }

    });


    router.post('/submitCSDS',  function (req, res, next) {
        /**
         * @typedef {{csUsername : String, csPassword : String, lastPage : String}} LoginRequest
         * @type {LoginRequest}
         */
        var request = req.body;

        Login(request.csUsername, request.csPassword, req, res, request.lastPage);
    });


    return router;

};
