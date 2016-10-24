/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _global = __webpack_require__(1);

	var _browser = __webpack_require__(2);

	var _browser2 = _interopRequireDefault(_browser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var CommonController = {
	    init: function init() {
	        _browser2.default.addUserAgentAttributeToHtmlTag();
	        _browser2.default.fixFlexboxIndicatorClass();

	        this._initElements();
	        this._initEvents();
	    },
	    _initElements: function _initElements() {
	        this.$window = $(window);

	        this.$siteHeader = $("#container").children("header");
	        this.$menuBtn = this.$siteHeader.find("article");
	        this.$menu = this.$siteHeader.find("#menu");
	        this.$contentOverlayWhenMenuOpen = this.$siteHeader.find("#content-overlay-when-menu-open");
	    },
	    _initEvents: function _initEvents() {
	        this.$window.scroll(_.debounce(this._onScroll.bind(this), 15));
	        this._initMenuEvents();
	    },
	    _initMenuEvents: function _initMenuEvents() {
	        this.$menuBtn.click(this._toggleMenu.bind(this));
	        this.$contentOverlayWhenMenuOpen.click(this._toggleMenu.bind(this));
	    },
	    _onScroll: function _onScroll() {
	        var isScrolledDownEnough = this.$window.scrollTop() > 0;

	        this.$siteHeader.toggleClass("scrolled-down", isScrolledDownEnough);
	    },
	    _toggleMenu: function _toggleMenu() {
	        if (this.$siteHeader.hasClass("menu-open")) {
	            TweenLite.to(this.$menu, _global.animationDurations.short, {
	                opacity: 0,
	                onComplete: function () {
	                    this.$menu.css({ display: "none" });
	                }.bind(this)
	            });

	            this.$siteHeader.removeClass("menu-open");
	        } else {
	            this.$menu.css({ display: this._getMenuDisplayClass(), opacity: 0 });
	            TweenLite.to(this.$menu, _global.animationDurations.short, { opacity: 1 });

	            this.$siteHeader.addClass("menu-open");
	        }
	    },
	    _getMenuDisplayClass: function _getMenuDisplayClass() {
	        var $html = $("html");

	        if ($html.hasClass("no-flexbox") || _.includes($html.data("useragent"), "OS 7_")) {
	            return "block";
	        }

	        return "flex";
	    }
	};

	Object.create(CommonController).init();

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var animationDurations = exports.animationDurations = {
	    short: 0.2,
	    medium: 0.5
	};

	var httpStatusCodes = exports.httpStatusCodes = {
	    ok: 200,
	    created: 201,
	    noContent: 204,
	    signInIncorrectCredentials: 230
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Browser = {
	    regexOfUserAgentsNotSupportingFlexbox: ["OS 8_", "OS 7_", "OS 6_", "OS 5_", "OS 4_"],

	    cssRules: function cssRules() {
	        if (this.allCssRules) {
	            return this.allCssRules;
	        }

	        this.allCssRules = {};

	        var styleSheets = document.styleSheets;

	        for (var i = 0; i < styleSheets.length; i++) {
	            var styleSheet = styleSheets[i];
	            var styleSheetRules = styleSheet.cssRules || styleSheet.rules; // .rules for IE, .cssRules for other browsers

	            if (styleSheetRules) {
	                for (var j = 0; j < styleSheetRules.length; j++) {
	                    var rule = styleSheetRules[j];

	                    this.allCssRules[rule.selectorText] = rule.style;
	                }
	            }
	        }

	        return this.allCssRules;
	    },
	    getCssRule: function getCssRule(selector, property) {
	        return this.cssRules()[selector].getPropertyValue(property);
	    },
	    getUrlQueryStrings: function getUrlQueryStrings() {
	        var queryDict = {};

	        location.search.substr(1).split("&").forEach(function (item) {
	            queryDict[item.split("=")[0]] = item.split("=")[1];
	        });
	        return queryDict;
	    },
	    addUserAgentAttributeToHtmlTag: function addUserAgentAttributeToHtmlTag() {
	        document.documentElement.setAttribute("data-useragent", navigator.userAgent);
	    },
	    isMediumScreen: function isMediumScreen() {
	        var content = window.getComputedStyle(document.querySelector("body"), ":after").getPropertyValue("content");

	        // In some browsers like Firefox, "content" is wrapped by double-quotes, that's why doing "return content === "GLOBAL_MEDIUM_SCREEN_BREAKPOINT" would be false.
	        return _.contains(content, "GLOBAL_MEDIUM_SCREEN_BREAKPOINT");
	    },
	    isLargeScreen: function isLargeScreen() {
	        var content = window.getComputedStyle(document.querySelector("body"), ":after").getPropertyValue("content");

	        return _.contains(content, "GLOBAL_LARGE_SCREEN_BREAKPOINT");
	    },
	    isSmallScreen: function isSmallScreen() {
	        return !this.isMediumScreen() && !this.isLargeScreen();
	    },
	    saveInLocalStorage: function saveInLocalStorage(key, value) {
	        if (Modernizr.localstorage && value) {
	            localStorage.setItem(key, JSON.stringify(value));
	        }
	    },
	    getFromLocalStorage: function getFromLocalStorage(key) {
	        if (Modernizr.localstorage) {
	            return JSON.parse(localStorage.getItem(key));
	        }
	        return null;
	    },
	    removeFromLocalStorage: function removeFromLocalStorage(key) {
	        if (Modernizr.localstorage) {
	            localStorage.removeItem(key);
	        }
	    },
	    clearLocalStorage: function clearLocalStorage() {
	        if (Modernizr.localstorage) {
	            localStorage.clear();
	        }
	    },
	    isIOS: function isIOS() {
	        return (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)
	        );
	    },
	    isWindows: function isWindows() {
	        return navigator.platform === "Win32" || navigator.platform === "Win64";
	    },
	    fixFlexboxIndicatorClass: function fixFlexboxIndicatorClass() {
	        var $html = $("html");
	        var isFound = false;

	        for (var i = 0; i < this.regexOfUserAgentsNotSupportingFlexbox.length; i++) {
	            var userAgent = $html.data("useragent");

	            if (new RegExp(this.regexOfUserAgentsNotSupportingFlexbox[i]).test(userAgent)) {
	                isFound = true;
	                break;
	            }
	        }

	        if (isFound) {
	            $html.removeClass("flexbox");
	            $html.addClass("no-flexbox");
	        }
	    }
	};

	exports.default = Browser;

/***/ }
/******/ ]);