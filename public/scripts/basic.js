/**
 * This module contains basic logic for whole site
 * @module basic.js
 * @author Ivan A. Semenov
 */

$(document).ready(function() {

    var cookieLang = new Cookie("lang", Cookie.getCookie("lang"), {});
    var userPass = Cookie.getCookie("password");
    var userName = Cookie.getCookie("name");
    var cookieAuthPass = new Cookie();
    var cookieAuthName = new Cookie();

    // Create forms

    var formDiv = $("div#enter-form");
    var currentForm;

    // Create forms element

    var loginLabel = $("<label>" + t("Type login") + "</label>");
    var loginElem = $("<input type = 'text' name = 'login'>");

    loginElem[0].isValid = function() {
		
        if (this.value.length > 15) {
            AppError(t("Too many login length."), "", loginElem);
            return false;
        } else if (/\W+/.test(this.value)) {
            AppError(t("Use only letters and digits."), "", loginElem);
            return false;
        } else return true;
        
    }

    var passLabel = $("<label>" + t("Type password") + "</label>");
    var passwordElem = $("<input type = 'password' name = 'password'>");

    passwordElem[0].isValid = function() {
		
        if (this.value.length > 15) {
            AppError(t("Too many password length."), "", passwordElem);
            return false;
        } else if (/\W+/.test(this.value)) {
            AppError(t("Use only letters and digits."), "", passwordElem);
            return false;
        } else return true;
        
    }

    var emailLabel = $("<label>" + t("Email") + "</label>");
    var emailElem = $("<input type = 'email' name = 'email'>");

    emailElem[0].isValid = function() {
		
        if (this.value.length > 50) {
            AppError(t("Too many email length."), "", emailElem);
        } else if (/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(this.value)) {
            return true;
        } else AppError(t("Uncorrect email."), "", passwordElem);
        
    }

    var linkReg = $("<a href = '' id = 'registration'>" + t("Registration") + "</a>").
    on("click", function(){
		
        currentForm.remove();
        currentForm = makeRegForm();
        currentForm.insert(formDiv);
        return false;
        
    });

    var linkRem = $("<a href = '' id = 'remember'>" + t("Remember") + "</a>").
    on("click", function(){
		
        currentForm.remove();
        currentForm = makeRemForm();
        currentForm.insert(formDiv);
        return false;
        
    });

    var linkAuth = $("<a href = '' id = 'enter'>" + t("Enter") + "</a>").
    on("click", function() {

        currentForm.remove();
        currentForm = makeAuthForm();
        currentForm.insert(formDiv);
        return false;

    });

    // Validate current form

    var submitElem = $("<input type = 'submit' class = 'button-primary auth-sub' value = " + t("Submit") + ">").
    on("click", function(e) {
        currentForm.validate();
        return false;
    });

    // Enter form

    var authForm = new Forms("<form id = 'auth' action = '/auth/login' name = 'auth' class = 'auth-forms'></form>").
    // is called after all elements handlers
    on("submit", function(e){
		
        var q = "login=" + document.auth.login.value + "&password=" + document.auth.password.value;
        var XHR = new XMLHttpRequest();

        XHR.open("GET", "/auth/login?" + q);
        XHR.onreadystatechange = function() {
			
			var response = JSON.parse(XHR.responseText);
            if (XHR.status == 200 && XHR.readyState == 4) {
                
                if (response.success == true) {
                    cookieAuthPass.set({name: "password", value: document.auth.password.value, expire: 3600000}).send();
                    cookieAuthName.set({name: "name", value: document.auth.login.value, expire: 3600000}).send();
                    document.location.reload();
                } else {
					AppError(t(response.message), "", null);
				}
            }
        }
        XHR.setRequestHeader("Content-Type", "text/plain");
        XHR.send();
        return false;
    });

    var makeAuthForm = function() {
        authForm.addElement(loginLabel[0]).
        addElement(loginElem[0]).
        addElement(passLabel[0]).
        addElement(passwordElem[0]).
        addElement(submitElem[0]).
        addElement(linkReg[0]).
        addElement(linkRem[0]);
        return authForm;
    }

    // Remember form

    var remForm = new Forms("<form id = 'rem' action = '/auth/remember' name = 'rem' class = 'auth-forms'></form>").
    // is called after all elements handlers
    on("submit", function(e) {
		
        var q = "email=" + document.rem.email.value;
        var XHR = new XMLHttpRequest();

        XHR.open("GET", "/auth/remember?" + q);
        XHR.onreadystatechange = function() {

			var response = JSON.parse(XHR.responseText);
            if (XHR.status == 200 && XHR.readyState == 4) {
                if (response.success == false) {
					AppError(t(response.message), "", null, "error");
				} else {
					AppError(t(response.message), "", null, "message");
				}
            }
        }
        XHR.setRequestHeader("Content-Type", "text/plain");
        XHR.send();
        return false;
    });

    var makeRemForm = function() {
        remForm.addElement(emailLabel[0]).
        addElement(emailElem[0]).
        addElement(submitElem[0]).
        addElement(linkReg[0]).
        addElement(linkAuth[0]);
        return remForm;
    }

    // Registration form

    var regForm =  new Forms("<form id = 'reg' action = '/auth/register' name = 'reg' class = 'auth-forms'></form>").
    // is called after all elements handlers
    on("submit", function(e) {

        var q = "email=" + document.reg.email.value + "&login=" + document.reg.login.value +
        "&password=" + document.reg.password.value;
        var XHR = new XMLHttpRequest();
        
        XHR.open("GET", "/auth/register?" + q);
        XHR.onreadystatechange = function() {

			var res = JSON.parse(XHR.responseText);
            if (XHR.status == 200 && XHR.readyState == 4) {
			
				if (res.success === true){
					AppError(t("You have registered. Message have sent on your email.") + "\n" +
					t("Page will reload after 3 second"), "", null, "message");
					setTimeout(function() {
						document.location.reload();
					}, 3000);
				} else {
					AppError(t(res.message), "", null, "error");
				}

			}

        }
        XHR.send();
        return false;
    });

    var makeRegForm = function() {
        regForm.addElement(loginLabel[0]).
        addElement(loginElem[0]).
        addElement(passLabel[0]).
        addElement(passwordElem[0]).
        addElement(emailLabel[0]).
        addElement(emailElem[0]).
        addElement(submitElem[0]).
        addElement(linkRem[0]).
        addElement(linkAuth[0]);
        return regForm;
    }

    currentForm = makeAuthForm();
    authForm.insert(formDiv)

    // Cookies auto prolongation

    if (userPass) {
        cookieAuthPass.set({name: "password", value: userPass, expire: 3600000}).send();
    }

    if (userName) {
        cookieAuthName.set({name: "name", value: userName, expire: 3600000}).send();
    }

    // Attach handlers to language icons

    $("#ruicon").click(function() {
        cookieLang.set({name: "lang", value:"ru", expire: 10 })
        cookieLang.send();
        document.location.reload();
    })

    $("#enicon").click(function() {
        cookieLang.set({name: "lang", value:"en", expire: 10})
        cookieLang.send();
        document.location.reload();
    })

    // Attach handlers to rAside menu

    if (userPass && userName) {

		$("#logout").on("click", function() {
			console.log("click logout");
			cookieAuthName.set({name: "name", value: "", expire: 0}).send();
			cookieAuthPass.set({name: "password", value: "", expire: 0}).send();
			document.location.reload();
			return false;
		})
		$("#personal-menu").on("click", function() {
			console.log("click personal-menu")
		})
		$(".personal-menu-items").on("click", function() {
			console.log("click personal-menu-items")
		})
    }
})
