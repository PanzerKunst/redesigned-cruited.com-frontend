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

	var _animator = __webpack_require__(2);

	var _browser = __webpack_require__(3);

	var _browser2 = _interopRequireDefault(_browser);

	var _category = __webpack_require__(4);

	var _category2 = _interopRequireDefault(_category);

	var _product = __webpack_require__(5);

	var _product2 = _interopRequireDefault(_product);

	var _order = __webpack_require__(6);

	var _order2 = _interopRequireDefault(_order);

	var _store = __webpack_require__(7);

	var _store2 = _interopRequireDefault(_store);

	var _positionSought = __webpack_require__(12);

	var _positionSought2 = _interopRequireDefault(_positionSought);

	var _employerSought = __webpack_require__(13);

	var _employerSought2 = _interopRequireDefault(_employerSought);

	var _orderTags = __webpack_require__(14);

	var _orderTags2 = _interopRequireDefault(_orderTags);

	var _timeLeft = __webpack_require__(15);

	var _timeLeft2 = _interopRequireDefault(_timeLeft);

	var _greenRedAssessmentComment = __webpack_require__(16);

	var _greenRedAssessmentComment2 = _interopRequireDefault(_greenRedAssessmentComment);

	var _reportCategory = __webpack_require__(17);

	var _reportCategory2 = _interopRequireDefault(_reportCategory);

	var _orderStatusChangeBtn = __webpack_require__(20);

	var _orderStatusChangeBtn2 = _interopRequireDefault(_orderStatusChangeBtn);

	var _docAssessmentNav = __webpack_require__(21);

	var _docAssessmentNav2 = _interopRequireDefault(_docAssessmentNav);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// eslint-disable-next-line no-unused-vars


	// eslint-disable-next-line no-unused-vars


	// eslint-disable-next-line no-unused-vars


	// eslint-disable-next-line no-unused-vars
	var controller = {
	    init: function init() {
	        _store2.default.reactComponent = ReactDOM.render(React.createElement(this.reactComponent), document.querySelector("[role=main]"));

	        _store2.default.init();
	    },


	    reactComponent: React.createClass({
	        displayName: "reactComponent",

	        largeScreenWidthPx: 960,

	        getInitialState: function getInitialState() {
	            return {
	                overallComments: {
	                    cv: null,
	                    coverLetter: null,
	                    linkedinProfile: null
	                }
	            };
	        },
	        render: function render() {
	            var order = _store2.default.order;

	            return React.createElement(
	                "div",
	                { id: "content" },
	                React.createElement(
	                    "header",
	                    null,
	                    React.createElement(
	                        "div",
	                        null,
	                        React.createElement(
	                            "h1",
	                            null,
	                            "Assessment #" + order.id
	                        )
	                    )
	                ),
	                React.createElement(
	                    "div",
	                    { className: "with-circles" },
	                    React.createElement(
	                        "div",
	                        { id: "order-details" },
	                        React.createElement(
	                            "section",
	                            { className: "order-details-section first" },
	                            React.createElement(
	                                "div",
	                                null,
	                                React.createElement(_positionSought2.default, { position: order.positionSought }),
	                                React.createElement(_employerSought2.default, { employer: order.employerSought })
	                            ),
	                            this._customerComment(order.customerComment),
	                            this._jobAdLink(order.jobAdUrl)
	                        ),
	                        React.createElement(
	                            "section",
	                            { className: "order-details-section second" },
	                            React.createElement(_orderTags2.default, { order: order, config: _store2.default.config }),
	                            this._linkedinProfilePic(order.customer.linkedinProfile),
	                            React.createElement(
	                                "p",
	                                null,
	                                order.customer.firstName,
	                                " ",
	                                order.customer.lastName
	                            ),
	                            React.createElement(
	                                "p",
	                                null,
	                                order.customer.emailAddress
	                            )
	                        ),
	                        React.createElement(
	                            "section",
	                            { className: "order-details-section third" },
	                            this._previewOrViewBtn(order),
	                            React.createElement(_orderStatusChangeBtn2.default, null),
	                            React.createElement(_timeLeft2.default, { order: order })
	                        )
	                    ),
	                    React.createElement(
	                        "div",
	                        { className: "nav-panel" },
	                        React.createElement(
	                            "ul",
	                            { className: "nav nav-tabs", role: "tablist" },
	                            this._tab(_category2.default.productCodes.cv, "CV"),
	                            this._tab(_category2.default.productCodes.coverLetter, "Cover Letter"),
	                            this._tab(_category2.default.productCodes.linkedinProfile, "Linkedin Profile")
	                        ),
	                        React.createElement(_docAssessmentNav2.default, null)
	                    ),
	                    React.createElement(
	                        "div",
	                        { className: "tab-content" },
	                        this._tabPane(_category2.default.productCodes.cv),
	                        this._tabPane(_category2.default.productCodes.coverLetter),
	                        this._tabPane(_category2.default.productCodes.linkedinProfile)
	                    ),
	                    React.createElement(
	                        "div",
	                        { className: "centered-contents" },
	                        this._previewOrViewBtn(order)
	                    )
	                )
	            );
	        },
	        componentDidUpdate: function componentDidUpdate() {
	            this._initState();
	            this._initElements();
	            this._initEvents();

	            this._setNavPanelLocation();
	            $(".overall-comment").prop("disabled", _store2.default.isOrderReadOnly());
	            this._selectFirstTab();
	        },
	        _initState: function _initState() {
	            if (_store2.default.assessment && !this.isStateInitialised) {
	                this.setState({
	                    overallComments: {
	                        cv: _store2.default.assessment.overallComment(_category2.default.productCodes.cv),
	                        coverLetter: _store2.default.assessment.overallComment(_category2.default.productCodes.coverLetter),
	                        linkedinProfile: _store2.default.assessment.overallComment(_category2.default.productCodes.linkedinProfile)
	                    }
	                });

	                this.isStateInitialised = true;
	            }
	        },
	        _initElements: function _initElements() {
	            this.$window = $(window);
	            var $withCircles = $(".with-circles");

	            this.$navPanel = $withCircles.children(".nav-panel");

	            this.$tabListItems = this.$navPanel.children(".nav-tabs").children();
	            this.$tabLinks = this.$tabListItems.children();
	            this.$firstTab = this.$tabListItems.first().children();

	            this.$assessmentNavPanels = $withCircles.find(".nav.assessment");
	        },
	        _initEvents: function _initEvents() {
	            var _this = this;

	            this._showCorrectAssessmentNavPanels();
	            this.$window.resize(function () {
	                return _this._setNavPanelLocation();
	            });
	        },
	        _setNavPanelLocation: function _setNavPanelLocation() {
	            if (_browser2.default.isXlScreen()) {
	                var locationX = this.largeScreenWidthPx + (window.innerWidth - this.largeScreenWidthPx) / 2;

	                this.$navPanel.css("left", locationX);
	            }
	        },
	        _showCorrectAssessmentNavPanels: function _showCorrectAssessmentNavPanels() {
	            var _this2 = this;

	            this.$tabLinks.on("shown.bs.tab", function (e) {
	                _this2.$assessmentNavPanels.hide();

	                if (_browser2.default.isXlScreen()) {
	                    var $target = $(e.target);
	                    var categoryProductCode = _this2._categoryProductCodeFromHash($target.attr("href"));

	                    _this2.$assessmentNavPanels.filter("." + categoryProductCode).show();
	                }
	            });
	        },
	        _selectFirstTab: function _selectFirstTab() {
	            if (!this.isFirstTabSelectionDone) {
	                this.$firstTab.tab("show");
	                this.isFirstTabSelectionDone = true;
	            }
	        },
	        _customerComment: function _customerComment(customerComment) {
	            if (!customerComment) {
	                return null;
	            }
	            return React.createElement(
	                "p",
	                { className: "customer-comment" },
	                customerComment
	            );
	        },
	        _jobAdLink: function _jobAdLink(jobAdUrl) {
	            if (!jobAdUrl) {
	                return null;
	            }
	            return React.createElement(
	                "a",
	                { href: jobAdUrl, target: "_blank", className: "job-ad-link" },
	                "Job ad"
	            );
	        },
	        _linkedinProfilePic: function _linkedinProfilePic(linkedinProfile) {
	            if (!linkedinProfile) {
	                return null;
	            }

	            var style = { backgroundImage: "url(" + linkedinProfile.pictureUrl + ")" };

	            return React.createElement("div", { style: style });
	        },
	        _previewOrViewBtn: function _previewOrViewBtn() {
	            if (_store2.default.order.status === _order2.default.statuses.scheduled || _store2.default.order.status === _order2.default.statuses.completed) {
	                return React.createElement(
	                    "a",
	                    { className: "btn btn-primary", href: _store2.default.order.reportUrl(_store2.default.config) },
	                    "View report"
	                );
	            }

	            if (_store2.default.areAllReportCommentsCheckedForAtLeastOneCategory()) {
	                return React.createElement(
	                    "button",
	                    { className: "btn btn-primary", onClick: this._handlePreviewBtnClick },
	                    "Preview report"
	                );
	            }

	            return null;
	        },
	        _tab: function _tab(categoryProductCode, label) {
	            if (!_.includes(_store2.default.order.containedProductCodes, _product2.default.codes[categoryProductCode])) {
	                return null;
	            }

	            var attr = this._tabAttr(categoryProductCode);

	            return React.createElement(
	                "li",
	                { role: "presentation" },
	                React.createElement(
	                    "a",
	                    { href: "#" + attr, "aria-controls": attr, role: "tab", "data-toggle": "tab", onClick: this._handleTabClick },
	                    label
	                )
	            );
	        },
	        _tabPane: function _tabPane(categoryProductCode) {
	            if (!_.includes(_store2.default.order.containedProductCodes, _product2.default.codes[categoryProductCode])) {
	                return null;
	            }

	            var attr = this._tabAttr(categoryProductCode);

	            return React.createElement(
	                "div",
	                { role: "tabpanel", className: "tab-pane fade in", id: attr, "data-product-code": categoryProductCode },
	                this._listCategory(categoryProductCode),
	                this._reportForm(categoryProductCode)
	            );
	        },
	        _tabAttr: function _tabAttr(categoryProductCode) {
	            return categoryProductCode + "-comments-selection-panel";
	        },
	        _listCategory: function _listCategory(categoryProductCode) {
	            if (_store2.default.assessment) {
	                return _store2.default.assessment.categoryIds(categoryProductCode).map(function (categoryId) {
	                    var elId = "list-category-" + categoryId;
	                    var listCommentsForThisCategory = _.filter(_store2.default.assessment.listComments(categoryProductCode), function (ac) {
	                        return ac.categoryId === categoryId;
	                    });

	                    return React.createElement(
	                        "section",
	                        { key: elId, id: elId },
	                        React.createElement(
	                            "h3",
	                            null,
	                            _store2.default.i18nMessages["category.title." + categoryId]
	                        ),
	                        React.createElement(
	                            "ul",
	                            { className: "styleless" },
	                            listCommentsForThisCategory.map(function (ac) {
	                                return React.createElement(_greenRedAssessmentComment2.default, { key: ac.id, comment: ac });
	                            })
	                        )
	                    );
	                });
	            }

	            return null;
	        },
	        _reportForm: function _reportForm(categoryProductCode) {
	            return React.createElement(
	                "form",
	                { id: categoryProductCode + "-report-form", className: "report-form single-column-panel" },
	                React.createElement(
	                    "div",
	                    { className: "form-group" },
	                    React.createElement(
	                        "label",
	                        null,
	                        "Overall comment"
	                    ),
	                    React.createElement("textarea", { className: "form-control overall-comment", value: this.state.overallComments[categoryProductCode] || "", onChange: this._handleOverallCommentChange, onBlur: this._handleOverallCommentBlur })
	                ),
	                this._reportCategories(categoryProductCode)
	            );
	        },
	        _reportCategories: function _reportCategories(categoryProductCode) {
	            if (_store2.default.assessment && _store2.default.assessment.areAllListCommentsSelected(categoryProductCode)) {
	                return React.createElement(
	                    "ul",
	                    { className: "styleless" },
	                    _store2.default.assessment.categoryIds(categoryProductCode).map(function (categoryId) {
	                        var reportCategory = _store2.default.assessment.reportCategory(categoryProductCode, categoryId, true);

	                        reportCategory.id = categoryId;

	                        return React.createElement(_reportCategory2.default, { key: categoryId, reportCategory: reportCategory });
	                    })
	                );
	            }

	            return null;
	        },
	        _handleTabClick: function _handleTabClick(e) {
	            e.preventDefault();
	            $(e.currentTarget).tab("show");
	        },
	        _handleOverallCommentChange: function _handleOverallCommentChange(e) {
	            var $textarea = $(e.currentTarget);
	            var categoryProductCode = this._categoryProductCodeFromOverallCommentTextarea($textarea);
	            var newState = this.state;

	            newState.overallComments[categoryProductCode] = $textarea.val();
	            this.setState(newState);
	        },
	        _handleOverallCommentBlur: function _handleOverallCommentBlur(e) {
	            var $textarea = $(e.currentTarget);
	            var categoryProductCode = this._categoryProductCodeFromOverallCommentTextarea($textarea);

	            var textareaValue = $textarea.val();
	            var overallComment = textareaValue === "" ? null : textareaValue;

	            _store2.default.updateOverallComment(categoryProductCode, overallComment);
	        },
	        _handlePreviewBtnClick: function _handlePreviewBtnClick(e) {
	            var $btn = $(e.currentTarget);

	            // TODO: before submitting:
	            // - check that all report comments are checked in all tabs
	            // - check that there are no brackets left

	            (0, _animator.enableLoading)($btn, "Saving");
	            this._saveCurrentlyAssessedDoc();
	            _store2.default.saveCurrentReport();
	        },
	        _categoryProductCodeFromOverallCommentTextarea: function _categoryProductCodeFromOverallCommentTextarea($textarea) {
	            return $textarea.closest(".tab-pane").data("productCode");
	        },
	        _categoryProductCodeFromHash: function _categoryProductCodeFromHash(hash) {
	            return hash.substring(1, hash.indexOf("-"));
	        },
	        _saveCurrentlyAssessedDoc: function _saveCurrentlyAssessedDoc() {
	            var $selectedTab = this.$tabListItems.filter(".active");
	            var hash = $selectedTab.children().attr("href");

	            _browser2.default.saveInLocalStorage(_global.localStorageKeys.currentlyAssessedDoc, this._categoryProductCodeFromHash(hash));
	        }
	    })
	};

	// eslint-disable-next-line no-unused-vars


	// eslint-disable-next-line no-unused-vars


	// eslint-disable-next-line no-unused-vars


	// eslint-disable-next-line no-unused-vars


	controller.init();

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

	var localStorageKeys = exports.localStorageKeys = {
	    myAssessments: "myAssessments",
	    currentlyAssessedDoc: "currentlyAssessedDoc"
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.fadeIn = fadeIn;
	exports.fadeOut = fadeOut;
	exports.enableLoading = enableLoading;
	exports.disableLoading = disableLoading;
	exports.scrollTo = scrollTo;

	var _global = __webpack_require__(1);

	function fadeIn($el, params) {
	    if (!$el.is(":visible")) {
	        var animationDuration = params && _.isNumber(params.animationDuration) ? params.animationDuration : _global.animationDurations.medium;
	        var alpha = params && _.isNumber(params.opacity) ? params.opacity : 1;

	        TweenLite.set($el, { display: "block", alpha: 0 });
	        TweenLite.to($el, animationDuration, {
	            alpha: alpha,
	            onComplete: function onComplete() {
	                if (params && _.isFunction(params.onComplete)) {
	                    params.onComplete();
	                }
	            }
	        });
	    }
	}

	function fadeOut($el, params) {
	    if ($el.is(":visible")) {
	        var animationDuration = params && _.isNumber(params.animationDuration) ? params.animationDuration : _global.animationDurations.medium;

	        TweenLite.to($el, animationDuration, {
	            alpha: 0,
	            onComplete: function onComplete() {
	                $el.hide().css("opacity", 1);
	                if (params && _.isFunction(params.onComplete)) {
	                    params.onComplete();
	                }
	            }
	        });
	    }
	}

	function enableLoading($el, text) {
	    if ($el.prop("tagName") === "BUTTON") {
	        var btn = $el.get(0);
	        var defaultText = btn.innerHTML;
	        var loadingText = text || defaultText;

	        $el.data("defaultText", defaultText);
	        $el.prop("disabled", true);

	        btn.innerHTML = "<i class=\"fa fa-spinner fa-pulse\"></i>" + loadingText;
	    }
	}

	function disableLoading($el) {
	    if ($el.prop("tagName") === "BUTTON") {
	        $el.html($el.data("defaultText"));
	        $el.prop("disabled", false);
	    }
	}

	function scrollTo(e, offsetCorrection) {
	    e.preventDefault();

	    var $target = $(e.currentTarget);
	    var hash = $target.attr("href");
	    var sectionId = hash.substring(1);
	    var $section = $(document.getElementById(sectionId));

	    var scrollYPos = $section.offset().top - offsetCorrection;

	    TweenLite.to(window, 1, { scrollTo: scrollYPos, ease: Power4.easeOut });
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Browser = {
	    regexOfUserAgentsNotSupportingFlexbox: ["OS 8_", "OS 7_", "OS 6_", "OS 5_", "OS 4_"],

	    cssRules: function cssRules() {
	        var _this = this;

	        if (this.allCssRules) {
	            return this.allCssRules;
	        }

	        this.allCssRules = {};

	        var styleSheets = document.styleSheets;

	        styleSheets.forEach(function (styleSheet) {
	            var styleSheetRules = styleSheet.cssRules || styleSheet.rules; // .rules for IE, .cssRules for other browsers

	            if (styleSheetRules) {
	                for (var j = 0; j < styleSheetRules.length; j++) {
	                    var rule = styleSheetRules[j];

	                    _this.allCssRules[rule.selectorText] = rule.style;
	                }
	            }
	        });

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
	        return content.indexOf("GLOBAL_MEDIUM_SCREEN_BREAKPOINT") >= 0;
	    },
	    isLargeScreen: function isLargeScreen() {
	        var content = window.getComputedStyle(document.querySelector("body"), ":after").getPropertyValue("content");

	        return content.indexOf("GLOBAL_LARGE_SCREEN_BREAKPOINT") >= 0;
	    },
	    isXlScreen: function isXlScreen() {
	        var content = window.getComputedStyle(document.querySelector("body"), ":after").getPropertyValue("content");

	        return content.indexOf("GLOBAL_XL_SCREEN_BREAKPOINT") >= 0;
	    },
	    isSmallScreen: function isSmallScreen() {
	        return !this.isMediumScreen() && !this.isLargeScreen() && !this.isXlScreen();
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

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Category = {

	    // Static
	    productCodes: {
	        cv: "cv",
	        coverLetter: "coverLetter",
	        linkedinProfile: "linkedinProfile"
	    },

	    productCodeFromCategoryId: function productCodeFromCategoryId(categoryId) {
	        switch (categoryId) {
	            case 12:
	                return this.productCodes.cv;
	            case 13:
	                return this.productCodes.cv;
	            case 14:
	                return this.productCodes.cv;

	            case 7:
	                return this.productCodes.coverLetter;
	            case 8:
	                return this.productCodes.coverLetter;
	            case 10:
	                return this.productCodes.coverLetter;
	            case 11:
	                return this.productCodes.coverLetter;

	            case 16:
	                return this.productCodes.linkedinProfile;
	            case 17:
	                return this.productCodes.linkedinProfile;
	            case 18:
	                return this.productCodes.linkedinProfile;
	            default:
	                return this.productCodes.linkedinProfile;
	        }
	    }

	    // Instance

	};

	exports.default = Category;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Product = {

	    // Static
	    codes: {
	        cv: "CV_REVIEW",
	        coverLetter: "COVER_LETTER_REVIEW",
	        linkedinProfile: "LINKEDIN_PROFILE_REVIEW"
	    },

	    humanReadableCode: function humanReadableCode(dbCode) {
	        switch (dbCode) {
	            case this.codes.cv:
	                return "CV";
	            case this.codes.coverLetter:
	                return "Cover letter";
	            default:
	                return "Linkedin";
	        }
	    }

	    // Instance

	};

	exports.default = Product;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _global = __webpack_require__(1);

	var _product = __webpack_require__(5);

	var _product2 = _interopRequireDefault(_product);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Order = {

	    // Static
	    statuses: {
	        notPaid: -1,
	        paid: 0,
	        inProgress: 1,
	        awaitingFeedback: 4,
	        scheduled: 3,
	        completed: 2
	    },
	    fileNamePrefixSeparator: "-",

	    // Instance
	    reportUrl: function reportUrl(config) {
	        return config.customerAppRootUrl + "reports/" + this.id;
	    },
	    documentUrl: function documentUrl(config, productCode) {
	        var urlMiddle = "cv";

	        switch (productCode) {
	            case _product2.default.codes.coverLetter:
	                urlMiddle = "cover-letter";
	                break;
	            case _product2.default.codes.linkedinProfile:
	                urlMiddle = "linkedin-profile";
	                break;
	            default:
	        }

	        return config.dwsRootUrl + "docs/" + this.id + "/" + urlMiddle + "?token=" + this.idInBase64;
	    },
	    thumbnailUrl: function thumbnailUrl(config, productCode) {
	        var urlMiddle = "cv";

	        switch (productCode) {
	            case _product2.default.codes.coverLetter:
	                urlMiddle = "cover-letter";
	                break;
	            case _product2.default.codes.linkedinProfile:
	                urlMiddle = "linkedin-profile";
	                break;
	            default:
	        }

	        return config.dwsRootUrl + "docs/" + this.id + "/" + urlMiddle + "/thumbnail";
	    },
	    updateStatus: function updateStatus(status, onAjaxRequestSuccess) {
	        this.status = status;

	        var type = "PUT";
	        var url = "/api/orders";
	        var httpRequest = new XMLHttpRequest();

	        httpRequest.onreadystatechange = function () {
	            if (httpRequest.readyState === XMLHttpRequest.DONE) {
	                if (httpRequest.status === _global.httpStatusCodes.ok) {
	                    if (_.isFunction(onAjaxRequestSuccess)) {
	                        onAjaxRequestSuccess();
	                    }
	                } else {
	                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
	                }
	            }
	        };
	        httpRequest.open(type, url);
	        httpRequest.setRequestHeader("Content-Type", "application/json");
	        httpRequest.send(JSON.stringify(this));
	    }
	};

	exports.default = Order;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _global = __webpack_require__(1);

	var _string = __webpack_require__(8);

	var _string2 = _interopRequireDefault(_string);

	var _account = __webpack_require__(9);

	var _account2 = _interopRequireDefault(_account);

	var _order = __webpack_require__(6);

	var _order2 = _interopRequireDefault(_order);

	var _assessment = __webpack_require__(10);

	var _assessment2 = _interopRequireDefault(_assessment);

	var _category = __webpack_require__(4);

	var _category2 = _interopRequireDefault(_category);

	var _product = __webpack_require__(5);

	var _product2 = _interopRequireDefault(_product);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var store = {
	    reactComponent: null,
	    account: Object.assign(Object.create(_account2.default), CR.ControllerData.account),
	    config: CR.ControllerData.config,
	    order: Object.assign(Object.create(_order2.default), CR.ControllerData.order),
	    i18nMessages: CR.ControllerData.i18nMessages,
	    allDefaultComments: CR.ControllerData.allDefaultComments,
	    allCommentVariations: CR.ControllerData.allCommentVariations,
	    backendAssessment: CR.ControllerData.assessment,

	    init: function init() {
	        this.assessment = Object.assign(Object.create(_assessment2.default), {
	            orderId: this.order.id,
	            allDefaultComments: this.allDefaultComments
	        });

	        this.assessment.init();

	        if (!this.assessment.isReportStarted() && this.backendAssessment) {

	            // TODO: remove
	            console.log("!this.assessment.isReportStarted() && this.backendAssessment", this.backendAssessment);

	            this.assessment.initListCommentsAndReport({
	                cvListComments: this._listCommentFromBackend(this.backendAssessment.cvCommentList),
	                coverLetterListComments: this._listCommentFromBackend(this.backendAssessment.coverLetterCommentList),
	                linkedinProfileListComments: this._listCommentFromBackend(this.backendAssessment.linkedinProfileCommentList),

	                cvReport: this._docReportFromBackend(this.backendAssessment.cvReport),
	                coverLetterReport: this._docReportFromBackend(this.backendAssessment.coverLetterReport),
	                linkedinProfileReport: this._docReportFromBackend(this.backendAssessment.linkedinProfileReport)
	            });
	        }

	        this.reactComponent.forceUpdate();
	    },
	    updateOrderStatus: function updateOrderStatus(status) {
	        this.order.updateStatus(status);
	        this.reactComponent.forceUpdate();
	    },
	    resetCommentInListAndReport: function resetCommentInListAndReport(comment) {
	        this.assessment.resetListComment(comment);
	        this.assessment.resetReportComment(comment);
	        this.reactComponent.forceUpdate();
	    },
	    updateCommentInListAndReport: function updateCommentInListAndReport(comment) {
	        this.assessment.updateListComment(comment);
	        this.assessment.updateReportCommentIfExists(comment);
	        this.reactComponent.forceUpdate();
	    },
	    updateListComment: function updateListComment(comment) {
	        this.assessment.updateListComment(comment);
	        this.reactComponent.forceUpdate();
	    },
	    updateOverallComment: function updateOverallComment(categoryProductCode, commentText) {
	        this.assessment.updateOverallComment(categoryProductCode, commentText);
	    },
	    updateReportCategory: function updateReportCategory(category, isRefreshRequired) {
	        this.assessment.updateReportCategory(category);

	        if (isRefreshRequired) {
	            this.reactComponent.forceUpdate();
	        }
	    },
	    addReportComment: function addReportComment(comment) {
	        this.assessment.addReportComment(comment);
	        this.reactComponent.forceUpdate();
	    },
	    updateReportCommentIfExists: function updateReportCommentIfExists(comment) {
	        this.assessment.updateReportCommentIfExists(comment);
	        this.reactComponent.forceUpdate();
	    },
	    removeReportComment: function removeReportComment(comment) {
	        this.assessment.removeReportComment(comment);
	        this.reactComponent.forceUpdate();
	    },
	    handleReportCommentsReorder: function handleReportCommentsReorder(categoryId, oldIndex, newIndex) {
	        this.assessment.reorderReportComment(categoryId, oldIndex, newIndex);
	    },
	    isOrderReadOnly: function isOrderReadOnly() {
	        return this.order.rater.id !== this.account.id && this.order.status !== _order2.default.statuses.awaitingFeedback || this.order.status < _order2.default.statuses.inProgress || this.order.status === _order2.default.statuses.scheduled || this.order.status === _order2.default.statuses.completed;
	    },
	    isOrderStartable: function isOrderStartable() {
	        return this.order.rater.id === this.account.id && this.order.status === _order2.default.statuses.paid;
	    },
	    areAllReportCommentsCheckedForAtLeastOneCategory: function areAllReportCommentsCheckedForAtLeastOneCategory() {
	        return this.assessment && (this.assessment.areAllReportCommentsChecked(_category2.default.productCodes.cv) || this.assessment.areAllReportCommentsChecked(_category2.default.productCodes.coverLetter) || this.assessment.areAllReportCommentsChecked(_category2.default.productCodes.linkedinProfile));
	    },
	    saveCurrentReport: function saveCurrentReport() {
	        var _this = this;

	        /*
	         Assessment(orderId: Long,
	           cvCommentList: List[AssessmentComment(defaultComment: DefaultComment,
	         isGreenSelected: Boolean,
	         redText: Option[String])],
	         coverLetterCommentList: List[AssessmentComment],
	         linkedinProfileCommentList: List[AssessmentComment],
	           cvReport: Option[DocumentReport],
	         coverLetterReport: Option[DocumentReport],
	         linkedinProfileReport: Option[DocumentReport])
	         */
	        var assessment = {
	            orderId: this.order.id,

	            cvCommentList: this._docCommentListForBackend(_category2.default.productCodes.cv),
	            coverLetterCommentList: this._docCommentListForBackend(_category2.default.productCodes.coverLetter),
	            linkedinProfileCommentList: this._docCommentListForBackend(_category2.default.productCodes.linkedinProfile)
	        };

	        if (_.includes(this.order.containedProductCodes, _product2.default.codes.cv)) {
	            assessment.cvReport = this._docReportForBackend(_category2.default.productCodes.cv);
	        }

	        if (_.includes(this.order.containedProductCodes, _product2.default.codes.coverLetter)) {
	            assessment.coverLetterReport = this._docReportForBackend(_category2.default.productCodes.coverLetter);
	        }

	        if (_.includes(this.order.containedProductCodes, _product2.default.codes.linkedinProfile)) {
	            assessment.linkedinProfileReport = this._docReportForBackend(_category2.default.productCodes.linkedinProfile);
	        }

	        var type = "POST";
	        var url = "/api/assessments";
	        var httpRequest = new XMLHttpRequest();

	        httpRequest.onreadystatechange = function () {
	            if (httpRequest.readyState === XMLHttpRequest.DONE) {
	                if (httpRequest.status === _global.httpStatusCodes.ok) {
	                    _this.assessment.deleteAssessmentInfoFromLocalStorage();
	                    location.href = "/report-preview/" + store.order.id;
	                } else {
	                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
	                }
	            }
	        };
	        httpRequest.open(type, url);
	        httpRequest.setRequestHeader("Content-Type", "application/json");
	        httpRequest.send(JSON.stringify(assessment));
	    },
	    _docCommentListForBackend: function _docCommentListForBackend(categoryProductCode) {
	        var _this2 = this;

	        /* List[AssessmentComment(defaultComment: DefaultComment,
	         * isGreenSelected: Boolean,
	         * redText: Option[String])]
	         */
	        return this.assessment.listComments(categoryProductCode).map(function (c) {
	            var defaultComment = _.find(_this2.allDefaultComments[categoryProductCode], ["id", c.id]);

	            return {
	                defaultComment: defaultComment,
	                isGreenSelected: c.isGreenSelected || false,
	                redText: c.redText === defaultComment.redText ? null : c.redText
	            };
	        });
	    },
	    _docReportForBackend: function _docReportForBackend(categoryProductCode) {
	        var _this3 = this;

	        /*
	         DocumentReport(redComments: List[RedComment],
	         wellDoneComments: List[WellDoneComment],
	         overallComment: Option[String])
	         */
	        var docReport = {
	            redComments: [],
	            wellDoneComments: [],
	            overallComment: this.assessment.overallComment(categoryProductCode)
	        };

	        this.assessment.categoryIds(categoryProductCode).forEach(function (categoryId) {
	            var reportCategory = _this3.assessment.reportCategory(categoryProductCode, categoryId);

	            /*
	             RedComment(id: Option[Long], // None when custom comment coming from frontend
	             categoryId: Long,
	             text: String,
	             points: Option[Int])  // None when custom comment coming from frontend
	             */
	            reportCategory.comments.forEach(function (c) {
	                docReport.redComments.push({
	                    defaultCommentId: _.isNumber(c.id) ? c.id : null, // Custom comments have UUID as ID on the frontend side
	                    categoryId: categoryId,
	                    text: c.redText,
	                    points: c.points
	                });
	            });

	            /*
	             WellDoneComment(categoryId: Long,
	             text: String)
	             */
	            if (reportCategory.wellDoneComment) {
	                docReport.wellDoneComments.push({
	                    categoryId: categoryId,
	                    text: reportCategory.wellDoneComment
	                });
	            }
	        });

	        if (docReport.redComments.length === 0 && docReport.wellDoneComments.length === 0) {
	            return null;
	        }

	        return docReport;
	    },


	    /* backendListCommentsForDoc List[
	     * defaultComment: [
	     *   id: Long,
	     *   categoryId: Long,
	     *   greenText: String,
	     *   redText: String,
	     *   points: Int,
	     *   isGrouped: Boolean],
	     * isGreenSelected: Boolean,
	     * redText: Option[String]
	     * ]
	     */
	    _listCommentFromBackend: function _listCommentFromBackend(backendListCommentsForDoc) {

	        /* Frontend list comment:
	         * {
	         *   id: 1,
	         *   categoryId: 13,
	         *   greenText: "string",
	         *   redText: "string",
	         *   points: 5,
	         *   isGrouped: false,
	         *   isGreenSelected: true,
	         *   isRedSelected: false
	         * }
	         */
	        return backendListCommentsForDoc.map(function (c) {
	            return Object.assign(c.defaultComment, {
	                redText: c.redText || c.defaultComment.redText,
	                isGreenSelected: c.isGreenSelected,
	                isRedSelected: !c.isGreenSelected
	            });
	        });
	    },


	    /* backendDocReport DocumentReport(redComments: List[RedComment],
	     *   wellDoneComments: List[WellDoneComment],
	     *   overallComment: Option[String])
	     */
	    _docReportFromBackend: function _docReportFromBackend(backendDocReport) {
	        if (!backendDocReport) {
	            return null;
	        }

	        /*
	         * Frontend doc report:
	         *   {
	         *     overallComment: "something",
	         *     categories: {
	         *       12: {
	         *         comments: [],
	         *         wellDoneComment: null
	         *       }
	         *       13: {
	         *         comments: [],
	         *         wellDoneComment: null
	         *       }
	         *       14: {
	         *         comments: [],
	         *         wellDoneComment: null
	         *       }
	         *     }
	         *   }
	         */

	        var docReport = {
	            overallComment: backendDocReport.overallComment
	        };

	        var redCommentCategories = backendDocReport.redComments.map(function (c) {
	            return c.categoryId;
	        });
	        var wellDoneCommentCategories = backendDocReport.wellDoneComments.map(function (c) {
	            return c.categoryId;
	        });
	        var allDocCategoryIds = _.uniq(_.concat(redCommentCategories, wellDoneCommentCategories));

	        if (allDocCategoryIds.length > 0) {
	            docReport.categories = {};

	            allDocCategoryIds.forEach(function (categoryId) {
	                var comments = _.filter(backendDocReport.redComments, ["categoryId", categoryId]).map(function (c) {
	                    var redComment = {
	                        id: c.defaultCommentId || _string2.default.uuid(),
	                        categoryId: c.categoryId,
	                        redText: c.text,
	                        points: c.points,
	                        isChecked: true
	                    };

	                    return redComment;
	                });

	                var wellDoneCommentFound = _.find(backendDocReport.wellDoneComments, ["categoryId", categoryId]);
	                var wellDoneComment = wellDoneCommentFound ? wellDoneCommentFound.text : null;

	                docReport.categories[categoryId] = {
	                    comments: comments,
	                    wellDoneComment: wellDoneComment
	                };
	            });
	        }

	        return docReport;
	    }
	};

	exports.default = store;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var StringUtils = {
	    template: function template(text, key, value) {
	        var regex = new RegExp("{" + key + "}", "g");

	        return text.replace(regex, value);
	    },
	    uuid: function uuid() {
	        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
	            var r = Math.random() * 16 | 0;
	            var v = c === "x" ? r : r & 0x3 | 0x8;

	            return v.toString(16);
	        });
	    }
	};

	exports.default = StringUtils;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Account = {

	    // Static
	    types: {
	        customer: 2,
	        rater: 3,
	        admin: 1
	    },

	    // Instance
	    isAdmin: function isAdmin() {
	        return this.type === this.types.admin;
	    }
	};

	exports.default = Account;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _global = __webpack_require__(1);

	var _category = __webpack_require__(4);

	var _category2 = _interopRequireDefault(_category);

	var _browser = __webpack_require__(3);

	var _browser2 = _interopRequireDefault(_browser);

	var _array = __webpack_require__(11);

	var _array2 = _interopRequireDefault(_array);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Assessment = {

	    // Static
	    nbReportComments: 3,
	    minScoreForWellDoneComment: 80,

	    // Instance
	    init: function init() {
	        this._initCategoryIds();
	    },
	    categoryIds: function categoryIds(categoryProductCode) {
	        return this._categoryIds[categoryProductCode];
	    },
	    listComments: function listComments(categoryProductCode) {
	        var listComments = this._listCommentsFromLocalStorage();

	        if (!listComments) {
	            listComments = _.cloneDeep(this.allDefaultComments);
	            this._saveListCommentsInLocalStorage(listComments);
	        }

	        return listComments[categoryProductCode];
	    },
	    updateListComment: function updateListComment(comment) {
	        var listComments = this._listCommentsFromLocalStorage();
	        var listCommentsToUpdate = listComments.cv;

	        if (!_.find(listCommentsToUpdate, function (c) {
	            return c.id === comment.id;
	        })) {
	            listCommentsToUpdate = listComments.coverLetter;
	        }
	        if (!_.find(listCommentsToUpdate, function (c) {
	            return c.id === comment.id;
	        })) {
	            listCommentsToUpdate = listComments.linkedinProfile;
	        }

	        var commentToUpdate = _.find(listCommentsToUpdate, function (c) {
	            return c.id === comment.id;
	        });

	        Object.assign(commentToUpdate, comment);

	        this._saveListCommentsInLocalStorage(listComments);
	    },
	    resetListComment: function resetListComment(comment) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(comment.categoryId);
	        var originalComment = _.find(this.allDefaultComments[categoryProductCode], function (c) {
	            return c.id === comment.id;
	        });

	        this.updateListComment(originalComment);
	    },


	    /*
	     * @param listCommentsAndReport {
	     * cvListComments: [...],
	     * coverLetterListComments: [...],
	     * linkedinProfileListComments: [...],
	     * cvReport: {...},
	     * coverLetterReport: {...},
	     * linkedinProfileReport: {...}
	     * }
	     */
	    initListCommentsAndReport: function initListCommentsAndReport(listCommentsAndReport) {
	        var listComments = _.cloneDeep(this.allDefaultComments);

	        if (!_.isEmpty(listCommentsAndReport.cvListComments)) {
	            listComments.cv = listCommentsAndReport.cvListComments;
	        }

	        if (!_.isEmpty(listCommentsAndReport.coverLetterListComments)) {
	            listComments.coverLetter = listCommentsAndReport.coverLetterListComments;
	        }

	        if (!_.isEmpty(listCommentsAndReport.linkedinProfileListComments)) {
	            listComments.linkedinProfile = listCommentsAndReport.linkedinProfileListComments;
	        }

	        this._saveListCommentsInLocalStorage(listComments);

	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);

	        myAssessments[this.orderId].report = {
	            cv: listCommentsAndReport.cvReport,
	            coverLetter: listCommentsAndReport.coverLetterReport,
	            linkedinProfile: listCommentsAndReport.linkedinProfileReport
	        };

	        _browser2.default.saveInLocalStorage(_global.localStorageKeys.myAssessments, myAssessments);
	    },
	    areAllListCommentsSelected: function areAllListCommentsSelected(categoryProductCode) {
	        var listComments = this._listCommentsFromLocalStorage();
	        var listCommentsForCategory = listComments ? listComments[categoryProductCode] : null;

	        if (!listCommentsForCategory) {
	            return false;
	        }

	        for (var i = 0; i < listCommentsForCategory.length; i++) {
	            var c = listCommentsForCategory[i];

	            if (!c.isGreenSelected && !c.isRedSelected) {
	                return false;
	            }
	        }

	        return true;
	    },
	    overallComment: function overallComment(categoryProductCode) {
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);

	        return _.get(myAssessments, [this.orderId, "report", categoryProductCode, "overallComment"]);
	    },
	    updateOverallComment: function updateOverallComment(categoryProductCode, commentText) {
	        this._saveReportOverallCommentInLocalStorage(categoryProductCode, commentText);
	    },
	    reportCategory: function reportCategory(categoryProductCode, categoryId) {
	        var isToSaveInLocalStorage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);

	        if (_.has(myAssessments, [this.orderId, "report", categoryProductCode, "categories", categoryId])) {
	            return myAssessments[this.orderId].report[categoryProductCode].categories[categoryId];
	        }

	        var reportCategory = this._defaultReportCategory(categoryProductCode, categoryId);

	        if (isToSaveInLocalStorage) {
	            this._saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory);
	        }

	        return reportCategory;
	    },
	    updateReportCategory: function updateReportCategory(category) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(category.id);

	        this._saveReportCategoryInLocalStorage(categoryProductCode, category.id, category);
	    },
	    addReportComment: function addReportComment(comment) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(comment.categoryId);

	        this._saveReportCommentInLocalStorage(categoryProductCode, comment);
	    },
	    updateReportCommentIfExists: function updateReportCommentIfExists(comment) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(comment.categoryId);
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);

	        if (_.has(myAssessments, [this.orderId, "report", categoryProductCode, "categories", comment.categoryId])) {
	            var commentToUpdate = _.find(myAssessments[this.orderId].report[categoryProductCode].categories[comment.categoryId].comments, function (c) {
	                return c.id === comment.id;
	            });

	            if (commentToUpdate) {
	                this._saveReportCommentInLocalStorage(categoryProductCode, comment);
	            }
	        }
	    },
	    removeReportComment: function removeReportComment(comment) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(comment.categoryId);

	        this._removeReportCommentFromLocalStorage(categoryProductCode, comment);
	    },
	    resetReportComment: function resetReportComment(comment) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(comment.categoryId);
	        var originalComment = _.find(this.allDefaultComments[categoryProductCode], function (c) {
	            return c.id === comment.id;
	        });

	        this.updateReportCommentIfExists(originalComment);
	    },
	    reorderReportComment: function reorderReportComment(categoryId, oldIndex, newIndex) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(categoryId);
	        var reportCategory = this.reportCategory(categoryProductCode, categoryId);

	        _array2.default.move(reportCategory.comments, oldIndex, newIndex);

	        this._saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory);
	    },
	    areAllReportCommentsChecked: function areAllReportCommentsChecked(categoryProductCode) {
	        if (!this.areAllListCommentsSelected(categoryProductCode)) {
	            return false;
	        }

	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);
	        var docReportCategoriesMap = _.get(myAssessments, [this.orderId, "report", categoryProductCode, "categories"]);

	        if (_.isEmpty(docReportCategoriesMap)) {
	            return false;
	        }

	        var categories = _.values(docReportCategoriesMap);

	        for (var i = 0; i < categories.length; i++) {
	            var category = categories[i];

	            for (var j = 0; j < category.comments.length; j++) {
	                var comment = category.comments[j];

	                if (!comment.isChecked) {
	                    return false;
	                }
	            }
	        }

	        return true;
	    },


	    // (sumOfAllPoints - sumOfRedPoints) / sumOfAllPoints * 100
	    categoryScore: function categoryScore(categoryId) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(categoryId);
	        var listCommentsForCategory = _.filter(this.listComments(categoryProductCode), function (ac) {
	            return ac.categoryId === categoryId;
	        });

	        var sumOfAllPoints = 0;
	        var sumOfRedPoints = 0;

	        for (var i = 0; i < listCommentsForCategory.length; i++) {
	            var listComment = listCommentsForCategory[i];

	            sumOfAllPoints += listComment.points;

	            if (listComment.isRedSelected) {
	                sumOfRedPoints += listComment.points;
	            }
	        }

	        return (sumOfAllPoints - sumOfRedPoints) / sumOfAllPoints * 100;
	    },
	    deleteAssessmentInfoFromLocalStorage: function deleteAssessmentInfoFromLocalStorage() {
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments) || {};

	        myAssessments[this.orderId] = null;

	        _browser2.default.saveInLocalStorage(_global.localStorageKeys.myAssessments, myAssessments);
	    },
	    isReportStarted: function isReportStarted() {
	        var allCategoriesAsArray = [];

	        _.values(this._categoryIds).forEach(function (categoryIdsForThatDoc) {
	            allCategoriesAsArray = _.concat(allCategoriesAsArray, categoryIdsForThatDoc);
	        });

	        for (var i = 0; i < allCategoriesAsArray[i]; i++) {
	            var categoryId = allCategoriesAsArray[i];
	            var categoryProductCode = _category2.default.productCodeFromCategoryId(categoryId);
	            var reportCategory = this.reportCategory(categoryProductCode, categoryId);
	            var defaultCategory = this._defaultReportCategory(categoryProductCode, categoryId);

	            if (!_.isEqual(reportCategory.comments, defaultCategory.comments) || !_.isEqual(reportCategory.wellDoneComment, defaultCategory.wellDoneComment)) {
	                return true;
	            }
	        }

	        return false;
	    },
	    _initCategoryIds: function _initCategoryIds() {
	        var predicate = function predicate(dc) {
	            return dc.categoryId;
	        };

	        this._categoryIds = {
	            cv: _.uniq(this.allDefaultComments.cv.map(predicate)),
	            coverLetter: _.uniq(this.allDefaultComments.coverLetter.map(predicate)),
	            linkedinProfile: _.uniq(this.allDefaultComments.linkedinProfile.map(predicate))
	        };
	    },
	    _calculateTopComments: function _calculateTopComments(categoryProductCode, categoryId) {
	        var _this = this;

	        var redCommentsForCategory = _.filter(this.listComments(categoryProductCode), function (ac) {
	            return ac.categoryId === categoryId && ac.isRedSelected === true;
	        });
	        var topCommentsForCategory = [];

	        var loopCondition = function loopCondition() {
	            if (redCommentsForCategory.length < _this.nbReportComments) {
	                return topCommentsForCategory.length < redCommentsForCategory.length;
	            }
	            return topCommentsForCategory.length < _this.nbReportComments;
	        };

	        while (loopCondition()) {
	            var topComment = this._findRedCommentWithMostPointsInListExcept(redCommentsForCategory, topCommentsForCategory);

	            if (topComment) {
	                topCommentsForCategory.push(topComment);
	            }
	        }

	        return topCommentsForCategory;
	    },
	    _listCommentsFromLocalStorage: function _listCommentsFromLocalStorage() {
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);

	        return myAssessments && myAssessments[this.orderId] ? myAssessments[this.orderId].listComments : null;
	    },


	    /*
	     * Structure of the listComments object:
	     * {
	     *   cv: [{
	     *     id: 1,
	     *     categoryId: 13,
	     *     greenText: "string",
	     *     redText: "string",
	     *     points: 5,
	     *     isGrouped: false,
	     *     isGreenSelected: true,
	     *     isRedSelected: false
	     *   },
	     *   {...}
	     *   ],
	     *   coverLetter: [],
	     *   linkedinProfile: []
	     * }
	     */
	    _saveListCommentsInLocalStorage: function _saveListCommentsInLocalStorage(comments) {
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments) || {};

	        myAssessments[this.orderId] = myAssessments[this.orderId] || {};
	        myAssessments[this.orderId].listComments = comments;

	        _browser2.default.saveInLocalStorage(_global.localStorageKeys.myAssessments, myAssessments);
	    },
	    _defaultReportCategory: function _defaultReportCategory(categoryProductCode, categoryId) {
	        return {
	            comments: this._calculateTopComments(categoryProductCode, categoryId)
	        };
	    },
	    _saveReportOverallCommentInLocalStorage: function _saveReportOverallCommentInLocalStorage(categoryProductCode, commentText) {
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);

	        myAssessments[this.orderId].report = myAssessments[this.orderId].report || {};
	        myAssessments[this.orderId].report[categoryProductCode] = myAssessments[this.orderId].report[categoryProductCode] || {};
	        myAssessments[this.orderId].report[categoryProductCode].overallComment = commentText;

	        _browser2.default.saveInLocalStorage(_global.localStorageKeys.myAssessments, myAssessments);
	    },


	    /*
	     * Structure of the report object:
	     * {
	     *   cv: {
	     *     overallComment: "something",
	     *     categories: {
	     *       12: {
	     *         comments: [],
	     *         wellDoneComment: null
	     *       }
	     *       13: {
	     *         comments: [],
	     *         wellDoneComment: null
	     *       }
	     *       14: {
	     *         comments: [],
	     *         wellDoneComment: null
	     *       }
	     *     }
	     *   },
	     *   coverLetter: {
	     *     categories: {
	     *       7: {
	     *         comments: [],
	     *         wellDoneComment: null
	     *       }
	     *     }
	     *   },
	     *   linkedinProfile: {
	     *     categories : {
	     *       16: {
	     *         comments: [],
	     *         wellDoneComment: null
	     *       }
	     *     }
	     *   }
	     * }
	     */
	    _saveReportCategoryInLocalStorage: function _saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory) {
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);

	        myAssessments[this.orderId].report = myAssessments[this.orderId].report || {};
	        myAssessments[this.orderId].report[categoryProductCode] = myAssessments[this.orderId].report[categoryProductCode] || {};
	        myAssessments[this.orderId].report[categoryProductCode].categories = myAssessments[this.orderId].report[categoryProductCode].categories || {};
	        myAssessments[this.orderId].report[categoryProductCode].categories[categoryId] = reportCategory;

	        _browser2.default.saveInLocalStorage(_global.localStorageKeys.myAssessments, myAssessments);
	    },
	    _saveReportCommentInLocalStorage: function _saveReportCommentInLocalStorage(categoryProductCode, comment) {
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);
	        var commentToUpdate = _.find(myAssessments[this.orderId].report[categoryProductCode].categories[comment.categoryId].comments, function (c) {
	            return c.id === comment.id;
	        });

	        if (commentToUpdate) {
	            Object.assign(commentToUpdate, comment);
	        } else {
	            myAssessments[this.orderId].report[categoryProductCode].categories[comment.categoryId].comments.push(comment);
	        }

	        _browser2.default.saveInLocalStorage(_global.localStorageKeys.myAssessments, myAssessments);
	    },
	    _removeReportCommentFromLocalStorage: function _removeReportCommentFromLocalStorage(categoryProductCode, comment) {
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);

	        _.remove(myAssessments[this.orderId].report[categoryProductCode].categories[comment.categoryId].comments, function (c) {
	            return c.id === comment.id;
	        });

	        _browser2.default.saveInLocalStorage(_global.localStorageKeys.myAssessments, myAssessments);
	    },
	    _findRedCommentWithMostPointsInListExcept: function _findRedCommentWithMostPointsInListExcept(redCommentsForCategory, reportCommentsForCategory) {
	        var commentWithMostPoints = null;

	        redCommentsForCategory.forEach(function (redComment) {
	            var isCommentAlreadyInList = _.find(reportCommentsForCategory, function (tc) {
	                return tc.id === redComment.id;
	            });

	            if (!isCommentAlreadyInList) {
	                if (commentWithMostPoints === null) {
	                    commentWithMostPoints = redComment;
	                } else if (redComment.points > commentWithMostPoints.points) {
	                    commentWithMostPoints = redComment;
	                }
	            }
	        });

	        return commentWithMostPoints;
	    },
	    _initListCommentsFromDocReport: function _initListCommentsFromDocReport(categoryProductCode) {
	        var _this2 = this;

	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);

	        this.listComments(categoryProductCode).forEach(function (listComment) {
	            if (_.has(myAssessments, [_this2.orderId, "report", categoryProductCode, "categories", listComment.categoryId])) {
	                var reportComments = myAssessments[_this2.orderId].report[categoryProductCode].categories[listComment.categoryId].comments;
	                var correspondingReportComment = _.find(reportComments, function (rc) {
	                    return rc.id === listComment.id;
	                });

	                if (correspondingReportComment) {
	                    // We set it to redSelected, and update the text
	                    listComment.isGreenSelected = false;
	                    listComment.isRedSelected = true;
	                    listComment.redText = correspondingReportComment.redText;
	                } else {
	                    // We set it to greenSelected
	                    listComment.isGreenSelected = true;
	                    listComment.isRedSelected = false;
	                }

	                _this2.updateListComment(listComment);
	            }
	        });
	    }
	};

	exports.default = Assessment;

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var ArrayUtils = {
	    move: function move(array, from, to) {
	        array.splice(to, 0, array.splice(from, 1)[0]);
	    }
	};

	exports.default = ArrayUtils;

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Component = React.createClass({
	    displayName: "Component",
	    render: function render() {
	        var position = this.props.position;

	        if (!position) {
	            return null;
	        }

	        return React.createElement(
	            "p",
	            { className: "position-sought" },
	            React.createElement("i", { className: "fa fa-address-card-o" }),
	            React.createElement(
	                "span",
	                null,
	                position
	            )
	        );
	    }
	});

	exports.default = Component;

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Component = React.createClass({
	    displayName: "Component",
	    render: function render() {
	        var employer = this.props.employer;

	        if (!employer) {
	            return null;
	        }

	        return React.createElement(
	            "p",
	            { className: "employer-sought" },
	            React.createElement("i", { className: "fa fa-building-o" }),
	            React.createElement(
	                "span",
	                null,
	                employer
	            )
	        );
	    }
	});

	exports.default = Component;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _product = __webpack_require__(5);

	var _product2 = _interopRequireDefault(_product);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Component = React.createClass({
	    displayName: "Component",
	    render: function render() {
	        var _this = this;

	        var order = this.props.order;

	        return React.createElement(
	            "div",
	            { ref: "root", className: "order-tags" },
	            React.createElement(
	                "section",
	                null,
	                this._couponTag(order.coupon),
	                React.createElement(
	                    "span",
	                    { className: "order-tag edition " + order.editionCode },
	                    order.editionCode
	                )
	            ),
	            React.createElement(
	                "section",
	                null,
	                order.containedProductCodes.map(function (productCode) {
	                    return React.createElement(
	                        "span",
	                        { key: order.id + "-" + productCode, className: "order-tag product-code" },
	                        React.createElement(
	                            "a",
	                            { href: order.documentUrl(_this.props.config, productCode), target: "_blank" },
	                            _product2.default.humanReadableCode(productCode)
	                        )
	                    );
	                }),
	                React.createElement(
	                    "span",
	                    { className: "order-tag lang" },
	                    order.languageCode
	                )
	            )
	        );
	    },
	    componentDidMount: function componentDidMount() {
	        this._initElements();
	        this.$tooltips.tooltip();
	    },
	    _initElements: function _initElements() {
	        var $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

	        this.$tooltips = $rootEl.find("[data-toggle=tooltip]");
	    },
	    _couponTag: function _couponTag(coupon) {
	        if (!coupon) {
	            return null;
	        }

	        return React.createElement(
	            "span",
	            { className: "order-tag coupon", "data-toggle": "tooltip", title: coupon.code },
	            coupon.campaignName
	        );
	    }
	});

	exports.default = Component;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _order = __webpack_require__(6);

	var _order2 = _interopRequireDefault(_order);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Component = React.createClass({
	    displayName: "Component",
	    render: function render() {
	        var order = this.props.order;

	        if (order.status === _order2.default.statuses.completed || order.status === _order2.default.statuses.scheduled) {
	            return null;
	        }

	        var dueMoment = moment(order.dueTimestamp);
	        var timeLeft = moment.duration(dueMoment.valueOf() - moment().valueOf());

	        return React.createElement(
	            "p",
	            { className: "time-left" },
	            timeLeft.hours(),
	            "h",
	            timeLeft.minutes(),
	            "m left"
	        );
	    }
	});

	exports.default = Component;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _store = __webpack_require__(7);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Component = React.createClass({
	    displayName: "Component",
	    render: function render() {
	        var c = this.props.comment;

	        var listCommentClasses = classNames({
	            "list-comment": true,
	            grouped: c.isGrouped,
	            "read-only": _store2.default.isOrderReadOnly()
	        });

	        var greenParagraphClasses = classNames({
	            "comment-paragraph": true,
	            selected: c.isGreenSelected
	        });
	        var redParagraphClasses = classNames({
	            "comment-paragraph": true,
	            selected: c.isRedSelected
	        });

	        return React.createElement(
	            "li",
	            { ref: "root", className: listCommentClasses, "data-comment-id": c.id },
	            React.createElement(
	                "div",
	                { className: "green" },
	                React.createElement(
	                    "p",
	                    { className: greenParagraphClasses, onClick: this._handleGreenParagraphClick },
	                    c.greenText
	                )
	            ),
	            React.createElement(
	                "div",
	                { className: "red" },
	                React.createElement(
	                    "p",
	                    { className: redParagraphClasses, onClick: this._handleRedParagraphClick, onBlur: this._handleRedParagraphBlur },
	                    c.redText
	                ),
	                React.createElement("button", { type: "button", className: "styleless fa fa-plus-circle", onClick: this._handleAddClick }),
	                React.createElement("button", { type: "button", className: "styleless fa fa-undo", onClick: this._handleResetClick })
	            ),
	            React.createElement(
	                "div",
	                { className: "id-and-points" },
	                React.createElement(
	                    "p",
	                    null,
	                    c.id
	                ),
	                React.createElement(
	                    "p",
	                    null,
	                    c.points,
	                    "pt"
	                )
	            )
	        );
	    },
	    componentDidMount: function componentDidMount() {
	        this._initElements();
	    },
	    componentDidUpdate: function componentDidUpdate() {
	        this._addContentEditableToParagraphs();
	    },
	    _initElements: function _initElements() {
	        var $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

	        this.$redParagraphs = $rootEl.children(".red").children(".comment-paragraph");
	    },
	    _addContentEditableToParagraphs: function _addContentEditableToParagraphs() {
	        if (!_store2.default.isOrderReadOnly()) {
	            _.forEach(this.$redParagraphs, function (p) {
	                return $(p).attr("contenteditable", "true");
	            });
	        }
	    },
	    _handleGreenParagraphClick: function _handleGreenParagraphClick() {
	        if (!_store2.default.isOrderReadOnly()) {
	            var c = this.props.comment;

	            c.isRedSelected = false;
	            c.isGreenSelected = true;

	            _store2.default.updateListComment(c);
	        }
	    },
	    _handleRedParagraphClick: function _handleRedParagraphClick() {
	        if (!_store2.default.isOrderReadOnly()) {
	            var c = this.props.comment;

	            c.isGreenSelected = false;
	            c.isRedSelected = true;

	            _store2.default.updateListComment(c);

	            this._selectNextCommentAsRedIfGrouped();
	        }
	    },
	    _selectNextCommentAsRedIfGrouped: function _selectNextCommentAsRedIfGrouped() {
	        var _this = this;

	        var categoryProductCode = null;
	        var indexOfNextCommentInList = -1;

	        _.keys(_store2.default.allDefaultComments).forEach(function (categoryProductCd) {
	            var docDefaultComments = _store2.default.allDefaultComments[categoryProductCd];

	            for (var i = 0; i < docDefaultComments.length; i++) {
	                if (docDefaultComments[i].id === _this.props.comment.id) {
	                    categoryProductCode = categoryProductCd;
	                    indexOfNextCommentInList = i + 1;
	                    break;
	                }
	            }
	        });

	        var nextComment = indexOfNextCommentInList > -1 ? _store2.default.allDefaultComments[categoryProductCode][indexOfNextCommentInList] : null;

	        // eslint-disable-next-line no-undefined
	        if (nextComment && nextComment.isGrouped && nextComment.isGreenSelected === undefined && nextComment.isRedSelected === undefined) {
	            nextComment.isGreenSelected = false;
	            nextComment.isRedSelected = true;

	            _store2.default.updateListComment(nextComment);
	        }
	    },
	    _handleRedParagraphBlur: function _handleRedParagraphBlur(e) {
	        var c = this.props.comment;

	        c.redText = $(e.currentTarget).text();

	        _store2.default.updateCommentInListAndReport(c);
	    },
	    _handleAddClick: function _handleAddClick() {
	        if (!_store2.default.isOrderReadOnly()) {
	            this._handleRedParagraphClick();
	            _store2.default.addReportComment(this.props.comment);
	        }
	    },
	    _handleResetClick: function _handleResetClick() {
	        if (!_store2.default.isOrderReadOnly()) {
	            _store2.default.resetCommentInListAndReport(this.props.comment);
	        }
	    }
	});

	exports.default = Component;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _assessment = __webpack_require__(10);

	var _assessment2 = _interopRequireDefault(_assessment);

	var _string = __webpack_require__(8);

	var _string2 = _interopRequireDefault(_string);

	var _keyboard = __webpack_require__(18);

	var _keyboard2 = _interopRequireDefault(_keyboard);

	var _store = __webpack_require__(7);

	var _store2 = _interopRequireDefault(_store);

	var _reportComment = __webpack_require__(19);

	var _reportComment2 = _interopRequireDefault(_reportComment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Component = React.createClass({
	    displayName: "Component",
	    getInitialState: function getInitialState() {
	        return {
	            wellDoneComment: this.props.reportCategory.wellDoneComment || this._defaultWellDoneComment()
	        };
	    },
	    render: function render() {
	        var reportCategory = this.props.reportCategory;

	        var liClasses = classNames({
	            "report-category": true,
	            "read-only": _store2.default.isOrderReadOnly()
	        });

	        return React.createElement(
	            "li",
	            { ref: "root", className: liClasses },
	            React.createElement(
	                "h3",
	                null,
	                _store2.default.i18nMessages["category.title." + reportCategory.id]
	            ),
	            this._wellDoneComment(),
	            React.createElement(
	                "ul",
	                { className: "styleless" },
	                reportCategory.comments.map(function (comment) {
	                    return React.createElement(_reportComment2.default, { key: comment.id, comment: comment });
	                })
	            ),
	            React.createElement(
	                "div",
	                { className: "comment-composer hidden" },
	                React.createElement("textarea", { className: "form-control", onKeyUp: this._handleComposerKeyUp }),
	                React.createElement("button", { type: "button", className: "styleless fa fa-times", onClick: this._hideComposer })
	            ),
	            React.createElement(
	                "button",
	                { type: "button", className: "btn secondary", onClick: this._handleAddCommentClick },
	                "Add comment"
	            )
	        );
	    },
	    componentDidMount: function componentDidMount() {
	        this._initElements();
	        this._disableActionableElementsIfRequired();
	        this._makeCommentsSortable();
	    },
	    _initElements: function _initElements() {
	        var $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

	        this.$wellDoneCommentComposer = $rootEl.children(".well-done-comment-composer");
	        this.$wellDoneCommentTextarea = this.$wellDoneCommentComposer.children("textarea");

	        this.$commentList = $rootEl.children("ul");

	        this.$addCommentComposer = $rootEl.children(".comment-composer");
	        this.$addCommentTextarea = this.$addCommentComposer.children("textarea");
	        this.$addCommentBtn = $rootEl.children(".btn");
	    },
	    _disableActionableElementsIfRequired: function _disableActionableElementsIfRequired() {
	        if (_store2.default.isOrderReadOnly()) {
	            this.$wellDoneCommentTextarea.prop("disabled", true);
	            this.$addCommentBtn.prop("disabled", true);
	            this.$addCommentTextarea.prop("disabled", true);
	        }
	    },
	    _makeCommentsSortable: function _makeCommentsSortable() {
	        var _this = this;

	        if (!_store2.default.isOrderReadOnly()) {

	            // eslint-disable-next-line no-new
	            new Sortable(this.$commentList.get(0), {
	                animation: 150,
	                onUpdate: function onUpdate(e) {
	                    return _store2.default.handleReportCommentsReorder(_this.props.reportCategory.id, e.oldIndex, e.newIndex);
	                },
	                handle: ".fa-arrows"
	            });
	        }
	    },
	    _wellDoneComment: function _wellDoneComment() {
	        if (_store2.default.assessment.categoryScore(this.props.reportCategory.id) < _assessment2.default.minScoreForWellDoneComment) {
	            return null;
	        }

	        this._updateWellDoneComment(false);

	        return React.createElement(
	            "div",
	            { className: "well-done-comment-composer" },
	            React.createElement(
	                "label",
	                null,
	                "Top comment"
	            ),
	            React.createElement("textarea", { className: "form-control", value: this.state.wellDoneComment, onChange: this._handleWellDoneCommentChange, onBlur: this._handleWellDoneCommentBlur })
	        );
	    },
	    _defaultWellDoneComment: function _defaultWellDoneComment() {
	        return _store2.default.i18nMessages["wellDone.comment." + this.props.reportCategory.id];
	    },
	    _handleAddCommentClick: function _handleAddCommentClick() {
	        if (!_store2.default.isOrderReadOnly()) {
	            this.$addCommentBtn.hide();
	            this.$addCommentComposer.removeClass("hidden");
	            this.$addCommentTextarea.focus();
	            this._adaptTextareaHeight();
	        }
	    },
	    _handleComposerKeyUp: function _handleComposerKeyUp(e) {
	        this._adaptTextareaHeight();

	        if (e.keyCode === _keyboard2.default.keyCodes.enter) {
	            this._hideComposer();

	            _store2.default.addReportComment({
	                id: _string2.default.uuid(),
	                categoryId: this.props.reportCategory.id,
	                redText: this.$addCommentTextarea.val()
	            });

	            this.$addCommentTextarea.val(null);
	        }
	    },
	    _handleWellDoneCommentChange: function _handleWellDoneCommentChange() {
	        this.setState({
	            wellDoneComment: this.$wellDoneCommentTextarea.val()
	        });
	    },
	    _handleWellDoneCommentBlur: function _handleWellDoneCommentBlur() {
	        this._updateWellDoneComment();
	    },
	    _adaptTextareaHeight: function _adaptTextareaHeight() {
	        var ta = this.$addCommentTextarea.get(0);

	        if (ta.clientHeight < ta.scrollHeight) {
	            ta.style.height = ta.scrollHeight + 2 + "px";
	        }
	    },
	    _hideComposer: function _hideComposer() {
	        this.$addCommentComposer.addClass("hidden");
	        this.$addCommentBtn.show();
	    },
	    _updateWellDoneComment: function _updateWellDoneComment() {
	        var isRefreshRequired = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

	        var updatedReportCategory = this.props.reportCategory;

	        updatedReportCategory.wellDoneComment = this.state.wellDoneComment;

	        _store2.default.updateReportCategory(updatedReportCategory, isRefreshRequired);
	    }
	});

	// eslint-disable-next-line no-unused-vars
	exports.default = Component;

/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Keyboard = {
	    keyCodes: {
	        backspace: 8,
	        tab: 9,
	        enter: 13,
	        shift: 16,
	        ctrl: 17,
	        alt: 18,
	        escape: 27,
	        space: 32
	    },

	    isPressedKeyText: function isPressedKeyText(e) {
	        var keyCode = e.keyCode;

	        return keyCode !== this.keyCode.tab && keyCode !== this.keyCode.enter && keyCode !== this.keyCode.shift && keyCode !== this.keyCode.ctrl && keyCode !== this.keyCode.alt && keyCode !== this.keyCode.escape && keyCode !== this.keyCode.space;
	    }
	};

	exports.default = Keyboard;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _global = __webpack_require__(1);

	var _animator = __webpack_require__(2);

	var _store = __webpack_require__(7);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Component = React.createClass({
	    displayName: "Component",
	    render: function render() {
	        var c = this.props.comment;

	        var liClasses = classNames({
	            "report-comment": true,
	            "from-list": c.isRedSelected,
	            "well-done": c.isWellDone
	        });

	        var checkboxClasses = classNames({
	            "report-comment-checkbox": true,
	            checked: c.isChecked
	        });

	        return React.createElement(
	            "li",
	            { ref: "root", "data-comment-id": c.id, className: liClasses },
	            React.createElement("button", { type: "button", className: "styleless fa fa-arrows fa-fw" }),
	            React.createElement(
	                "p",
	                { className: "comment-paragraph", onBlur: this._handleParagraphBlur },
	                c.redText
	            ),
	            React.createElement("span", { className: checkboxClasses, onClick: this._handleCheckboxClick }),
	            React.createElement("button", { type: "button", className: "styleless fa fa-undo fa-fw", onClick: this._handleResetClick }),
	            React.createElement("button", { type: "button", className: "styleless fa fa-trash fa-fw", onClick: this._handleRemoveClick })
	        );
	    },
	    componentDidMount: function componentDidMount() {
	        this._initElements();

	        if (!_store2.default.isOrderReadOnly()) {
	            this.$commentParagraph.attr("contenteditable", "true");
	        }
	    },
	    _initElements: function _initElements() {
	        this.$li = $(ReactDOM.findDOMNode(this.refs.root));
	        this.$commentParagraph = this.$li.children(".comment-paragraph");
	    },
	    _handleParagraphBlur: function _handleParagraphBlur(e) {
	        var c = this.props.comment;

	        c.redText = $(e.currentTarget).text();

	        _store2.default.updateCommentInListAndReport(c);
	    },
	    _handleResetClick: function _handleResetClick() {
	        if (!_store2.default.isOrderReadOnly()) {
	            _store2.default.resetCommentInListAndReport(this.props.comment);
	        }
	    },
	    _handleRemoveClick: function _handleRemoveClick() {
	        var _this = this;

	        if (!_store2.default.isOrderReadOnly()) {
	            (0, _animator.fadeOut)(this.$li, {
	                animationDuration: _global.animationDurations.short,
	                onComplete: function onComplete() {
	                    return _store2.default.removeReportComment(_this.props.comment);
	                }
	            });
	        }
	    },
	    _handleCheckboxClick: function _handleCheckboxClick() {
	        if (!_store2.default.isOrderReadOnly()) {
	            var updatedComment = this.props.comment;

	            updatedComment.isChecked = updatedComment.isChecked ? false : true;

	            _store2.default.updateReportCommentIfExists(updatedComment);
	        }
	    }
	});

	exports.default = Component;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _order = __webpack_require__(6);

	var _order2 = _interopRequireDefault(_order);

	var _store = __webpack_require__(7);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Component = React.createClass({
	    displayName: "Component",
	    render: function render() {
	        if (!_store2.default.isOrderStartable()) {
	            return null;
	        }

	        return React.createElement(
	            "button",
	            { className: "btn btn-primary", onClick: this._handleClick },
	            "Start assessment"
	        );
	    },
	    _handleClick: function _handleClick() {
	        _store2.default.updateOrderStatus(_order2.default.statuses.inProgress);
	    }
	});

	exports.default = Component;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _animator = __webpack_require__(2);

	var _category = __webpack_require__(4);

	var _category2 = _interopRequireDefault(_category);

	var _store = __webpack_require__(7);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Component = React.createClass({
	    displayName: "Component",
	    render: function render() {
	        var _this = this;

	        if (!_store2.default.assessment) {
	            return null;
	        }

	        return React.createElement(
	            "section",
	            null,
	            _.values(_category2.default.productCodes).map(function (categoryProductCode) {
	                return React.createElement(
	                    "div",
	                    { key: categoryProductCode, className: "nav assessment " + categoryProductCode },
	                    React.createElement(
	                        "ul",
	                        { className: "styleless" },
	                        _this._categoryLinks(categoryProductCode)
	                    ),
	                    React.createElement(
	                        "div",
	                        null,
	                        React.createElement(
	                            "a",
	                            { href: "#" + categoryProductCode + "-report-form", onClick: _this._handleScrollToLinkClick },
	                            "Report form"
	                        )
	                    )
	                );
	            })
	        );
	    },
	    componentDidUpdate: function componentDidUpdate() {
	        this._initElements();
	    },
	    _initElements: function _initElements() {
	        this.$siteHeader = $("#container").children("header");
	    },
	    _categoryLinks: function _categoryLinks(categoryProductCode) {
	        var _this2 = this;

	        return _store2.default.assessment.categoryIds(categoryProductCode).map(function (categoryId) {
	            return React.createElement(
	                "li",
	                { key: categoryId },
	                React.createElement(
	                    "a",
	                    { href: "#list-category-" + categoryId, onClick: _this2._handleScrollToLinkClick },
	                    _store2.default.i18nMessages["category.title." + categoryId]
	                )
	            );
	        });
	    },
	    _handleScrollToLinkClick: function _handleScrollToLinkClick(e) {
	        (0, _animator.scrollTo)(e, this.$siteHeader.height());
	    }
	});

	exports.default = Component;

/***/ }
/******/ ]);