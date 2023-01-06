/**
 * This module contains router to working with users
 * @module users.js
 * @author Ivan A. Semenov
 */

// Dependencies

var express = require("express");
var usersRouter = express.Router();
var Dict = require("../db/dictionaries.js");
var Word = require("../db/words.js");
var FS = require("fs");

module.exports = usersRouter;

usersRouter.use("/user/*", function(req, res, next) {
    next();
})



usersRouter.use("/user/archivedicts", function(req, res, next) {

	Dict.find({user: req.cookies.name, inArchive: true}, "name _id description", function(err, dicts) {

		if (err) return console.log(err);
		if (dicts.length == 0) {
			res.json({});
			return;
		};
		res.body = dicts;
		next();

	});
	

})

usersRouter.get("/user/archivedicts", function(req, res) {
	
	res.set('Content-Type', 'application/json');
	res.json(res.body);
	
})


usersRouter.use("/user/archivewords", function(req, res, next) {

	Dict.find({user: req.cookies.name}, "_id name", function(err, dicts) {

		res.body = [];
		var count = 0;
		if (err) return console.log(err);
		for (var i = 0; i < dicts.length; ++i) {
			Word.find({dictId: dicts[i]._id, inArchive: true}, "name _id value", function(err, words) {

				if (err) return console.log(err);
				res.body = res.body.concat(words);
				++count;
				if (count === dicts.length) next();

			});
			
		}

	});

})

usersRouter.get("/user/archivewords", function(req, res) {

	res.set('Content-Type', 'application/json');
	res.json(res.body);
	
})


usersRouter.use("/user/statdict", function(req, res, next) {

	Dict.find({user: req.cookies.name}, "name _id tests wrongTests", function(err, dicts) {

		if (err) return console.log(err);
		if (dicts.length == 0) {
			res.json({});
			return;
		};
		res.body = dicts;
		next();

	});

})

usersRouter.get("/user/statdict", function(req, res) {

	res.set('Content-Type', 'application/json');
	res.json(res.body);
	
})



usersRouter.use("/user/statword", function(req, res, next) {

	Dict.find({user: req.cookies.name}, "_id", function(err, dicts) {

		if (err) return console.log(err);
		if (dicts.length == 0) {
			res.json({});
			return;
		};

		var check = 0;
		res.body = [];
		for (var i = 0; i < dicts.length; ++i) {
			Word.find({dictId: dicts[i]._id}, "name _id tests wrongTests", function(err, words) {

				if (err) return console.log(err);
				res.body = res.body.concat(words);
				++check;
				if (check === dicts.length) {
					next();	
				}
				
			});	
		}

	});
	
})

usersRouter.get("/user/statword", function(req, res) {
	
	res.set('Content-Type', 'application/json');
	res.json(res.body);
	
})



usersRouter.use("/user/predict", function(req, res, next) {

	FS.readdir(process.cwd() + "/public/predicts", function(err, files) {

		var fileName;
		
		if (err) return console.log(err);
		res.body = "";
		for (var i = 0; i < files.length; ++i) {
			fileName = files[i].replace("_", " ");
			fileName = fileName.replace(/.json$/, "");
			res.body += "<option value=" + files[i] + ">" + fileName + "</option>";
		}
		next();

	});

})

usersRouter.get("/user/predict", function(req, res) {
	
    res.setHeader("Content-Type", "text/html")
	res.send(res.body);
	
})

usersRouter.post("/user/addpredict/:id", function(req, res) {

	
	var dictName;
	var words = [];
	dictName = req.params.id.replace("_", " ");
	dictName = dictName.replace(/.json$/, "");
	
	FS.readFile(process.cwd() + "/public/predicts/" + req.params.id,
		{encoding: "utf-8"},
		function(err, data) {

			if (err) return console.log(err);

			Dict.create({
				name: dictName,
				description: dictName,
				user: req.cookies.name,
				date: new Date(),
				inArchive: false,
				tests: null,
				wrongTests: null
			}, function(err, dict) {

				if (err) return console.log(err);
				var j = 0;
				data = JSON.parse(data);
				for (var i in data) {
					words[j] = {};
					words[j].name = i;
					words[j].value = data[i];
					words[j].dictId = dict._id;
					words[j].date = new Date();
					words[j].inArchive = false;
					words[j].tests = null;
					words[j].wrongTests = null;
					++j 
				}
				Word.create(words, function(err, words) {

					if (err) return console.log(err);
					res.json({success: true});

				});

			});
			
		}
	);

})
