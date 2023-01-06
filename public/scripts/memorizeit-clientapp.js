/**
 * Whole client-side logic of the app is here
 * App uses REST API:
 * 	1) /dicts - for getting dict models from server
 * 	2) /dict/:id - for manipulating concrete dictionary
 * 	3) /words - for getting all word models from server
 * 	4) /word/:id - for manipulating concrete word
 * 	5) /translate - for getting translating file
 */

$(function() {

	var wordValueTemplates = /[<>@#$%^&*+~]/;

	/**
	 * Create app 
	 */

	var App = Backbone.View.extend({

		el: $("#personal-menu"),
		
		events: {
			"click #words": "showWords",
			"click #dictionaries": "showDicts",
			"click #test": "showTest",
			"click #learn": "showLearn"
		},
		
		initialize: function() {

			this.elements = [];
			this.elements.appContainer = $("<div id = 'memorizeit-app'></div>")
			$("#content").append(this.elements.appContainer);
			
		},

		showWords: function() {

			this.clearPage();
			this.elements.appContainer.children().remove();
			var wordsView = new WordsView({url: "/words"});
			this.elements.appContainer.append(wordsView.$el);
			
		},

		showDicts: function() {

			this.clearPage();
			this.elements.appContainer.children().remove();
			var dictsView = new DictsView({url: "/dicts"});
			this.elements.appContainer.append(dictsView.$el);

		},

		showTest: function() {

			this.clearPage();
			this.elements.appContainer.children().remove();
			var testView = new TestView;
			this.elements.appContainer.append(testView.$el);
			this.elements.appContainer.prepend("<h3>" + t("Test") + "</h3>");

		},
		
		showLearn: function() {

			this.clearPage();
			this.elements.appContainer.children().remove();
			var learnView = new LearnView;
			this.elements.appContainer.append(learnView.render().$el);
			this.elements.appContainer.prepend("<h3>" + t("Learn") + "</h3>");

		},

		clearPage: function() {
			$("#content").children().remove();
			this.elements.appContainer.children().remove();
			$("#content").append(this.elements.appContainer);
		}
		
	});

	/**
	 * Models block
	 */

	var Entity = Backbone.Model.extend({

		idAttribute: "_id",
		
		validate: function() {

			var n = this.get("name");
			var d = this.get(this.descriptionOrValue);
			if (n == "" || d == "") return "invalid";
			if (wordValueTemplates.test(n)) return "invalid";
			else if (wordValueTemplates.test(d)) return "invalid";
			
		},
		
		invalid: function() {

			AppError(t("Dont use <, >, @, #, $, %, ^, &, *, +, ~ symbols and empty string"), "", "", "error");
			
		},
		
		inArchive: function() {

			this.save({inArchive: true}, {validate: false});
			
		},
		
		remove: function() {

			this.destroy({
				success: function() {

					AppError(t("Model have deleted."), "", "", "message");
					
				},
				error: function(model,res) {

					AppError(t("Model have not deleted. Try later."), "", "", "message");
					
				}
			});
			
		},
		
		initialize: function() {

			this.on("invalid", this.invalid, this);
			
		}
		
	});

	var Word = Entity.extend({
		
		defaults:{
			name:"",
			value: "",
			inArchive: false,
			date: new Date(),
			dictId: null,
			tests: null,
			wrongTests: null
		},
		
		url: function() {
			
			return "/word/" + this.get("_id");
			
		},

		descriptionOrValue: "value"

	});

	var Dict = Entity.extend({
		
		defaults:{
			name:"",
			description: "",
			inArchive: false,
			date: new Date(),
			user: Cookie.getCookie("name"),
			tests: null,
			wrongTests: null
		},
		
		url: function() {

			return "/dict/" + this.get("_id");
			
		},

		descriptionOrValue: "description",

		inArchive: function() {

			this.save({inArchive: true}, {validate: false});

		}
		
	});

	/**
	 * Collection block
	 */

	var List = Backbone.Collection.extend({
		
	});

	var StudyList = List.extend({

	});

	var LearnList = StudyList.extend({
		
		initialize: function(models, options) {
			this.url = options.url;
		}
		
	});

	var TestList = StudyList.extend({

		initialize: function(models, options) {
			this.url = options.url;
		}

	});

	var EditList = List.extend({

		initialize: function(models, options) {
			this.url = options.url;
		},
		
		find: function(str) {
			var re = new RegExp(str, "i");
			return _.filter(this.models, function(model) {
				if (re.test(model.get("name"))) {
					return true;
				}
				
				if (model.get("description")) {
					if (re.test(model.get("description"))) {
						return true;
					}
					
				}
				
				if (model.get("value")) {
					if (re.test(model.get("value"))) {
						return true;
					}
				}
			}, this.models);
		}
		
	});

	/**
	 * View block
	 */

	var ListView = Backbone.View.extend({
		
		tagName: "div",
		
		className: "app",

	});

	var ListStudyView = ListView.extend({

		getCriteria: function() {
			
			return this.$el.find(".items-criteria").val();
			
		},

		getDictsIdByName: function() {
			
			var dictName = $(".items-dict").val();
			for (var dict in this.allDicts) {
				if (this.allDicts[dict].name == dictName) {
					return this.allDicts[dict]._id;
				} 
			}
			
		},

		getActiveDict: function() {

			var dictName = $(".items-dict").val();
			for (var dict in this.allDicts) {
				if (this.allDicts[dict].name == dictName) {
					return this.allDicts[dict];
				} 
			}

		}

	});

	var TestView = ListStudyView.extend({
		
		id: "test",
		
		events: {
			"click .items-start": "startHandler",
			"click .item-skip": "skipHandler",
			"click .item-next": "nextHandler"
		},
				
		initialize: function() {
			
			this.$el.append("<div class = 'item-wrapper'></div>");
			var elWordValue = $("<div id = 'item' class = 'item'></div>");
			var elSkip = $("<input type = 'button' class = 'item-skip button-primary' value = '" + t("Skip") + "' id = 'skip'>");
			var elNext = $("<input type = 'button' class = 'item-next button-primary' value = '" + t("Next") + "' id = 'next'>");
			var elItemCtrl = $("<div class = 'item-ctrl'></div>").append(elSkip).append(elNext);
			
			this.$el.find(".item-wrapper").append(elWordValue).append(elItemCtrl).hide();
			
			this.showOptions();

		},
		
		options: function() {

			var self = this;
			this.allDicts = [];
			var optionsDiv = $("<div class = 'items-options' id = 'options'></div>");
			var elDicts = $("<select class = 'items-dict' id = 'dict'></select>");
			var elCriteria = $("<select class = 'items-criteria'></select>");
			var elStart = $("<input type = 'button' class = 'items-start button-primary' id = 'start' value ='" + t("Start") + "'>");
			
			elCriteria.append("<option value = 'name'>" + t("By word") + "</option>" +
			"<option value = 'value'>" + t("By value") + "</option>" +
			"<option value = 'both'>" + t("By word or value") + "</option>");

			$.get("/dicts", function(response) {
				self.allDicts = response;
				for(var i = 0; i < response.length; ++i) {
					var dict = response[i].name;
					elDicts.append("<option value = '" + dict + "'>" + dict + "</option>");
				}
				
			});
			
			return optionsDiv.append(elDicts).append(elCriteria).append(elStart);
		},
		
		next: function() {
			
			this.pointer++;
			this.render();
			
		},
		
		nextHandler: function() {

			var tests = this.currentModel.get("tests");
			var wrongTests;
			if (this.isRight()) {
				this.currentModel.save({tests: ++tests}, {wait: true});
				this.next();
				return;
			}
			wrongTests = this.currentModel.get("wrongTests");
			this.wrongModels.push(this.currentModel);
			this.currentModel.save({tests: ++tests, wrongTests: ++wrongTests}, {wait: true});
			this.next();
			
		},
		
		isRight: function() {
			
			var model = this.currentModel;
			var inputData = $(".item-" + model.criteria).val();
			if (model.get(model.criteria) == inputData) return true;
			return false;
			
		},
		
		skip: function() {
			
			this.collection.models.splice(this.pointer, 1);
			this.collection.models.push(this.currentModel);
			
		},
		
		skipHandler: function() {
			
			this.skip();
			this.render();
			
		},
		
		render: function() {
			
			try {
				
				$(".item").children().remove();
				var model = this.collection.at(this.pointer);
				this.currentModel = model;
				if (model.criteria == "name") {
					$(".item").append("<input class = 'item-name test' type = 'text'>");
					$(".item").append("<div class = 'item-value test'>" + model.get("value") + "</div>");
				} else {
					$(".item").append("<div class = 'item-name test'>" + model.get("name") + "</div>");
					$(".item").append("<input class = 'item-value test' type = 'text'>");
				
				}
				
			}
			
			catch(e) {
				
				this.end();
				
			}
			
			this.$el.find(".items-options").hide();
			this.$el.find(".item-wrapper").show();
		},
		
		errorsReport: function() {
			var report =  "<p class = 'report-by-errors'>" + t("You have got ") + this.wrongModels.length + t(" errors") + ".</p>";
			if (this.wrongModels.length > 0) {
				report += "<p class = 'report-by-errors'>" + t("You have got errors on:") + "</p>";
				_.each(this.wrongModels, function(elem, index, list) {
					report += "<p class = 'report-by-errors'>" + elem.get("name") + " : " + elem.get("value") + "</p>"
				})
			}
			return report;
		},
		
		showOptions: function() {
			
			this.$el.append(this.options());
			this.$el.find(".items-options").show();
			this.$el.find(".item-wrapper").hide();
			
		},
		
		startHandler: function() {
			
			var self = this;
			this.wrongModels = [];
			this.collection = new TestList([], {
				
				url: function() {
					return "/dict/" + self.getDictsIdByName();
				},
				model: Word,
				
			});
			
			this.collection.fetch({
				
				success: function(collection, response, options) {
					AppError("", "Collection have got.", this);
					_.each(collection.models, function(elem, index, list) {
						if (self.getCriteria() == "both")
							elem.criteria = _.sample(["name", "value"])
						else elem.criteria = self.getCriteria();
					});
					self.collection.models = _.shuffle(self.collection.models);
					self.pointer = 0; 
					self.render();
				},
				error: function() {
					AppError(t("Sorry, it cannot get your words. Please, repeat"), "Collection have not got.", this, "error")
				}
				
			});
		},
		
		end: function() {

			var dict = new Dict(this.getActiveDict());
			var dictTests = dict.get("tests");;
			var dictWrongTests = dict.get("wrongTests");;
			$(".item-wrapper").children().remove();
			$(".item-wrapper").append(this.errorsReport());
			if (this.wrongModels.length === 0) {
				dict.save({tests: ++dictTests}, {wait: true});
			} else {
				dict.save({tests: ++dictTests, wrongTests: ++dictWrongTests}, {wait: true});
			}
			
		},
		
		pointer: null
		
	});

	var LearnView = ListStudyView.extend({
		
		id: "learn",
		
		events: {
			"change .items-toogle-all": "toogleAll",
			"click .items-mix": "mix",
			"change .items-criteria": "showByCriteria",
			"change .items-dict": "chooseDict"
		},
		
		initialize: function() {

			this.elChooseDict = "<select class = 'items-dict'><option></option></select>";
			this.elCtrl = "<div id = 'learn-control' class = 'items-options'></div>";
			this.elList = "<ul id = 'words-list' class = 'items'></ul>";
			this.elMix = "<input type = 'button' class = 'button-primary items-mix' value ='" + t("Mix") + "'>";
			this.elShowBy = "<select class = 'items-criteria'>" +
			"<option selected value = 'word'>" + t("By word") + "</option>" +
			"<option value = 'value'>" + t("By value") + "</option>" +
			"<option value = 'both'>" + t("By word or value") + "</option></select>";
			this.elToogle = "<input class = 'items-toogle-all' type = 'checkbox' checked>";
			
			this.allWordViews = [];
			
		},
			
		render: function() {

			var self = this;
			var ctrl = $(this.elCtrl).append($(this.elMix)).append($(this.elShowBy)).append($(this.elToogle));
			var chooseDict = $(this.elChooseDict);
			this.allDicts = [];
			
			$.get("/dicts", function(response) {
				self.allDicts = response;
				for(var i = 0; i < response.length; ++i) {
					var dict = response[i].name;
					chooseDict.append("<option value = '" + dict + "'>" + dict + "</option>");
				}
			});
			
			this.$el.append($("<label class='items-dict-label'>" + t("Choose dictionary") + "</label>").append(chooseDict));
			this.$el.append(ctrl);
			ctrl.hide();
			this.$el.append(this.elList);

			return this;
			
		},

		chooseDict: function() {
			
			var self = this;

			this.collection = new LearnList([], {
				
				url: function() {
					return "/dict/" + self.getDictsIdByName();
				},
				
				model: Word,
			});
			
			this.collection.fetch({
				success: function(collection, response, options) {

					self.renderList();
					
				},
				error: function(collection, response, options) {
					
				}
			});
			
		},

		renderList: function() {
			
			var self = this;
			
			this.$el.find(".items-options").show();
			this.$el.find(".items-dict").hide();
			this.$el.find(".items-dict-label").hide();
			_.each(this.collection.models, function(el, i, list) {
				var learnWordView = new LearnWordView({
					model: el,
					id: "learn-item" + i,
					collection: self.collection,
					showCriteria: (function() {
						var criteria = self.getCriteria();
						if (criteria == "word" || criteria == "value") return criteria
						else return this.randomNameOrValue();
					})(),
					isShow: false
				});
				self.allWordViews.push(learnWordView);
				this.append(learnWordView.render().$el);
			}, this.$el.find(".items"))
			
		},
		
		toogleAll: function(e) {
			
			_.each(this.allWordViews, function(el, i, list) {
				
				if (!e.target.checked)
					el.options.isShow = false
				else el.options.isShow = true;
				el.toogle();
				
			}, this.$el.find(".items"))
			
		},

		mix: function() {
				
			this.$el.find(".items").children().remove();
			this.allWordViews = _.shuffle(this.allWordViews);
			
			_.each(this.allWordViews, function(el, i, list) {
				el.$el.find(".item-value").removeClass("hide");
				el.$el.find(".item-name").removeClass("hide");
				el.options.isShow = false;
				this.append(el.render().$el);
			}, this.$el.find(".items"))
		},

		showByCriteria: function() {
			var self = this;
			
			this.$el.find(".items").children().remove();
			
			_.each(this.allWordViews, function(el, i, list) {
				el.$el.children().removeClass("hide");
				el.options.isShow = false;
				el.options.showCriteria = self.getCriteria();
				this.append(el.render().$el);
			}, this.$el.find(".items"))
		}
				
	});

	var ListEditView = ListView.extend({			// This constructor must get object with url property

		className: "list-wrapper",
				
		initialize: function(o) {
			
			var self = this;
			this.elList = "<ul id = 'items-list' class = 'items'></ul>";
			this.elAddOne = "<input type = 'button' id = 'adder' class = 'items-new button-primary' value ='" + t("New") + "'>";
			this.elFinder = "<input type = 'text' id = 'finder' class = 'items-find' placeholder ='" + t("Find...") + "'>";
			this.elMerge = "<input type = 'button' id = 'merger' class = 'items-merge button-primary' value ='" + t("Merge") + "'>";
			this.elIOptions = $("<div class = 'items-options'></div>");
			this.url = o.url;
			this.elIOptions.children().remove();
			this.$el.append(this.addHeader());
			this.elIOptions.append($(this.elFinder)).append($(this.elAddOne));
			this.$el.append(this.elIOptions).append(this.elList);
			if (this.addOtherElements) this.addOtherElements();
			this.otherOptions();

			if (o) {
				this.collection = new EditList([], {
					url: this.url,
					model: this.constructor
				});
			} else {
				AppError("", "some error", "view");
			}
			
			this.collection.on("change:name change:value", function(){
				self.render();
			});
			this.collection.on("remove", function(){
				self.render();
			});
			this.collection.on("sync", function() {
				self.render();
			});
			this.collection.fetch({
				success: function(c, r, o) {

				},
				error: function() {

				}
			});
			
		},

		render: function() {
			
			var self = this;
			
			this.$el.find(".items").children().remove();
			_.each(this.collection.models, function(elem, i, list) {
					var view = new self.viewConstructor({
						model: elem, 
						id: "item-" + i,
						collection: this.collection,
					});
					$(".items").append(view.render().$el);
				}, this);
			this.collection.on("add", function() {
				self.render();
			});

			return this;
		},
		
		addItem: function() {

			if (this.$el.find(".items").find(".item-is-creating").length > 0) {
				return AppError(t("You need finish creating previous item"), "", "", "warning")
			};
			var view = new this.createConstructor({collection: this.collection});
			var items = this.$el.find(".items").children()
			if (items.length === 0) this.$el.find(".items").append(view.render().$el)
			else this.$el.find(".items").first().prepend(view.render().$el);
						
		},

		find: function() {
			
			var self = this;
			var list = $(".items");
			var value = $("#finder").attr("value");
			list.children().remove();
			if (value.length >= 3) {
				var selectedItems = this.collection.find(value);
					_.each(selectedItems, function(elem, i, list) {
						var view = new self.viewConstructor({
							model: elem,
							id: "item-" + i,
							collection: self.collection,
						});
						this.append(view.render().$el);	
					}, list)
					
			} else {
				_.each(this.collection.models, function(elem, i, list) {
					var view = new self.viewConstructor({
						model: elem, 
						id: "item-" + i,
						collection: self.collection,
					});
					this.append(view.render().$el);
				}, list)
			}
		}

	});

	var WordsView = ListEditView.extend({
		
		id: "words",
		
		events: {
			"change #finder": "find",
			"click #adder": "addItem",
		},

		otherOptions: function() {
			
			this.constructor = Word;
			this.viewConstructor = WordView;
			this.createConstructor = CreateWordView;
			
		},

		addHeader: function() {

			return "<h3>" + t("Words") + "</h3>"

		}

	});

	var DictsView = ListEditView.extend({
		
		id: "dicts",
		
		events: {
			
			"change #finder": "find",
			"click #adder": "addItem",
			"click #merger": "merge"
		},

		addOtherElements: function() {
			
			// additional functionality. It is not available now.
			// this.$el.find(".items-options").append($(this.elMerge));

		},

		otherOptions: function() {
			
			this.constructor = Dict;
			this.viewConstructor = DictView;
			this.createConstructor = CreateDictView;
			
		},

		
		addHeader: function() {

			return "<h3>" + t("Dictionaries") + "</h3>"

		}
		
	});	

	var EntityView = Backbone.View.extend({
		
		tagName: "li",
		
		className: "item-wrapper",
		
		randomNameOrValue: function() {
			if (_.random(0, 1) === 0) return "name"
			else return "value";
		},
		
	});
		
	var LearnWordView = EntityView.extend({
		
		events: {
			"click .item-name": "toogle",
			"click .item-value": "toogle",
		},

		initialize: function(o) {
			this.wordDiv = "<div class = 'item-name learn'></div>";
			this.valueDiv = "<div class = 'item-value learn'></div>";
			this.options = o;
			
			this.$el.append(this.wordDiv).append(this.valueDiv);
			this.$el.find(".item-name").text(this.model.get("name"));
			this.$el.find(".item-value").text(this.model.get("value"));
			
		},
		
		render: function() {
			
			var criteria = $(".items-criteria").val();
			
			switch (criteria) {
			case "word": this.$el.find(".item-name").addClass("hide");
			break;
			case "value": this.$el.find(".item-value").addClass("hide");
			break;
			default: this.$el.find(".item-" + this.randomNameOrValue()).addClass("hide");
			break;
			}

			return this;
		},
		
		toogle: function() {
			
			var criteria = $(".item-dict").val();
			
			switch (this.options.showCriteria) {
			case "word": if (!this.options.isShow) {
					this.$el.find(".item-name").removeClass("hide");
					this.options.isShow = true;
				} else {
					this.$el.find(".item-name").addClass("hide");
					this.options.isShow = false;
				}
			break;
			case "value": if (!this.options.isShow) {
					this.$el.find(".item-value").removeClass("hide");
					this.options.isShow = true;
				} else {
					this.$el.find(".item-value").addClass("hide");
					this.options.isShow = false;
				}
			break;
			default: this.$el.find(".item-name").removeClass("hide");
				this.$el.find(".item-value").removeClass("hide");
				if (!this.options.isShow) {
					this.$el.find(".item" + this.randomNameOrValue()).removeClass("hide");
					this.options.isShow = true;
				} else {
					this.$el.find(".item-" + this.randomNameOrValue()).addClass("hide");
					this.options.isShow = false;
				}
			break;
			}
		}
						
	});

	var CreateItemView = EntityView.extend({		//gets collection, id and [model]

		events: {
			
			"click .ok": "ok",
			"click .cancel": "cancel"
		},

		initialize: function(o) {

			this.elName = "<input type = 'text' class = 'item-name' placeholder ='" + t("Enter name...") + "' require>";
			this.elValue = "<textarea placeholder ='" + t("Enter value...") + "' col = '15' row = '20' maxlength = '250'" +
			"class = 'item-value' require></textarea>";
			this.elOk = "<input type = 'button' class = 'ok button-primary' value ='" + t("OK") + "'>";
			this.elCancel = "<input type = 'button' class = 'cancel button-primary' value ='" + t("Cancel") + "'>";

			this.createModel();

		},

		render: function() {

			this.$el.addClass("item-is-creating");
			this.$el.append(this.elName + this.elValue + this.elOk + this.elCancel);
			if (this.addOtherElements) this.addOtherElements();
			this.$el.find(".item-name").val(this.model.get("name"));
			this.$el.find(".item-value").text(this.model.get(this.descriptionOrValue()));

			return this;
			
		},

		ok: function() {

			var self = this;
			var name = this.$el.find(".item-name").val();
			var value = this.$el.find(".item-value").val();
			var prop = {};
			prop.name = name;
			prop[this.descriptionOrValue()] = value;
			var clone = this.model.clone();

			clone.set(prop);
			if (!clone.isValid()) return;
			this.fillModel(prop);
			this.model.save({}, {wait: true,
				silence: true,
				success: function(model, response, options) {

					if (self.model.isNew()) self.model.set("_id", response._id);
					self.collection.add(self.model);
					
				},
				error: function(model, xhr, options) {

					AppError(t("It cannot save item. Please, try later."), "", "", "error");
					
				}
			});
			
		},

		cancel: function() {

			this.remove();
			this.collection.trigger("change:name change:value");
			
		}

	});

	var CreateWordView = CreateItemView.extend({			 

		addOtherElements: function() {

			var self = this;
			this.dicts = [];
			this.$el.find(".item-value").after("<select class = 'dict-select'></select>");
			this.addTranslateServicesElement();

			$.get("/dicts", function(resp, status) {

				if (status = "success") {
					_.each(resp, function(elem, i, list) {

						if (elem._id === this.model.get("dictId")) {
							this.$el.find(".dict-select").append("<option selected>" + elem.name + "</option>");
						} else {
							this.$el.find(".dict-select").append("<option>" + elem.name + "</option>");
						}
						
						this.dicts.push({name: elem.name, id: elem._id});

					}, self)
				}
				
			})

		},

		createModel: function() {

			if (!this.model) this.model = new Word();
						
		},

		addTranslateServicesElement: function() {

			var self = this;

			this.$el.find(".item-value").after("<a id = 'search-translate'>" + t("Search in web-services") + "</a>");
			this.$el.find("#search-translate").on("click", function(e) {

				if ($("#search-in-web").length !== 0) return false;
				var searchView	 = self.createSearchingDiv();
				$("body").append(searchView.render().$el);
				return false;

			});

		},

		createSearchingDiv: function() {

			var searchView = new SearchInWebView({parentView: this});
			return searchView;

		},

		fillModel: function(prop) {

			var self = this;
			var dict = (function() {

				return _.find(self.dicts, function(i) {

					return self.$el.find(".dict-select").val() == i.name;

				})
				
			})();
			prop.dictId = dict.id;
			this.model.set(prop, {silence: true});
			
		},

		descriptionOrValue: function() {

			return "value";

		}

	});

	var CreateDictView = CreateItemView.extend({

		createModel: function() {
			
			if (!this.model) this.model = new Dict();
			
		},
		
		fillModel: function(prop) {

			this.model.set(prop, {silence: true});
			
		},

		descriptionOrValue: function() {

			return "description";

		}
		
	});

	var ItemView = EntityView.extend({
		
		inArch: function() {

			this.model.inArchive();
			this.collection.remove(this.model);
			
		},
		
		remove: function() {

			this.model.remove();
			
		},

		edit: function() {

			var view;

			if ($(".items").find(".item-is-creating").length > 0) {
				return AppError("You need finish editing previous item", "", "", "warning")
			};

			this.$el.remove();
			view = new this.createConstructor({model: this.model, collection: this.collection, id: this.id});
			$(".items").first().prepend(view.render().$el);
			
		},

		initialize: function(o) {

			this.elItem = "<div class = 'item'><div class = 'item-name'>" +
			"</div><div class = 'item-value'></div></div>";
			this.elCtrl = "<div class = 'item-ctrl'>" +
			"<input type = 'button' class = 'item-in-arch button-primary' value ='" + t("In archive") + "'>" +
			"<input type = 'button' class = 'item-edit button-primary' value ='" + t("Edit") + "'>" +
			"<input type = 'button' class = 'item-remove button-primary' value ='" + t("Remove") + "'></div>";
			this.otherOptions();

		},

		render: function() {

			this.$el.append($(this.elItem)).append($(this.elCtrl));
			this.$el.find(".item-name").text(this.model.get("name"));
			this.$el.find(".item-value").text(this.model.get("value") || this.model.get("description"));
			
			return this;

		}
		
	});

	var WordView = ItemView.extend({
		
		id: null,
		
		model: null,
		
		collection: null,
		
		events: {
			"click .item-in-arch": "inArch",
			"click .item-edit": "edit",
			"click .item-remove": "remove",
		},

		otherOptions: function() {

			this.createConstructor = CreateWordView;
			
		}
		
	});

	var DictView = ItemView.extend({
		
		id: null,
		
		model: null,
		
		collection: null,
		
		events: {
			"click .item": "showWords",
			"click .item-in-arch": "inArch",
			"click .item-edit": "edit",
			"click .item-remove": "remove",
		},

		otherOptions: function() {

			this.createConstructor = CreateDictView;

		},

		showWords: function() {
			
			$("#memorizeit-app").children().remove();
			var wordsView = new WordsView({url: "/dict/" + this.model.get("_id")});
			$("#memorizeit-app").append(wordsView.$el);
			
		}
		
	});

	var SearchInWebView = Backbone.View.extend({

		tagName: "div",

		id: "search-in-web",

		events: {
			"click #google": "google",
			"click #promt": "promt",
			"click #yandex": "yandex",
			"click #ok": "ok",
			"click #cancel": "cancel"
		},

		initialize: function(o) {

			this.parentView = o.parentView;
			this.list = $("<ul>" +
			"<li><a href = '' id = 'google'>Google Translate</a><li>" +
			"<li><a href = '' id = 'promt'>Promt Online Translator</a><li>" +
			"<li><a href = '' id = 'yandex'>Яндекс.Переводчик</a><li>" +
			"</ul>").addClass("service-list");
			this.widget = $("<div id = 'widget'></div>");
			this.buttonOk = $("<input id = 'ok' type = 'button' value = '" + t("ok") + "'>").
			addClass("button-primary");
			this.buttonCancel = $("<input id = 'cancel' type = 'button' value = '" + t("Cancel") + "'>").
			addClass("button-primary");
			
		},

		render: function() {

			this.$el.append(this.list);
			this.$el.append(this.widget);
			this.$el.append(this.buttonOk).append(this.buttonCancel)
			this.widget.hide();
			return this;
			
		},

		google: function() {

			this.list.hide();
			this.widget.show();
			console.log("Using Google.");
			return false;
			
		},

		yandex: function() {

			this.list.hide();
			this.widget.show();
			console.log("Using Yandex.");
			return false;

		},

		promt: function() {

			this.list.hide();
			this.widget.show();
			console.log("Using Promt.");
			return false;

		},

		cancel: function() {

			this.remove();

		},

		ok: function() {

			this.handleOk();
			this.remove();

		},

		handleOk: function() {

			console.log("Inserting...");

		},

	});

	var app = new App;

})
