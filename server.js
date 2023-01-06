#!/bin/env node
//  Learnhelper application
var express = require('express');
var serveFavicon = require("serve-favicon");
var router = require("./routes/router.js");
var logger = require("morgan");
var fs = require("fs");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var mongoose = require("mongoose");

var app = express();

/**
 *  Set up server IP address and port # using env variables/defaults.
 */

app.set("ipaddress", process.env.OPENSHIFT_NODEJS_IP);
app.set("port", process.env.OPENSHIFT_NODEJS_PORT || 8080);

if (typeof app.get("ipaddress") === "undefined") {
        //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
        //  allows us to run/test the app locally.
    console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
    app.set("ipaddress", "127.0.0.1");
};

if (app.get("ipaddress") === "127.0.0.1") {
    app.set("env", "development");
} else {
    app.set("env", "production")
}

/**
 *   Set view engine variables
 */

app.set("views", "./views");
app.set("view engine", "jade");

/**
 *  terminator === the termination handler
 *  Terminate server on receipt of the specified signal.
 *  @param {string} sig  Signal to terminate on.
 */
app.set("terminator", function(sig){
    if (typeof sig === "string") {
       console.log('%s: Received %s - terminating memorizeit! app ...',
                   Date(Date.now()), sig);
       process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
});


/**
 *  Setup termination handlers (for exit and a list of signals).
 */

app.set("setupTerminationHandlers", function(){
    //  Process on exit and signals.
    process.on('exit', function() { app.get("terminator")(); });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
     'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
        process.on(element, function() { app.get("terminator")(element); });
    });
});

/**
 *  Start the server (starts up the memorizeit! app).
 */

app.set("start", function() {
    //  Start the app on the specific interface (and port).
    app.listen(app.get("port"), app.get("ipaddress"), function() {
        console.log('%s: Node server started on %s:%s ...',
                    Date(Date.now() ), app.get("port"), app.get("ipaddress"));
    });
});

/**
 * Open db connection.
 */

(function (app) {
    console.log("Mongo is connecting...");
    var dbAddress;
    if (app.get("env") === "development"){
        dbAddress = "mongodb://localhost:27017/memorizeit"
    }
    if (app.get("env") === "production") {
        dbAddress ="mongodb://admin:fnRRcvI6C__T@" + process.env.OPENSHIFT_MONGODB_DB_HOST + 		//  TODO hide in configure file before deployment
				":" + process.env.OPENSHIFT_MONGODB_DB_PORT + "/memorizeit";
    }
    mongoose.connect(dbAddress);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("Mongo connected by mongoose.");
        app.set("dbConnection", db);
        
        /**
         * Middleware block
         */
		app.use(function(res, req, next) {
			console.log(req.method, req.url);
			next();
		});
        app.use(express.static(__dirname + "/public/"));

        app.use(serveFavicon(__dirname + '/public/favicon.ico'));

        if (app.get("env") === "production") {
            app.use(logger("tiny", {
            skip: function(req, res) {return res.statusCode < 400;},
            stream: fs.createWriteStream(__dirname + "/log", {flags: 'w', encoding: "utf-8"})
        }))
        } else {
            app.use(logger("dev"))
        }
        
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(router);

        app.get("setupTerminationHandlers")();
        app.get("start")();
    });
})(app)
