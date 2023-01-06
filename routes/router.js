/**
 * This module is router for the server.
 * All routes logic is here.
 */

/**
 * Dependencies
 */

var express = require("express");
var authRouter = require("./auth.js");
var usersRouter = require("./users.js");
var appRouter = require("./app.js");
var renderIndex = require("jade").compileFile(__dirname + "/../views/index.jade");
var renderProfile = require("jade").compileFile(__dirname + "/../views/profile.jade");
var renderHelp = require("jade").compileFile(__dirname + "/../views/help.jade");
var initContent = require("../views/layout.js");
var t = require("../lang/translate.js");
var User = require("../db/users.js");

var router = express.Router();
var appState;
var req;
var res;
var indexPage;
var helperPage;
var profilePage;
var helpPage;


module.exports = router;

router.use(authRouter);

router.use(usersRouter);

router.use(appRouter);

function getTranslatedContent(req, res) {

    appState = initContent(req);
    res.locals = t(appState);
}

function getUser(req, page) {
	
    if (!req.cookies.name) {
        getTranslatedContent(req, res);
        initResponse(res, req);
        sendRes(res);
        return false
    }
    
    User.find({name: req.cookies.name}, function(err, user) {
        if (err) {
            console.log("There is an error");
            return err;
        };
        req.app.user = user[0]._id;
        getTranslatedContent(req, res);
        initResponse(res, req);
        sendRes(res);
    })
    
    return true;
    
}

function sendRes(res) {
	
    res.send(res.page);
    
}

function initResponse(res, req) {
	
    switch (req.path) {

    case "/index": res.page = renderIndex(res.locals);
    break;

    case "/profile": res.page = renderProfile(res.locals);
    break;

    case "/help": res.page = renderHelp(res.locals);
    break;

    default: res.page = renderIndex(res.locals);
    break;
    }
    
}

/**
 * Memorizeit! app pages hendlers
 */

router.get('/index', function(request, response) {
	
    req = request;
    res = response;
    getUser(req);
    
})

router.get('/profile', function(request, response) {

	User.find({name: request.cookies.name}, "name password email", function(err, user) {

		if (err) return console.log("Error while user getting");
		if (user.length > 1) return console.log("Error: so many users got");
		if (user.length === 0) console.log("Error: there is no users")
		else request.app.userProfile = user[0];
		req = request;
		res = response;
		getUser(req);

	});
})

router.get('/help', function(request, response) {
	
    req = request;
    res = response;
    getUser(req);
    
})

router.get("/translate", function(request, response) {

	response.send(t)

})

