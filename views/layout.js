/**
 * Page content logic is here.
 * Module returns the object with var: value pairs
 */

/**
 * Dependencies
 */

module.exports = function(req) {

    /**
     * Common var
     */

    var e = {

    };

    //that property defines to create or not to create highlighted block
    e.hlActive = false;

    e.year = new Date().getFullYear();

    if (req.cookies.lang) e.lang = req.cookies.lang
    else e.lang = "en";
    
    // Var to store highlighted msg
    var hl = [];
    
    /**
     * var to store information about user
     */

    function isAuthorized() {
        if (req.cookies.name && req.cookies.password) {
            //заглушка
            return true;
        } else return false;
    }

    var user = {};
    user.authorized = isAuthorized();
    user.greeting = "Wellcome";
    user.name = req.cookies.name;
    user.id = req.app.user;
    user.email = req.app.userProfile ? req.app.userProfile.email : "";

    e.user = user;

    /**
     * Profile
     */

	profile = {};

    profile.needAuth = "You need authorize to look this page";
	profile.changePass = "Change password";
	profile.addDicts = "Add dictionaries";
	profile.archive = "Archive";
	profile.statistic = "Statistics";
	profile.addImage = "Add ava";
	profile.dicts = "Dictionaries";
	profile.words = "Words";
	profile.choose = "Choose";
	
    e.profile = profile;

    /**
     * Html
     */

    /**
     * Head
     */

    var head = {};

    head.slogan = "site that helps to learn forein languages";
    head.siteName = "Memorize it!";

    switch (req.path) {

    case "/index": head.title = "Main";
    break;

    case "/profile": head.title = "Personal room";
    break;

    case "/helper": head.title = "Exerciser";
    break;

    case "/help": head.title = "Learning";
    break;

    default: head.title = "";
    break;

    }

    head.meta = {};

    head.meta.description = "This site helps learn forein words!";
    head.meta.keywords = "Forein language, learn, study, forein words";

    e.head = head;

    /**
     * Body
     */

    /**
     * Header
     */
    var header = {};

    header.logoAlt = "Logo";
    header.siteName = "Memorize it!";

    e.header = header;

    /**
     * Navigation
     */

    var nav = {}

    nav.index = "Main";
    nav.profile = "Personal room";
    nav.help = "Learning"

    e.nav = nav

    /**
     * Highlighted
     */

    e.highlighted = hl;

    function highlight(msg) {
        e.hlActive = true;
        hl.push(msg);
    }

    /**
     * Left sidebar
     */
    var lAside = {};

    e.lAside = lAside;

    /**
     * Right sidebar
     */

    var rAside = {};

    rAside.submitValue = "Enter";
    rAside.login = "Login";
    rAside.pas = "Password";
    rAside.remember = "Remember the password";
    rAside.register = "Registration";
    rAside.learn = "Learn";
    rAside.test = "Test";
    rAside.words = "Words";
    rAside.dictionaries = "Dictionaries";
    rAside.logOut = "Log out";


    e.rAside = rAside;

    /**
     * Content
     */

    var content = {};

    switch (req.path) {

    case "/index": content.header = "";
    break;

    case "/profile": content.header = "Personal room";
    break;

    case "/helper": content.header = "Exerciser";
    break;

    case "/help": content.header = "Learning";
    break;

    default: content.header = "";
    break;

    }

    e.content = content;

    /**
     * Footer
     */

    var footer = {};

    footer.license = "License";
    footer.about = "About";
    footer.contacts = "Contacts";

    e.footer = footer;

    /**
     * Underground
     */

    var underground = {};

    e.underground = underground;

    return e;
}
