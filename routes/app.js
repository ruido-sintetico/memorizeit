/**
 * This module is router for the app.
 * All app routes logic is here.
 */

/**
 * Dependencies
 */

var express = require("express");
var Dict = require("../db/dictionaries.js");
var Word = require("../db/words.js");


var router = express.Router();

/**
 * Dicts routers
 */

router.get("/dicts", function(req, res) {

	Dict.find({user: req.cookies.name, inArchive: false},
		null,
		null,
		function(error, dicts){

			if (error) {
				res.status("500").send(error.message);
				console.log("error--cannot get the dicts", dicts);
				return;
			};
			res.send(dicts);

		}
	);
})

router.get("/dict/:id", function(req, res) {

	Word.find({inArchive: false, dictId: req.params.id},
		null,
		null,
		function(error, words) {

			if (error) {
				res.status("500").send(error.message);
				return;
			}
			res.send(words);

		});

})

router.put("/dict/:id", function(req, res) {

	Dict.findByIdAndUpdate(req.params.id,
		{$set: {
			name: req.body.name,
			description: req.body.description,
			user: req.body.user,
			date: req.body.date,
			inArchive: req.body.inArchive,
			tests: req.body.tests,
			wrongTests: req.body.wrongTests
			}
		},
		null,
		function(error, dict) {

			if (error) {
				res.status("500").send(error.message);
				return;
			}
			if (req.body.inArchive === true) {
				Word.update({dictId: req.params.id},
				{inArchive: true},
				{multi: true},
				function(error, words) {

					if (error) {
						res.status("500").send(error.message);
						return;
					}
					res.send({});
				
				});
			} else res.send({});
			
		}
	);

})

router.delete("/dict/:id", function(req, res) {

	Dict.findByIdAndRemove(req.params.id,
		null,
		function(error, dict) {

			if (error) {
				console.log(error);
				res.status("500").send(error.message);
				return;
			}
			Word.remove({dictId: req.params.id}, function(error, dicts) {

				if (error) {
					res.status("500").send(error.message);
					return;
				}
				res.send({});

			});
			
		}
	);

})

router.post("/dict/:id", function(req, res) {

	if (req.body.name != "" && req.body.description != "") {


		Dict.find({name: req.body.name}, function(error, dicts) {

			if (error) {
				console.log("cannot create dict.", error);
				res.status("500").send(error.message);
				return;
			};
			if (dicts.length > 0) {
				res.status("500").send("Dict with that name already exist.");
				return;
			}		
			Dict.create(req.body, function(error, dict) {

				if (error) {
					console.log("cannot create dict.", error);
					res.status("500").send(error.message);
					return;
				}
				res.send({_id: dict._id});
				console.log("dict", dict);

			})
		})
	} else {
		res.send("Name and description fields is empty");
	}

})

router.post("/archive/dict/:id", function(req, res) {

	Dict.findByIdAndUpdate(req.params.id, {inArchive: false}, function(err, dict) {

		Word.update({dictId: req.params.id}, {inArchive: false}, {multi: true}, function(err, word) {

			if (err) return console.log(err);
			res.redirect("/profile");
		});

	});

})
/**
 * Words routers
 */

router.get("/words", function(req, res) {

	var allWords = [];
	var parsedDicts = 0;
	
	Dict.find({user: req.cookies.name},
		function(error, dicts) {

			if (error) {
				res.status("500").send(error.message);
				console.log("error--cannot get the words", words);
				return;
			};
			for (var i = 0; i < dicts.length; ++i) {
				Word.find({dictId: dicts[i]._id, inArchive: false},
					function(error, words){

						++parsedDicts;
						if (error) {
							res.status("500").send(error.message);
							console.log("error--cannot get the words", words);
							return;
						};
						for (var j = 0; j < words.length; ++j) {
							allWords.push(words[j]);
						};
						if (i == parsedDicts) {
							res.send(allWords);
						};

					}
				);
			};

		}
	);
	
})

router.put("/word/:id", function(req, res) {
	
	Word.findByIdAndUpdate(req.params.id,
		{$set: {
			name: req.body.name,
			value: req.body.value,
			dictId: req.body.dictId,
			date: req.body.date,
			inArchive: req.body.inArchive,
			tests: req.body.tests,
			wrongTests: req.body.wrongTests
			}
		},
		null,
		function(error, word) {

			if (error) {
				res.status("500").send(error.message);
				return;
			}
			res.send({});
			
		}
	);
	
})

router.delete("/word/:id", function(req, res) {

	Word.remove({_id: req.params.id}, function(error, dicts) {

		if (error) {
			res.status("500").send(error.message);
			return;
		}
		res.send();

	});
			
})

router.post("/word/:id", function(req, res) {

	if (req.body.name != "" && req.body.value != "") {
		Word.find({name: req.body.name}, function(error, words) {

			if (error) {
				console.log("cannot create dict.", error);
				res.status("500").send(error.message);
				return;
			};
			Word.create(req.body, function(error, word) {

				if (error) {
					console.log("cannot create dict.", error);
					res.status("500").send(error.message);
					return;
				}
				res.send({_id: word._id});

			})
		})
	} else {
		res.send("Name and description fields is empty");
	}	
})

router.post("/archive/word/:id", function(req, res) {

	Word.findByIdAndUpdate(req.params.id, {inArchive: false}, function(err, word) {

		res.redirect("/profile");

	});

})

module.exports = router;


