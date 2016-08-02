//  Copyright: Copyright 2013 Trimble Navigation Ltd.
//  License: All Rights Reserved.

// Global namespace. We need to define this before we import our L10N files.
var frontend = frontend || {};

var VERSION_STRING_3DW = 'b56fb52';
var VERSION_SUFFIX = VERSION_STRING_3DW === '' ? '' : '_' + VERSION_STRING_3DW;


/**
 * Cookie helper functions for use with L10N code.
 * @param {string} name The name of the cookie to get.
 * @param {string=} opt_default An optional string value to return if the
 *     cookie is unset.
 * @return {string} The cookie value.
 */
frontend.getCookie = function(name, opt_default) {
  var nameEq = name + '=';
  var cookie = document.cookie;
  var parts = cookie.split(/\s*;\s*/);
  for (var i = 0, part; part = parts[i]; i++) {
    // startsWith
    if (part.lastIndexOf(nameEq, 0) == 0) {
      return part.substr(nameEq.length);
    }
    if (part == name) {
      return '';
    }
  }
  return opt_default;
};


/**
 * Gets a query parameter value based on the variable name.
 * @param {string} name The parameter's name.
 * @return {string} The value, or undefined if there's no variable of that name.
 */
frontend.getQueryParamValue = function(name) {
  var queryString = window.location.search.substr(1);
  var parts = queryString.split('&');
  for (var i = 0; i < parts.length; i++) {
    var tuple = parts[i].split('=');
    if (tuple[0] == name && tuple.length > 1) {
      return decodeURIComponent(tuple[1]);
    }
  }
  return undefined;
};


/**
 * The user's currently-selected language code, such as 'es'.
 * @type {string|undefined}
 */
frontend.currentLanguage_;


/**
 * Gets the current language code, as passed on the query string as hl= or
 * as stored in an 'hl' cookie.
 * @return {string} The current language code, or 'en' if none is set.
 */
frontend.getCurrentLanguage = function() {
  if (!frontend.currentLanguage_) {
    frontend.currentLanguage_ =
        frontend.getQueryParamValue('hl') ||
        frontend.getCookie('hl', 'en') || 'en';
  }

  // Our english file is named en.js, but if we're handed en-US as the hl
  // param, we would try to load en-us.js, which doesn't exist. Handle this
  // edge case.
  if (frontend.currentLanguage_ &&
      frontend.currentLanguage_.toLowerCase() == 'en-us') {
    frontend.currentLanguage_ = 'en';
  }

  // If we were passed a value like 'zh-CN', lowercase to 'zh-cn'.
  frontend.currentLanguage_ =
      frontend.currentLanguage_.toLowerCase();
  return frontend.currentLanguage_;
};


/**
 * Given a date object, return an integer time stamp rounded to a sixty-second
 * boundary.
 * @param {Date} date The Date object to use.
 * @return {number} The timestamp.
 */
frontend.getSixtySecondTimeStamp = function(date) {
  return (Math.floor(date.getTime() / 1000 / 60) * 1000 * 60);
};

// Always add font awesome stylesheet to 3DWH.
document.write('<link rel="stylesheet" href="third-party/fa/css/' +
    'font-awesome.min.css" />');

// Using a different CSS file?
if (typeof CSS_FILE_3DW !== 'undefined') {
  document.write('<link rel="stylesheet" href="' +
      CSS_FILE_3DW + VERSION_SUFFIX + '.css" />');
} else {
  document.write('<link rel="stylesheet" href="css/warehouse' +
      VERSION_SUFFIX + '.css" />');

  var isSketchupClient = false;

  if (window.navigator && window.navigator.userAgent &&
      window.navigator.userAgent.toLowerCase().indexOf('sketchup') != -1) {
    isSketchupClient = true;
  }

  if (isSketchupClient) {
    document.write('<link rel="stylesheet" href="css/warehouse-in-client' +
        VERSION_SUFFIX + '.css" />');
  }

  // IE8 and below check. If the agent contains "Trident/7" or greater,
  // it's IE11.
  var userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('msie') && parseInt(userAgent.split('msie')[1]) <= 8 &&
      parseInt(userAgent.split('trident/')[1]) < 7) {
    document.write('<link rel="stylesheet" href="css/warehouse-ie8' +
        VERSION_SUFFIX + '.css" />');
  }
}

if (frontend.getCurrentLanguage() != 'en') {
  // Our language files use all lower case for names.
  document.write('<script src="js/l10n/' +
      frontend.getCurrentLanguage().toLowerCase() + '.js?' +
      window.VERSION_STRING_3DW + '"></script>');
}

// Include Raven JS error recorder to log to Sentry.
// Must be loaded before compiled.js.
document.write('<script src="js/lib/raven.min.js"></script>');

// Include the rest of our js code.
if (document.cookie.indexOf('debugMode=true') > -1) {
  document.write('<script src="/closure/goog/base.js"></script>');
  document.write('<script src="/nodejs/node_deps.js"></script>');
  document.write('<script src="requires.js"></script>');
} else {
  document.write('<script src="/src/compiled' + VERSION_SUFFIX + '.js"></script>');
}

if (window.location.href.indexOf('maintenance.html') == -1) {
  var sixtySecondTimeStamp = frontend.getSixtySecondTimeStamp(new Date());
  document.write('<script src="js/maintenance.js?' + sixtySecondTimeStamp +
      '"></script>');
}
