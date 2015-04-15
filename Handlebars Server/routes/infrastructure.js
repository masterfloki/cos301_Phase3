/**
 * Created by Renette on 2015-04-13.
 */

/**
 * @typedef
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
     * @param result
     */
    function Login(username, password, result, lastPage) {
        csds.login(username, password, function (res) {
            if (res === true) {
                //FindUserModules(username, password);
                //GetUserRolesForModules(obj.usmemberID);
                //TODO Create session and store username in it
                if (lastPage) {
                    result.redirect(lastPage);
                } else {
                    result.redirect("/");
                }
            }
            else {
                var loginPage = './csds-views/login';
                result.render(loginPage, {message: 'Failed to login', messageType: 'danger'});
            }
        });
    }

    router.get('/createSpace', function (req, res, next) {
        res.render('./spaces-views/createSpace', {"title": "Create Space"});
    });

    router.get('/closeSpace', function (req, res, next) {
        res.render('./spaces-views/closeSpace');
    });

    router.get('/infrastructure', function (req, res, next) {
        res.render('infrastructure', {modules: '', 'title': 'Infrastructure integration'});
    });

    router.get('/adminManagement', function (req, res, next) {
        res.render('./spaces-views/adminManagement');
    });

    router.post('/newSpace', function (req, res, next) {
        var obj = {};
        /**
         * Body of POST request
         * @type {{moduleID : String, moduleName : String}}
         */
        var request = req.body;
        obj.academicYear = request.moduleID[0];
        obj.isOpen = true;
        obj.moduleID = request.moduleID;
        obj.name = request.moduleName;
        //TODO add user from session here.
        obj.adminUsers = [];

        var result = spaces.createBuzzSpace(obj);

        res.render('./spaces-views/createSpace', {message: result});
    });

    router.get('/notify', function (req, res, next) {
        res.render('./notification-views/threadNotifyWidget', {"message" : req.query.message, 'messageType':req.query.messageType});
    });


    router.post('/submitNotifyOptions', function (req, res, next) {
        var recipientAddress = "renetteros@gmail.com";   //email address of recipient
        var result, mailSubject, mailMessage;

        if (req.body.newPost) {
            var jsonObj = {
                threadID: req.body.threadID
            };

            result = notification.notifyDeletedThread(jsonObj);


            mailSubject = "Buzz: Registered for notification"; //Notification subject
            mailMessage = "Registered for notifications regarding the creation of threads on this post";//Message to be sent

            notification.sendNotification(recipientAddress, mailSubject, mailMessage);
        }

        if (req.body.deletePost) {
            jsonObj = {
                threadID: '0'
            };
            result = notification.notifyDeletedThread(jsonObj);

            mailSubject = "Buzz: Registered for notification"; //Notification subject
            mailMessage = "Registered for notifications regarding the deletion of threads on this post";//Message to be sent

            notification.sendNotification(recipientAddress, mailSubject, mailMessage);
        }
        if (req.body.threadMoved) {
            jsonObj = {
                threadID: '0'
            };
            result = notification.notifyMovedThread(jsonObj);

            mailSubject = "Buzz: Registered for notification"; //Notification subject
            mailMessage = "Registered for notifications regarding the moving of threads on this post";//Message to be sent

            notification.sendNotification(recipientAddress, mailSubject, mailMessage);
        }
        if (req.body.appraisalRegister) {
            //TODO Don't hardcode
            jsonObj = {
                appraisalType: 'Funny',
                studentID: 'u34567890'
            };
            result = notification.appraisalRegister(jsonObj);

            mailSubject = "Buzz: Registered for notification"; //Notification subject
            mailMessage = "Registered for appraisals notifications";//Message to be sent

            notification.sendNotification(recipientAddress, mailSubject, mailMessage);

        }
        if (req.body.appraisalDeregister) {
            //TODO studentID from seesion
            jsonObj = {
                appraisalType: 'Funny',
                studentID: 'u34567890'
            };
            result = notification.appraisalDeregister(jsonObj);


//Gmail password


            mailSubject = "Buzz: Registered for notification"; //Notification subject
            mailMessage = "Deregistered for appraisal notifications";//Message to be sent

            notification.sendNotification(recipientAddress, mailSubject, mailMessage);
        }
        res.redirect('/notify?' + querystring.stringify({'message':'Notification options changed', 'messageType':'success'}));
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
        res.render('./csds-views/login');
    });

    router.get('logout', function(re, res, next) {
        res.render('./csds-views/login' ,{'message': 'You have been logged out of the system.', 'message-type':'notify'})
    });


    router.post('/submitCSDS',  function (req, res, next) {
        /**
         * @typedef {{csUsername : String, csPassword : String}} LoginRequest
         * @type {LoginRequest}
         */
        var request = req.body;

        Login(request.csUsername, request.csPassword, res);
    });


    return router;

};
