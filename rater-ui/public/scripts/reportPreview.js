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

	var _browser = __webpack_require__(1);

	var _browser2 = _interopRequireDefault(_browser);

	var _category = __webpack_require__(2);

	var _category2 = _interopRequireDefault(_category);

	var _product = __webpack_require__(3);

	var _product2 = _interopRequireDefault(_product);

	var _store = __webpack_require__(4);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var controller = {
	    init: function init() {
	        _store2.default.reactComponent = ReactDOM.render(React.createElement(this.reactComponent), document.querySelector("[role=main]"));

	        _store2.default.init();
	    },


	    reactComponent: React.createClass({
	        displayName: "reactComponent",
	        render: function render() {
	            var order = _store2.default.order;
	            var editionCode = order.editionCode;
	            var editionClasses = "edition " + editionCode;

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
	                            _store2.default.i18nMessages["report.title"]
	                        )
	                    )
	                ),
	                React.createElement(
	                    "div",
	                    { className: "with-circles" },
	                    this._subTitle(),
	                    React.createElement(
	                        "header",
	                        null,
	                        React.createElement(
	                            "p",
	                            null,
	                            React.createElement(
	                                "span",
	                                { className: "assessment-label light-font" },
	                                _store2.default.i18nMessages["report.orderCreationDate.label"],
	                                ":"
	                            ),
	                            moment(order.creationTimestamp).format("lll")
	                        ),
	                        React.createElement(
	                            "span",
	                            { className: editionClasses },
	                            _store2.default.i18nMessages["edition.name." + editionCode]
	                        )
	                    ),
	                    React.createElement(
	                        "section",
	                        null,
	                        React.createElement(
	                            "ul",
	                            { className: "nav nav-pills", role: "tablist" },
	                            this._tab(_category2.default.productCodes.cv, true),
	                            this._tab(_category2.default.productCodes.coverLetter),
	                            this._tab(_category2.default.productCodes.linkedinProfile)
	                        ),
	                        React.createElement(
	                            "div",
	                            { className: "tab-content" },
	                            this._tabPane(_category2.default.productCodes.cv, true),
	                            this._tabPane(_category2.default.productCodes.coverLetter),
	                            this._tabPane(_category2.default.productCodes.linkedinProfile)
	                        )
	                    )
	                )
	            );
	        },
	        _subTitle: function _subTitle() {
	            var order = _store2.default.order;

	            if (order.positionSought && order.employerSought) {
	                return order.positionSought + "-" + order.employerSought;
	            }
	            if (order.positionSought) {
	                return order.positionSought;
	            }
	            if (order.employerSought) {
	                return order.employerSought;
	            }

	            return _store2.default.i18nMessages["report.subtitle"];
	        },
	        _tab: function _tab(categoryProductCode) {
	            var isActive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	            var classes = classNames({
	                active: isActive
	            });
	            var attr = this._tabAttr(categoryProductCode);
	            var label = _browser2.default.isSmallScreen() ? _store2.default.i18nMessages["report.tabNameSmallScreen." + categoryProductCode] : _store2.default.i18nMessages["report.tabName." + categoryProductCode];

	            return React.createElement(
	                "li",
	                { role: "presentation", className: classes },
	                React.createElement(
	                    "a",
	                    { href: "#" + attr, "aria-controls": attr, role: "tab", "data-toggle": "tab", onClick: this._handleTabClick },
	                    label
	                )
	            );
	        },
	        _tabPane: function _tabPane(categoryProductCode) {
	            var isActive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	            var classes = classNames({
	                "tab-pane fade in": true,
	                active: isActive
	            });
	            var attr = this._tabAttr(categoryProductCode);

	            return React.createElement(
	                "div",
	                { role: "tabpanel", className: classes, id: attr },
	                this._documentReportSection(categoryProductCode)
	            );
	        },
	        _tabAttr: function _tabAttr(categoryProductCode) {
	            return categoryProductCode + "-report-panel";
	        },
	        _documentReportSection: function _documentReportSection(categoryProductCode) {
	            if (!_.find(_store2.default.order.containedProductCodes, _product2.default.codes[categoryProductCode])) {
	                return React.createElement(
	                    "div",
	                    { className: "sheet-of-paper centered-contents" },
	                    React.createElement(
	                        "p",
	                        null,
	                        _store2.default.i18nMessages["report.unorderedAssessment.text"]
	                    ),
	                    React.createElement(
	                        "a",
	                        { className: "btn btn-danger new-assessment", href: "/order" },
	                        _store2.default.i18nMessages["report.unorderedAssessment.orderBtn.text"],
	                        React.createElement("i", { className: "fa fa-plus" })
	                    )
	                );
	            }

	            var documentUrl = /* TODO this._getDocumentUrl(store.order.getId(), store.order.getIdInBase64(), productCode) */null;
	            var thumbnailUrl = /* TODO this._getThumbnailUrl(store.order.getId(), productCode) */null;

	            var docReport = this.state.cvReport;
	            var docReportScores = this.state.cvReportScores;

	            if (categoryProductCode === CR.Models.Product.codes.COVER_LETTER_REVIEW) {
	                docReport = this.state.coverLetterReport;
	                docReportScores = this.state.coverLetterReportScores;
	            } else if (categoryProductCode === CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW) {
	                docReport = this.state.linkedinProfileReport;
	                docReportScores = this.state.linkedinProfileReportScores;
	            }

	            var reportAnalysisExplanationText = _store2.default.i18nMessages["report.analysis.explanation.text"];
	            var docLabel = _store2.default.i18nMessages["report.analysis.explanation.docLabel." + categoryProductCode];
	            var templatedExplanationText = CR.Services.String.template(reportAnalysisExplanationText, "docLabel", docLabel);

	            var overallCommentParagraph = docReport.overallComment ? React.createElement(
	                "p",
	                null,
	                docReport.overallComment
	            ) : null;

	            return React.createElement(
	                "div",
	                null,
	                React.createElement(
	                    "section",
	                    { className: "sheet-of-paper summary" },
	                    React.createElement(
	                        "h2",
	                        null,
	                        _store2.default.i18nMessages["report.summary.title"]
	                    ),
	                    React.createElement(
	                        "section",
	                        null,
	                        React.createElement(
	                            "div",
	                            { className: "centered-contents" },
	                            React.createElement(
	                                "a",
	                                { href: documentUrl, target: "_blank" },
	                                React.createElement("img", { src: thumbnailUrl })
	                            ),
	                            React.createElement(
	                                "div",
	                                null,
	                                React.createElement(
	                                    "a",
	                                    { href: documentUrl, target: "_blank", className: "pdf-link" },
	                                    _store2.default.i18nMessages["report.summary.documentLink.text"]
	                                )
	                            )
	                        ),
	                        React.createElement(
	                            "div",
	                            { className: "report-summary-text-wrapper" },
	                            overallCommentParagraph,
	                            React.createElement("p", { className: "light-font", dangerouslySetInnerHTML: { __html: this._getSummary(categoryProductCode, docReportScores.globalScore) } })
	                        )
	                    ),
	                    React.createElement(
	                        "article",
	                        { className: "global-score-wrapper" },
	                        React.createElement(
	                            "section",
	                            null,
	                            React.createElement(
	                                "p",
	                                null,
	                                _store2.default.i18nMessages["report.summary.score.label"],
	                                ":"
	                            ),
	                            React.createElement(
	                                "p",
	                                null,
	                                docReportScores.globalScore
	                            )
	                        ),
	                        React.createElement(
	                            "section",
	                            null,
	                            React.createElement(
	                                "div",
	                                { className: "score-bar-text-labels" },
	                                React.createElement(
	                                    "span",
	                                    { className: "score-bar-text-label weak" },
	                                    _store2.default.i18nMessages["report.summary.score.bar.label.weak"]
	                                ),
	                                React.createElement(
	                                    "span",
	                                    { className: "score-bar-text-label good" },
	                                    _store2.default.i18nMessages["report.summary.score.bar.label.good"]
	                                ),
	                                React.createElement(
	                                    "span",
	                                    { className: "score-bar-text-label excellent" },
	                                    _store2.default.i18nMessages["report.summary.score.bar.label.excellent"]
	                                )
	                            ),
	                            React.createElement(
	                                "div",
	                                { id: "score-bar" },
	                                React.createElement("img", { src: "/assets/images/score-bar.png" }),
	                                React.createElement("span", null)
	                            ),
	                            React.createElement(
	                                "div",
	                                { className: "score-bar-number-labels" },
	                                React.createElement(
	                                    "span",
	                                    null,
	                                    "0"
	                                ),
	                                React.createElement(
	                                    "span",
	                                    null,
	                                    "100"
	                                )
	                            )
	                        )
	                    ),
	                    React.createElement(
	                        "article",
	                        { className: "expandable-panel" },
	                        React.createElement(
	                            "header",
	                            null,
	                            React.createElement(
	                                "span",
	                                null,
	                                _store2.default.i18nMessages["report.summary.understandYourScore.title"]
	                            ),
	                            React.createElement("button", { className: "styleless" })
	                        ),
	                        React.createElement(
	                            "div",
	                            null,
	                            React.createElement("p", { className: "score-explanation-paragraph", dangerouslySetInnerHTML: { __html: _store2.default.i18nMessages["report.summary.understandYourScore.cScoreExplanation.text"] } }),
	                            React.createElement(
	                                "ul",
	                                { className: "styleless" },
	                                React.createElement(
	                                    "li",
	                                    null,
	                                    React.createElement(
	                                        "div",
	                                        { className: "highlighted-number weak" },
	                                        React.createElement(
	                                            "span",
	                                            null,
	                                            "0"
	                                        ),
	                                        React.createElement(
	                                            "span",
	                                            { className: "separator small-screen" },
	                                            "|"
	                                        ),
	                                        React.createElement(
	                                            "span",
	                                            { className: "separator large-screen" },
	                                            "-"
	                                        ),
	                                        React.createElement(
	                                            "span",
	                                            null,
	                                            "36"
	                                        )
	                                    ),
	                                    React.createElement(
	                                        "p",
	                                        { className: "light-font" },
	                                        _store2.default.i18nMessages["report.summary.understandYourScore.weak.text"]
	                                    )
	                                ),
	                                React.createElement(
	                                    "li",
	                                    null,
	                                    React.createElement(
	                                        "div",
	                                        { className: "highlighted-number good" },
	                                        React.createElement(
	                                            "span",
	                                            null,
	                                            "37"
	                                        ),
	                                        React.createElement(
	                                            "span",
	                                            { className: "separator small-screen" },
	                                            "|"
	                                        ),
	                                        React.createElement(
	                                            "span",
	                                            { className: "separator large-screen" },
	                                            "-"
	                                        ),
	                                        React.createElement(
	                                            "span",
	                                            null,
	                                            "79"
	                                        )
	                                    ),
	                                    React.createElement(
	                                        "p",
	                                        { className: "light-font" },
	                                        _store2.default.i18nMessages["report.summary.understandYourScore.good.text"]
	                                    )
	                                ),
	                                React.createElement(
	                                    "li",
	                                    null,
	                                    React.createElement(
	                                        "div",
	                                        { className: "highlighted-number excellent" },
	                                        React.createElement(
	                                            "span",
	                                            null,
	                                            "80"
	                                        ),
	                                        React.createElement(
	                                            "span",
	                                            { className: "separator small-screen" },
	                                            "|"
	                                        ),
	                                        React.createElement(
	                                            "span",
	                                            { className: "separator large-screen" },
	                                            "-"
	                                        ),
	                                        React.createElement(
	                                            "span",
	                                            null,
	                                            "100"
	                                        )
	                                    ),
	                                    React.createElement(
	                                        "p",
	                                        { className: "light-font" },
	                                        _store2.default.i18nMessages["report.summary.understandYourScore.excellent.text"]
	                                    )
	                                )
	                            )
	                        )
	                    )
	                ),
	                React.createElement(
	                    "section",
	                    { className: "report-analysis" },
	                    React.createElement(
	                        "header",
	                        { className: "sheet-of-paper" },
	                        React.createElement(
	                            "h2",
	                            null,
	                            _store2.default.i18nMessages["report.analysis.title"]
	                        ),
	                        React.createElement("p", { className: "light-font", dangerouslySetInnerHTML: { __html: templatedExplanationText } })
	                    ),
	                    React.createElement(
	                        "ul",
	                        { className: "styleless" },
	                        this._getCategoriesAndTheirComments(docReport).map(function (categoryAndItsComments) {
	                            var categoryId = categoryAndItsComments.categoryId;
	                            var categoryClasses = "category sheet-of-paper id-" + categoryId;

	                            var topCommentParagraph = null;

	                            if (categoryAndItsComments.topComment) {
	                                topCommentParagraph = React.createElement(
	                                    "p",
	                                    { className: "well" },
	                                    categoryAndItsComments.topComment.text
	                                );
	                            }

	                            var redCommentList = null;

	                            if (!_.isEmpty(categoryAndItsComments.redComments)) {
	                                redCommentList = React.createElement(
	                                    "ul",
	                                    { className: "red-comments light-font" },
	                                    categoryAndItsComments.redComments.map(function (comment) {
	                                        return React.createElement("li", { key: comment.id, dangerouslySetInnerHTML: { __html: this._getCommentWithProcessedLinks(comment.text) } });
	                                    }.bind(this))
	                                );
	                            }

	                            return React.createElement(
	                                "li",
	                                { key: categoryId, className: categoryClasses },
	                                React.createElement(
	                                    "header",
	                                    null,
	                                    React.createElement(
	                                        "div",
	                                        null,
	                                        React.createElement(
	                                            "h3",
	                                            null,
	                                            _store2.default.i18nMessages["category." + categoryProductCode + "." + categoryId + ".title"]
	                                        ),
	                                        React.createElement(
	                                            "span",
	                                            { className: "highlighted-number" },
	                                            docReportScores.categoryScores[categoryId]
	                                        )
	                                    ),
	                                    React.createElement(
	                                        "p",
	                                        null,
	                                        _store2.default.i18nMessages["category." + categoryProductCode + "." + categoryId + ".shortDesc"]
	                                    )
	                                ),
	                                topCommentParagraph,
	                                redCommentList
	                            );
	                        }.bind(this))
	                    )
	                )
	            );
	        }
	    })
	};

	controller.init();

