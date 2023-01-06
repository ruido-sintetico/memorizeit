/**
 * This module consists logic for profile page
 *
 */

$(function() {

	$(".archives").hide();
	$(".statistics").hide();
	$(".archive-dicts").hide();
	$(".archive-words").hide();
	$(".statistic-dicts").hide();
	$(".statistic-words").hide();
	
	$.getJSON("/user/archivedicts", function(res) {

		$(".archive-dicts").append("<ul class='archive-dicts-list'></ul>");
		for (var i = 0; i < res.length; ++i) {
			$(".archive-dicts-list").append("<li><form action='/archive/dict/" + res[i]._id + "' method='post'>" +
			"<div class='item-name'>" + res[i].name + "</div>" +
			"<div class='item-value'>" + res[i].description + "</div>" +
			"<input class='button-primary' type='submit' value=" + t("Restore") + "></form></li>");
		}
		
	});

	$.getJSON("/user/archivewords", function(res) {

		$(".archive-words").append("<ul class='archive-words-list'></ul>");
		for (var i = 0; i < res.length; ++i) {
			$(".archive-words-list").append("<li><form action='/archive/word/" + res[i]._id + "' method='post'>" +
			"<div class='item-name'>" + res[i].name + "</div>" +
			"<div class='item-value'>" + res[i].value + "</div>" +
			"<input class='button-primary' type='submit' value=" + t("Restore") + "></form></li>");
		}
		
	});

	$.getJSON("/user/statdict", function(res) {

		var tests, wTests, table;
		$(".statistic-dicts").append("<table id = 'statistic-dict-table'></table>");
		table = $("#statistic-dict-table").append("<tr><th>" + t("Dictionary") + "</th>" +
		"<th>" + t("Tests") + "</th>" +
		"<th>" + t("Wrong tests") + "</th></tr>");
		for (var i = 0; i < res.length; ++i) {
			tests = (res[i].tests === null) ? 0 : res[i].tests;
			wTests = (res[i].wrongTests === null) ? 0 : res[i].wrongTests;
			$("#statistic-dict-table").append("<tr><td>" + res[i].name + "</td>" +
			"<td>" + tests + "</td>" +
			"<td>" + wTests + "</td></tr>");
		}
		
	});

	$.getJSON("/user/statword", function(res) {

		var tests, wTests, table;
		$(".statistic-words").append("<table id = 'statistic-word-table'></table>");
		table = $("#statistic-word-table").append("<tr><th>" + t("Words") + "</th>" +
		"<th>" + t("Tests") + "</th>" +
		"<th>" + t("Wrong tests") + "</th></tr>");
		for (var i = 0; i < res.length; ++i) {
			tests = (res[i].tests === null) ? 0 : res[i].tests;
			wTests = (res[i].wrongTests === null) ? 0 : res[i].wrongTests;
			$("#statistic-word-table").append("<tr><td>" + res[i].name + "</td>" +
			"<td>" + tests + "</td>" +
			"<td>" + wTests + "</td></tr>");
		}
		
	});

	$.get("/user/predict", function(res) {
		
		$(".select-predicts").append(res);
		
	});

	$("#submit-choice").on("click", function(e){

		var value = $(".select-predicts").val();
		var action = $("#predicts-form").attr("action");
		$("#predicts-form").attr("action", action + "/" + value)
		return true;

	})

	$(".headers.arch").on("click", function(e) {

		$(".archives").toggle();
		$(e.target).toggleClass("expanded");

	});

	$(".headers.stat").on("click", function(e) {

		$(".statistics").toggle();
		$(e.target).toggleClass("expanded");

	});

	$(".subheaders.arch-dicts").on("click", function(e) {

		$(".archive-dicts").toggle();
		$(e.target).toggleClass("expanded");

	});

	$(".subheaders.arch-words").on("click", function(e) {

		$(".archive-words").toggle();
		$(e.target).toggleClass("expanded");

	});

	$(".subheaders.stat-dicts").on("click", function(e) {

		$(".statistic-dicts").toggle();
		$(e.target).toggleClass("expanded");

	});

	
	$(".subheaders.stat-words").on("click", function(e) {

		$(".statistic-words").toggle();
		$(e.target).toggleClass("expanded");

	});

	$("#change-pass").on("click", function(e) {

		if ($("#pass-restore").length !== 0) return;

		$("#account-data").append("<form id='pass-restore' method='post'" +
		"action='/passrestore'></form>");
		$("#pass-restore").append("<input type='password' placeholder='" + t("New password") +
		"' name='newpass' class='restore-pass'>");
		$("#pass-restore").append("<input type='password' placeholder='" + t("New password again") +
		"' name='newpassagain' class='restore-pass'>");
		$("#pass-restore").append("<input type='button' value='" + t("Change") +
		"' class='pass-change button-primary'>");
		$("#pass-restore").append("<input type='button' value='" + t("Cancel") +
		"' class='pass-cancel button-primary'>");

		$(".pass-cancel").on("click", function(e) {

			$("#pass-restore").remove();

		});

		$(".pass-change").on("click", function() {

			var form = $("#pass-restore");
			var oldPass = form[0].newpass.value;
			var oldPassAgain = form[0].newpassagain.value;

			if (oldPass !== oldPassAgain) {
				AppError(t("Passwords are not same."), "", "", "error");
				return false;
			}
			if (oldPass.length > 15) {
				AppError(t("Password so long."), "", "", "error");
				return false;
			}
			if (oldPass.length === 0) {
				AppError(t("Password is empty."), "", "", "error");
				return false;
			}
			if (oldPass.match(/^[A-Za-z0-9_-]+$/) === null) {
				AppError(t("Use letters, digit, - and _"), "", "", "error");
				return false;
			};

			$.getJSON(form[0].action + "/" + oldPass, function(res, st, xhr) {

				var className = res.success ? "message" : "error";

				if (res.success === true) {
					$("#pass-restore").remove();
				}
				AppError(t(res.message), "", "", className);

			});

			return false;

		});
		

	});

})
