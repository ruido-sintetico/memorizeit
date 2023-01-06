/**
 * This module contains router for remembering, authentificating,
 * entering and exiting
 * @module auth.js
 * @author Ivan A. Semenov
 */

// Dependencies

var express = require("express");
var User = require("../db/users.js");
var nodemailer = require("nodemailer");
var t = require("../lang/translate.js");
var jade = require("jade");
var xoauth2 = require('xoauth2');

var authRouter = express.Router();

var transporter = nodemailer.createTransport({
					service: 'Gmail',
					auth: {
						xoauth2: xoauth2.createXOAuth2Generator({
							user: 'memorizeit.app@gmail.com',
							clientId: "386558835383-srv6jh64a65l0ada5fl8mg64edth75rd",
							clientSecret: "f4vlBltSD_NYKD9CFcG6emZI",
							refreshToken: "1/j-yiE4ooEfPk2fsYWyZM_RVA5BHabc9yqPk4HWMe_Aw",
							accessToken: "ya29.cAL9GPP5pk4U7EL5V9aBCdbteKTc4qMokdDHUTt89olPKURdGsOf0YBok9F_7wjaSyhr"
						})
					}
				});

authRouter.use("/auth", function(req, res, next) {
	
    next();
    
})

authRouter.get("/auth/login", function(req, res) {

    if (req.query.password.length > 15) {
        res.json({success: false, message: "Password too long."});
        return ;
    } else if (/\W+/.test(req.query.password)) {
		res.json({success: false, message: "Use only letters and digits."});
        return ;
    }
	if (req.query.login.length > 15) {
		res.json({success: false, message: "Login too long."});
        return ;
	} else if (/\W+/.test(req.query.login)) {
		res.json({success: false, message: "Use only letters and digits."});
        return ;
	}
	
    User.find({name: req.query.login}, function(err, user) {
		
        if (err) {
			console.log(err);
			res.json({success: false, message: "Server error. Try latter."});
			return;
		}
        else {
            if (user.length > 1) {
				res.json({success: false, message: "Invalid login."});//TODO logging that server error!!!!!
			} else if (user.length < 1) {
				res.json({success: false, message: "There is no user with that login."});
			} else {
                if (user[0].password !== req.query.password) {
					res.json({success: false, message: "Invalid password."});
				} else {
                    res.json({success: true});
                }
            }
        }

    });
    
})

authRouter.get("/auth/remember", function(req, res) {

    if (req.query.email.length > 50) {
		res.json({success: false, message: "Email too long."});
		return ;
    } else if (!(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(req.query.email))) {
		res.json({success: false, message: "Uncorrect email."});
		return ;
	}
    User.find({email: req.query.email}, function(err, user) {
		
        if (err) return console.log(err);
        else {
            if (user.length > 1) {
				res.json({success: false, message: "Invalid email."});//TODO logging that server error!!!!!
				return;
			} else if (user.length < 1) {
				res.json({success: false, message: "There is no user with that email."});
				return;
			} else {
				req.user = user[0];
				var mes = jade.renderFile(__dirname + "/../views/emails/" + req.cookies.lang + "/remember.jade", req);
				var options = {
					from: 'memorizeit <memorizeit.app@gmail.com>',
					to: req.query.email,
					subject: 'Remembering password',
					html: mes
				};
				transporter.sendMail(options, function(error, info){
					if(error){
						console.log(error);
						res.json({success: false, message: "Message have not sent."});
						return;
					}
					console.log('Message sent: ' + info.response);
					res.json({success: true, message: "Check your email."});

				});

                return ;
            }
        }
    });
})

authRouter.get("/auth/register", function(req, res) {

    if (req.query.password.length > 15) {
        res.json({success: false, message: "Password too long."});
        return ;
    } else if (/\W+/.test(req.query.password)) {
		res.json({success: false, message: "Use only letters and digits."});
        return ;
    }
	if (req.query.login.length > 15) {
		res.json({success: false, message: "Login too long."});
        return ;
	} else if (/\W+/.test(req.query.login)) {
		res.json({success: false, message: "Use only letters and digits."});
        return ;
	}
	if (req.query.email.length > 50) {
		res.json({success: false, message: "Email too long."});
		return ;
    } else if (!(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(req.query.email))) {
		res.json({success: false, message: "Uncorrect email."});
		return ;
	}
	
    User.find({email:req.query.email}, function(err, user) {
		
		if (err) {
			console.log("There is an error. Cannot get user");
			return ;
		};
		if (user.length > 0) return res.json({success: false, message: "User with that email already exists."});
		User.find({name:req.query.login}, function(err, user) {
			
			if (err) {
				console.log("There is an error. Cannot get user");
				return ;
			}
			
			if (user.length == 0) {
				User.create({email: req.query.email,
					name: req.query.login,
					password: req.query.password},
					function(err, user) {
						
						if (err) console.log(err);

						res.cookie('name', user.name, {maxAge: 3600000});
						res.cookie("password", user.password, {maxAge: 3600000});
						req.user = user[0];
						var mes = jade.renderFile(__dirname + "/../views/emails/" + req.cookies.lang + "/register.jade", req);
						var options = {
							from: 'Memorizeit <memorizeit.app@gmail.ru>',
							to: user.email,
							subject: 'Hello!',
							html: mes
						}
						transporter.sendMail(options, function(error, info){

							if(error){
								console.log(error);
								res.json({success: false, message: "Sorry, error happend on the server. Try later"});
								//TODO logging that server error!!!!!
								return;
							}
							
							console.log('Message sent: ' + info.response);
							res.json({success: true, message: "Successfull registration. Check your email."})

						});

					}
				);
			} else {
				res.json({success: false, message: "User with that name already exists."});
			}
		});
    });
})

authRouter.get("/passrestore/:pass", function(req, res) {

	if (req.params.pass.length > 15) {
		res.send({success: false, message: "Password so long."})
		return false;
	}
	if (req.params.pass.length === 0) {
		res.send({success: false, message: "Password is empty."});
		return false;
	}
	if (req.params.pass.search(/^[A-Za-z0-9_-]+$/) === -1) {
		res.send({success: false, message: "Use letters, digit, - and _"});
		return false;
	};

	User.update({name: req.cookies.name}, {password: req.params.pass}, function(err, r) {

		if (err) return console.log(err);

		User.find({name: req.cookies.name}, function(err, user) {

			if (err) return console.log(err);

			res.cookie("password", user.password, {maxAge: 3600000});
			req.user = user[0];
			var mes = jade.renderFile(__dirname + "/../views/emails/" + req.cookies.lang + "/changepassword.jade", req);
			var options = {
				from: 'memorizeit <memorizeit.app@gmail.com>',
				to: user[0].email,
				subject: 'Changing password',
				html: mes
			}

			transporter.sendMail(options, function(error, info){
				if(error){
					return console.log("error", error);
				}
				console.log('Message sent: ' + info.response);
				res.json({success: true, message: "Password changing successfully completed. Check your email."});

			});

		});

	});

})

module.exports = authRouter;
