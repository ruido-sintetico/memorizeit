    /**
     * This module contains class Cookie and its methods
     * @module cookie.js
     * @author Ivan A. Semenov
     */

    /**
     * Constructor Cookie
     * @class
     * @param {string} name - name of cookie
     * @param {string} value
     * @param {object} options - {max-age, domain, path, secure}
     * @return {cookie} Cookie instance
     */

function Cookie(name, value, options) {

    /**
     * @private
     */

    /**
     * Validate object options
     * @function validateCookieOptions
     * @private
     * @param {object} options
     * @return {boolean}
     */

    var validateCookieOptions = function (options) {

        if (!options) {
        new AppError("", "Parameter options is undefined ", "Cookie");
        return false;
        }

        if (typeof options.expire !== "number" && options.expire !== undefined) {
        new AppError("", "Parameter options.expire is wrong ", "Cookie");
            return false;
        }
        if (typeof options.domain !== "string" && options.domain !== undefined) {
        new AppError("", "Parameter options.domain is wrong ", "Cookie");
            return false;
        }
        if (typeof options.path !== "string" && options.path !== undefined) {
        new AppError("", "Parameter options.path is wrong ", "Cookie");
        return false;
        }
        if (typeof options.secure !== "boolean" && options.secure !== undefined){
        new AppError("", "Parameter options.secure is wrong ", "Cookie");
            return false;
        }
        return true;
    }

    var optionsOK = validateCookieOptions(options);
        this.name = name;
        this.value = value;
        this.expire = optionsOK ? options.expire : undefined;
        this.domain = optionsOK ? options.domain : undefined;
        this.path = optionsOK ? options.path : undefined;
        this.secure = optionsOK ? options.secure : undefined;


    /**
     * Set Cookie property
     * @method set
     * @public
     * @param {object} options - {max-age, domain, path, secure}
     * @return {object|boolean} Cookie or false if there is error
     */

    this.set = function(options) {
        if (typeof options == "object") {
            if (validateCookieOptions(options)){
                if (typeof options.name !== "string") {
                    new AppError("", "Parameter options.name is wrong ", this);
                    return false;
                }
                if (typeof options.value !== "string") {
                    new AppError("", "Parameter options.value is wrong ", this);
                    return false;
                }
                this.name = options.name;
                this.value = options.value;
                this.expire = options.expire;
                this.domain = options.domain;
                this.path = options.path;
                this.secure = options.secure;
            } else new AppError("", "Parameter options is not correct", this);
        } else new AppError("", "Parameter options is not object", this);
        return this;
    };

    /**
     * Get Cookie property
     * @method get
     * @public
     * @param {string} prop - needed property
     * @return {mix} Cookie property
     */

    this.get = function(prop) {
        return this[prop]
    };

    /** Write Cookie into document.cookie
     * @method send
     * @public
     * @return {object} Cookie
     */

    this.send = function() {
        var updatedCookie = this.name + "=" + encodeURIComponent(this.value) + "; " +
            (this.expire ? ("max-age=" + this.expire + "; ") : "") +
            (this.domain ? ("domain=" + this.domain + "; ") : "") +
            (this.path ? ("path=" + this.path + "; ") : "") +
            (this.secure ? "secure" : "");
        document.cookie = updatedCookie;

        return this;
    }
    }

    /** Allows to take cookie value from document.cookie
     * @method Cookie.getCookie
     * @static
     * @public
     * @param {string} prop - cookie name
     * @return {string|undefined} - cookie value or undefined
     */

    Cookie.getCookie = function(prop) {
    var cookie;
    var cookies = document.cookie.split("; ");
    for (var i = 0; i < cookies.length; i++) {
        cookie = cookies[i].split("=");
        if (cookie[0] === prop) return decodeURIComponent(cookie[1]);
    }
    new AppError("", "There is no cookie with given name.", document);
}
