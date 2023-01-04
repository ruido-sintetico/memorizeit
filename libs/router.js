/**
 * @file All routes connects here
 */

// Dependencies
const Router = require("express").Router;
const passport = require("passport");
const User = require("./user.js");
const emailerConfig = require("../config/email.js");
const xoauth2 = require('xoauth2');
const nodemailer = require("nodemailer");

const router = new Router();
const service = "Gmail";
const transporter = nodemailer.createTransport({
	service: service,
	auth: {
		xoauth2: xoauth2.createXOAuth2Generator(emailerConfig.get("/service", {service: service}))
	}
});

router.post('/register',
	function(req, res, next) {
		console.log('registering user');
		User.register(new User({username: req.body.username}), req.body.password, function(err) {
			if (err) {
				console.log('error while user register!', err);
				return next(err);
			}
			console.log('user registered!');
			next();
	  });
	},
	function(req, res, next) {
		const options = {
				from: 'memorizeit <memorizeit.app@gmail.com>',
				to: "ivanse@yandex.ru",
				subject: 'Registration',
				html: "This is a registration letter."
			};
			transporter.sendMail(options, function(error, info){
				if(error) console.log(error)
				else console.log('Message sent: ' + info.response);
			});
			next();
	},
	function(req, res, next) {
		res.render("/index.jade", {message: "User registered successfully."});
	},
	function(err, req, res, next) {
		res.render("/index.jade", {error: err.message});
	}
);

router.post('/login', function(req, res, next) {
		next();
	},
	passport.authenticate('local', {
		successRedirect: '/index.html',
		failureRedirect: '/login.html',
		failureFlash: true
	})
);

router.get('/logout', function(req, res) {
	  req.logout();
	  res.redirect('/');
	});

router.get("/forgot",
	(req, res, next) => {
		const options = {
				from: 'memorizeit <memorizeit.app@gmail.com>',
				to: "ivanse@yandex.ru",
				subject: 'Remembering password',
				html: "This is a remembering letter."
			};
			transporter.sendMail(options, function(error, info){
				if(error) console.log(error)
				else console.log('Message sent: ' + info.response);
			});
			next();
	},
	(req, res, next) => {
		res.redirect("/remembered.html")
	}
)

module.exports = router;
