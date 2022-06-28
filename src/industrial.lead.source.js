/**
 * System for tracking lead visitor sources in cookies
 * Stores inbound utm parameters gathered from url or inferred from rules
 *
 */

/**
 * Prototype constructor
 * @param {object} document document object
 * @param {string} domain
 * @constructor
 */
IndustrialLeadSource = function(document, domain) {
    this.document = document;
    this.cookieNameSpace = "ils.";
    this.domain = domain || document.location.hostname;
    this.params = this.getURLParameters(this.document.location.search);
    this.referrer = this.getReferrer();
    this.utmParams = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    this.unkownSource = "Direct";
    this.unkownMedium = "other";
    this.version = "2.1.7";
    this.yearInMiuntes = 60*24*365;
    var utmsPresent = this.areUtmParamsPresent(this.params);
    //if we've already stored utm's and there are no new ones then do nothing
    if (this.getCookie("visit") && !utmsPresent) {
        return;
    }

    
    // if there are utm params store those in a cookie always
    if (utmsPresent) {
        this.handleUtmParams(this.params);
    // handle referral traffic
    } else if (this.isRealReferrer(this.referrer)) {
        this.handleReferrer(this.referrer);
    // handle other/direct traffic
    } else {
        if(!this.hasStoredValue('utm_source') && !this.hasStoredValue('utm_medium')){
            this.unSetAllCookies();
            // can't really id traffic source so set to unkownSource
            this.setCookie("utm_source", this.unkownSource);
        }
    }
    this.setCookie("visit", true, 30);
};

/**
 * Get stored  cookie values for utm param
 *
 * @param {string} key
 */
IndustrialLeadSource.prototype.hasStoredValue = function(key) {
   var values = this.getStoredValues();

   return values[key] ? true : false;
};


/**
 * Set appropriate cookie values for utm params 
 *
 * @param {object} params object
 */
IndustrialLeadSource.prototype.handleUtmParams = function(params) {
    this.unSetAllCookies();
    for (var i = 0; i < this.utmParams.length; i++) {
        var utmParam = this.utmParams[i];
        if (params.has(utmParam)) {
            this.setCookie(utmParam, params.get(utmParam));
        }
    }
};

/**
 * Set appropriate cookie values for referrer
 *
 * @param {string} referrer
 */
IndustrialLeadSource.prototype.handleReferrer = function(referrer) {
    this.unSetAllCookies();
    if (this.isOrganic(referrer)) {
        this.setCookie("utm_medium", "organic");
        this.setCookie("utm_source", referrer);
    } else {
        this.setCookie("utm_source", referrer);
        this.setCookie("utm_medium", "referral");
    }
};

/**
 * Check if referrer is from search engine of note
 *
 * @param string referrer
 * @returns boolean
 */
IndustrialLeadSource.prototype.isOrganic = function(referrer) {
    var organics = ["google.", "bing.com", "yahoo.com", "about.com", "ask.com", "duckduckgo.com"];

    for (var i = 0; i < organics.length; i++) {
        var searchEngine = organics[i];
        if (referrer.indexOf(searchEngine) !== -1) {
            return true;
        }
    }
    return false;
};

IndustrialLeadSource.prototype.unSetAllCookies = function() {
    this.unSetCookie("utm_source");
    this.unSetCookie("utm_medium");
    this.unSetCookie("utm_campaign");
    this.unSetCookie("utm_content");
    this.unSetCookie("utm_term");
    this.unSetCookie("visit");
};

/**
 * Parse query string params to object
 *
 * @param string queryString
 * @returns object
 */
IndustrialLeadSource.prototype.getURLParameters = function(queryString) {
    return new URLSearchParams(queryString);
};

/**
 *  Get referrer from document with url param fallback
 * @returns string referrer
 */
IndustrialLeadSource.prototype.getReferrer = function() {
    let referrer = '';
    if (this.params.has('ils_referrer')) {
        referrer = this.params.get('ils_referrer');
    }
    // this is special, used in testing and some edge use cases
    if (referrer === "none") {
        referrer = "";
    }
    return referrer;
};

/**
 * Check if utm params are preesent
 *
 * @param object params object
 * @returns boolean
 */
IndustrialLeadSource.prototype.areUtmParamsPresent = function(params) {
    let has = false;
    this.utmParams.forEach(utmParam => {
        if(params.has(utmParam)){
            has =  true;
        }
    });
    return has;
};

/**
 * Set cookie value. Use expiryMinutes of 0 to create a browser session cookie that expires when window is closed
 *
 * @param {string} name - the name of the cookie
 * @param {string} cvalue - the value of he cookie
 * @param {int} expiryMinutes - cookie expiration time in minutes. Wil default to 1 year
 */
IndustrialLeadSource.prototype.setCookie = function(name, value, expiryMinutes) {
    var d = new Date();
    var name = this.cookieNameSpace + name;
    expiryMinutes = typeof expiryMinutes !== "undefined" ? expiryMinutes : this.yearInMiuntes;
    d.setTime(d.getTime() + expiryMinutes * 60 * 1000);
    var expires = "expires=" + d.toUTCString() + ";";
    if (expiryMinutes === 0) {
        expires = "";
    }
    this.document.cookie = name + "=" + value + ";" + expires + "path=/";
};

/**
 * Remove cookie value
 *
 * @param {string} cname
 * @param {string} cvalue
 * @param {int} exdays
 */
IndustrialLeadSource.prototype.unSetCookie = function(cname, cvalue, exdays) {
    var name = this.cookieNameSpace + cname;
    this.document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

/**
 * Get cookie value
 *
 * @param {string} cookie name/key
 * @returns value or null
 */
IndustrialLeadSource.prototype.getCookie = function(name) {
    var name = this.cookieNameSpace + name + "=";
    var decodedCookie = decodeURIComponent(this.document.cookie);
    var ca = decodedCookie.split(";");

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

/**
 * Remove protocol from url
 *
 * @param {string} href
 * @returns string   url without protocol
 */
IndustrialLeadSource.prototype.removeProtocol = function(href) {
    return href.replace(/.*?:\/\//g, "");
};

/**
 * Get stored utm data
 * @returns {object}
 */
IndustrialLeadSource.prototype.getStoredValues = function() {
    var values = {};
    values.utm_source = this.getCookie("utm_source");
    values.utm_medium = this.getCookie("utm_medium");
    values.utm_campaign = this.getCookie("utm_campaign");
    values.utm_term = this.getCookie("utm_term");
    return values;
};

IndustrialLeadSource.prototype.isNotNullOrEmpty = function(string) {
    return string !== null && string !== "";
};
IndustrialLeadSource.prototype.isRealReferrer = function(referrer) {
    var isReferral = false;
    if (referrer && referrer.indexOf(this.domain) === -1) {
        isReferral = true;
    }
    return isReferral;
};