/***/ },
/* 1 */
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

/***/ },
/* 2 */
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
/* 3 */
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _account = __webpack_require__(5);

	var _account2 = _interopRequireDefault(_account);

	var _order = __webpack_require__(6);

	var _order2 = _interopRequireDefault(_order);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var store = {
	    reactComponent: null,
	    account: Object.assign(Object.create(_account2.default), CR.ControllerData.account),
	    config: CR.ControllerData.config,
	    order: Object.assign(Object.create(_order2.default), CR.ControllerData.order),
	    assessmentReport: CR.ControllerData.assessmentReport,
	    assessmentReportScores: CR.ControllerData.assessmentReportScores,
	    cvAverageScore: CR.ControllerData.cvAverageScore,
	    coverLetterAverageScore: CR.ControllerData.coverLetterAverageScore,
	    linkedinProfileAverageScore: CR.ControllerData.linkedinProfileAverageScore,
	    i18nMessages: CR.ControllerData.i18nMessages,

	    init: function init() {

	        // TODO: remove
	        console.log("order", this.order);
	        console.log("assessmentReport", this.assessmentReport);
	        console.log("assessmentReportScores", this.assessmentReportScores);
	        console.log("cvAverageScore", this.cvAverageScore);
	        console.log("coverLetterAverageScore", this.coverLetterAverageScore);
	        console.log("linkedinProfileAverageScore", this.linkedinProfileAverageScore);
	    }
	};

	exports.default = store;

/***/ },
/* 5 */
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _product = __webpack_require__(3);

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


	    // Raters who are not assigned should still be able to check the assessment, even before it's completed
	    isReadOnlyBy: function isReadOnlyBy(raterId) {
	        return this.status === Order.statuses.completed || this.status === Order.statuses.scheduled || !this.rater || this.rater.id !== raterId;
	    }
	};

	exports.default = Order;

/***/ }
/******/ ]);