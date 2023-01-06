/**
 * @file This is main server file. There is whole server logic.
 * @author Ivan A.Semenov<ivanse@yandex.ru>
 */
"use strict"

// Dependecies
const express = require('express');
const mongoose = require("mongoose");
const serverConfig = require("./config/server.js");
const dbConfig = require("./config/db.js");
const assetsConfig = require("./config/assets.js");
const getEnv = require("./libs/env.js");
const session = require("express-session");
const MongoSessionStore = require("connect-mongodb-session")(session);
const sessionConfig = require("./config/session.js");
const serveFavicon = require("serve-favicon");
const errorhandler = require('errorhandler');
const logger = require("morgan");
const fs = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const log = require('winston');
const User = require("./libs/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Router = require("./libs/router");
const flash = require('connect-flash');


const server = express();

server.set("env", {env: getEnv()});

/**
 *  Set up server
 */
server.set("serverConfig", serverConfig.get("/env", server.get("env")));
server.set("dbConfig", dbConfig.get("/env", server.get("env")));
server.set("assetsConfig", assetsConfig.get("/location", server.get("env")));

/**
 *  Set up DB
 */

if (server.get("env") === "production") {
	var conf = server.get("dbConfig");
    server.set("dbAddress", `mongodb://${conf.userName}:${conf.password}@${conf.host}:${conf.port}/${conf.db}`);
} else {
	let conf = server.get("dbConfig");
    server.set("dbAddress", `mongodb://${conf.host}:${conf.port}/${conf.db}`);
}

/**
 *  Set up session
 */
const sessionStore = new MongoSessionStore({
	uri: server.get("dbAddress"),
	collection: "sessions"
});
sessionStore.on("error", function(err) {
	log.error("Cannot connect to " + server.get("dbAddress") + "sessions collection: " + err);
});
const sessionSettings = {
	secret: sessionConfig.get("/secret", server.get("env")),
	cookie: sessionConfig.get("/cookie", server.get("env")),
	name: sessionConfig.get("/name", server.get("env")),
	resave: sessionConfig.get("/settings/resave", server.get("env")),
	rolling: sessionConfig.get("/settings/rolling", server.get("env")),
	saveUninitialized: sessionConfig.get("/settings/saveUninitialized", server.get("env")),
	store: sessionStore
};

/**
 * Set root directory of application
 */
server.set("serverRootDir", __dirname);

/**
 * Set app local salt
 */
server.set("app-salt", serverConfig.get("/salt", server.get("env")));

/**
 *   Set view engine variables
 */
console.log(assetsConfig.get("/location/views", server.get("env")));
server.set("views", __dirname + assetsConfig.get("/location/views", server.get("env")));
server.set("view engine", "jade");
server.set("view cache", true);

/**
 *  terminator === the termination handler
 *  Terminate server on receipt of the specified signal.
 *  @param {string} sig  Signal to terminate on.
 */
server.set("terminator", (sig) => {
    if (typeof sig === "string") {
       log.info('%s: Received %s - terminating memorizeit! app ...',
                   Date(Date.now()), sig);
       process.exit(1);
    }
    log.info('%s: Node server stopped.', Date(Date.now()) );
});


/**
 *  Setup termination handlers (for exit and a list of signals).
 */

server.set("setupTerminationHandlers", () => {
    //  Process on exit and signals.
    process.on('exit', function() { server.get("terminator")(); });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
     'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
        process.on(element, function() { server.get("terminator")(element); });
    });
});

/**
 *  Start the server (starts up the memorizeit! app).
 */

server.set("startServer", () => {
	log.info("Node server is starting...");
    //  Start the app on the specific interface (and port).
    server.listen(server.get("serverConfig").port,
		server.get("serverConfig").host,
		() => {
			log.info('%s: Node server started on %s:%s ...', Date(Date.now()), server.get("serverConfig").host,
				server.get("serverConfig").port);
			server.get("connectDB")();
		});
});

/**
 *  Connect to DB
 */

server.set("connectDB", () => {

	var db;

	log.info("Mongo is connecting...");
	mongoose.connect(server.get("dbAddress"));
	db = mongoose.connection;
	server.set("dbConnection", db);
	db.on('error', () => {
		console.error.bind(console, 'connection error:');
		server.get("terminator")();
	});
	db.once('open', function () {
	    log.info("Mongo connection opened by mongoose.");

		// Middlewares
		server.use(serveFavicon(__dirname + assetsConfig.get("/location/favicon", server.get("env"))));
		server.use(cookieParser());
		server.use(bodyParser.json());
		server.use(bodyParser.text())
		server.use(bodyParser.urlencoded({extended: true}));

		server.use(express.static(__dirname + assetsConfig.get("/location/scripts", server.get("env"))));
		server.use(express.static(__dirname + assetsConfig.get("/location/styles", server.get("env"))));
		server.use(express.static(__dirname + assetsConfig.get("/location/images", server.get("env"))));

		if (getEnv() === "production") {
			server.use(logger("tiny", {
				skip: function(req, res) {return res.statusCode < 200;},
				stream: fs.createWriteStream(__dirname + "/server.log", {flags: 'w', encoding: "utf-8"})
			}))
		} else server.use(logger("dev"))

		server.use(session(sessionSettings));
		server.use(flash());

		server.use(passport.initialize());
		server.use(passport.session());
		passport.use(new LocalStrategy(User.authenticate()));
		passport.serializeUser(User.serializeUser());
		passport.deserializeUser(User.deserializeUser());


		server.use((req, res, next) => {
			debugger;
			next();
		})

		server.use(express.static(__dirname + assetsConfig.get("/location/pages", server.get("env"))));

		server.use(Router);

		if (getEnv() == "development") {
			server.use(errorhandler());
		}

	    log.info("Initializing completed. Memorizeit is ready to work!");
	});
})


server.get("setupTerminationHandlers")();
server.get("startServer")();
