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

	var _category = __webpack_require__(1);

	var _category2 = _interopRequireDefault(_category);

	var _assessment = __webpack_require__(2);

	var _assessment2 = _interopRequireDefault(_assessment);

	var _store = __webpack_require__(6);

	var _store2 = _interopRequireDefault(_store);

	var _positionSought = __webpack_require__(10);

	var _positionSought2 = _interopRequireDefault(_positionSought);

	var _employerSought = __webpack_require__(11);

	var _employerSought2 = _interopRequireDefault(_employerSought);

	var _orderTags = __webpack_require__(12);

	var _orderTags2 = _interopRequireDefault(_orderTags);

	var _timeLeft = __webpack_require__(13);

	var _timeLeft2 = _interopRequireDefault(_timeLeft);

	var _greenRedAssessmentComment = __webpack_require__(14);

	var _greenRedAssessmentComment2 = _interopRequireDefault(_greenRedAssessmentComment);

	var _reportCategory = __webpack_require__(15);

	var _reportCategory2 = _interopRequireDefault(_reportCategory);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	        getInitialState: function getInitialState() {
	            return _store2.default;
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
	                        this._heading()
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
	                            null,
	                            React.createElement(
	                                "div",
	                                null,
	                                React.createElement(_positionSought2.default, { position: order.positionSought }),
	                                React.createElement(_employerSought2.default, { employer: order.employerSought })
	                            ),
	                            this._customerComment(order.customerComment),
	                            this._jobAdUrl(order.jobAdUrl)
	                        ),
	                        React.createElement(
	                            "section",
	                            null,
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
	                            null,
	                            React.createElement(
	                                "div",
	                                null,
	                                this._previewBtn(order.isReadOnlyBy(_store2.default.account.id))
	                            ),
	                            React.createElement(_timeLeft2.default, { order: order })
	                        )
	                    ),
	                    React.createElement(
	                        "ul",
	                        { className: "nav nav-tabs", role: "tablist" },
	                        this._tab(_category2.default.productCodes.cv, "CV", true),
	                        this._tab(_category2.default.productCodes.coverLetter, "Cover Letter"),
	                        this._tab(_category2.default.productCodes.linkedinProfile, "Linkedin Profile")
	                    ),
	                    React.createElement(
	                        "div",
	                        { className: "tab-content" },
	                        this._tabPane(_category2.default.productCodes.cv, true),
	                        this._tabPane(_category2.default.productCodes.coverLetter),
	                        this._tabPane(_category2.default.productCodes.linkedinProfile)
	                    )
	                )
	            );
	        },
	        _heading: function _heading() {
	            var text = "Assessment #" + _store2.default.order.id;

	            return React.createElement(
	                "h1",
	                null,
	                text
	            );
	        },
	        _customerComment: function _customerComment(customerComment) {
	            if (!customerComment) {
	                return null;
	            }
	            return React.createElement(
	                "p",
	                null,
	                customerComment
	            );
	        },
	        _jobAdUrl: function _jobAdUrl(jobAdUrl) {
	            if (!jobAdUrl) {
	                return null;
	            }
	            return React.createElement(
	                "a",
	                { href: jobAdUrl, target: "_blank" },
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
	        _previewBtn: function _previewBtn(isReadOnly) {
	            if (isReadOnly) {
	                return null;
	            }
	            return React.createElement(
	                "button",
	                { className: "btn btn-primary" },
	                "Preview assessment"
	            );
	        },
	        _tab: function _tab(categoryProductCode, label) {
	            var isActive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	            var classes = classNames({
	                active: isActive
	            });
	            var attr = categoryProductCode + "-comments-selection-panel";

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
	            var attr = categoryProductCode + "-comments-selection-panel";

	            return React.createElement(
	                "div",
	                { role: "tabpanel", className: classes, id: attr, "data-product-code": categoryProductCode },
	                this._listCategory(categoryProductCode),
	                this._assessmentForm(categoryProductCode)
	            );
	        },
	        _listCategory: function _listCategory(categoryProductCode) {
	            if (_store2.default.categoryIds) {
	                return _store2.default.categoryIds[categoryProductCode].map(function (categoryId) {
	                    var elId = "list-category-" + categoryId;
	                    var listCommentsForThisCategory = _.filter(_assessment2.default.listComments(categoryProductCode), function (ac) {
	                        return ac.categoryId === categoryId;
	                    });

	                    return React.createElement(
	                        "section",
	                        { key: elId, id: elId },
	                        React.createElement(
	                            "h3",
	                            null,
	                            _category2.default.titles[_store2.default.order.languageCode][categoryId]
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
	        _assessmentForm: function _assessmentForm(categoryProductCode) {
	            return React.createElement(
	                "form",
	                { className: "report-form single-column-panel" },
	                React.createElement(
	                    "div",
	                    { className: "form-group" },
	                    React.createElement(
	                        "label",
	                        null,
	                        "Overall comment"
	                    ),
	                    React.createElement("textarea", { className: "form-control overall-comment" })
	                ),
	                this._reportCategories(categoryProductCode)
	            );
	        },
	        _reportCategories: function _reportCategories(categoryProductCode) {
	            if (_store2.default.categoryIds && _assessment2.default.areAllListCommentsSelected(categoryProductCode)) {
	                return React.createElement(
	                    "ul",
	                    { className: "styleless" },
	                    _store2.default.categoryIds[categoryProductCode].map(function (categoryId) {
	                        var reportCategory = _assessment2.default.reportCategory(categoryProductCode, categoryId);

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
	        }
	    })
	};

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
	var Category = {

	    // Static
	    productCodes: {
	        cv: "cv",
	        coverLetter: "coverLetter",
	        linkedinProfile: "linkedinProfile"
	    },

	    titles: {
	        sv: {

	            // CV
	            12: "Redovisa resultat och skapa trovärdighet",
	            13: "Översiktligt och korrekt",
	            14: "Rikta och var relevant",

	            // Cover letter
	            7: "Framhäv potential",
	            8: "Fokusera på arbetsgivaren",
	            10: "Redovisa resultat och skapa trovärdighet",
	            11: "Aktivt, kort och korrekt",

	            // Linkedin profile
	            16: "Rikta och var relevant",
	            17: "Skapa effekt och bygg räckvidd",
	            18: "Översiktligt och korrekt",
	            20: "Redovisa resultat och skapa trovärdighet"
	        },

	        en: {
	            12: "Present achievements and build credibility",
	            13: "Ensure completeness and correctness",
	            14: "Be relevant and targeted",

	            7: "Highlight your potential",
	            8: "Focus on the employer",
	            10: "Present achievements and build credibility",
	            11: "Active, brief and correct",

	            16: "Be relevant and targeted",
	            17: "Network and outreach",
	            18: "Complete and correct profile",
	            20: "Present achievements and build credibility"
	        }
	    },

	    wellDoneComments: {
	        sv: {
	            12: "Bra jobbat i denna kategori! Du har lyckats beskriva dina erfarenheter på ett bra sätt.",
	            13: "Bra jobbat på detta område! Du har en snygg och överskådlig cv.",
	            14: "Bra jobbat på detta område! Din cv är riktad till den tjänst du söker på ett bra sätt.",

	            7: "Bra jobbat i denna kategori! Du har lyckats framhäva din potential på ett bra sätt.",
	            8: "Bra jobbat på detta område! Du visar att du är påläst om arbetsgivaren och varför du passar för tjänsten.",
	            10: "Bra jobbat på detta område! Du framhäver dina egenskaper på ett bra och trovärdigt vis.",
	            11: "Bra jobbat i denna kategori! Ditt brev är tydligt, snyggt och korrekt.",

	            16: "Bra jobbat på detta område! Din profil har en tydlig inriktning och du är relevant för din målgrupp.",
	            17: "Bra jobbat på detta område! Fortsätt att bygga ditt nätverk och var aktiv på LinkedIn.",
	            18: "Bra jobbat på detta område! Du har en tydlig och korrekt profil.",
	            20: "Bra jobbat i denna kategori! Din profil ger ett trovärdigt intryck och du har beskrivit dina erfarenheter och utbildningar väl."
	        },
	        en: {
	            12: "Very well done in this area!",
	            13: "Very well done in this area! You have a professional looking cv, that meets all the expected qualities.",
	            14: "Very well done in this area!",

	            7: "Very well done in this area!",
	            8: "Very well done in this area!",
	            10: "Very well done in this area!",
	            11: "Very well done in this area!",

	            16: "Very well done in this area!",
	            17: "Very well done in this area!",
	            18: "Very well done in this area!",
	            20: "Very well done in this area!"
	        }
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _global = __webpack_require__(3);

	var _category = __webpack_require__(1);

	var _category2 = _interopRequireDefault(_category);

	var _browser = __webpack_require__(4);

	var _browser2 = _interopRequireDefault(_browser);

	var _array = __webpack_require__(5);

	var _array2 = _interopRequireDefault(_array);

	var _store = __webpack_require__(6);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Assessment = {

	    // Static
	    nbReportComments: 3,
	    minScoreForWellDoneComment: 80,

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
	    listComments: function listComments(categoryProductCode) {
	        var listComments = this._listCommentsFromLocalStorage();

	        if (!listComments) {
	            listComments = _.cloneDeep(_store2.default.allDefaultComments);
	            this._saveListCommentsInLocalStorage(listComments);
	        }

	        return listComments[categoryProductCode];
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
	    reportCategory: function reportCategory(categoryProductCode, categoryId) {
	        var orderId = _store2.default.order.id;
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);

	        if (myAssessments[orderId].report && myAssessments[orderId].report[categoryProductCode] && myAssessments[orderId].report[categoryProductCode][categoryId]) {

	            return myAssessments[orderId].report[categoryProductCode][categoryId];
	        }

	        var reportCategory = this._defaultReportCategory(categoryProductCode, categoryId);

	        this._saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory);

	        return reportCategory;
	    },
	    resetReportCategory: function resetReportCategory(categoryId) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(categoryId);
	        var reportCategory = this._defaultReportCategory(categoryProductCode, categoryId);

	        this._saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory);
	    },
	    updateReportCategory: function updateReportCategory(category) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(category.id);

	        this._saveReportCategoryInLocalStorage(categoryProductCode, category.id, category);
	    },
	    addOrUpdateReportComment: function addOrUpdateReportComment(comment) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(comment.categoryId);

	        this._saveReportCommentInLocalStorage(categoryProductCode, comment);
	    },
	    removeReportComment: function removeReportComment(comment) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(comment.categoryId);

	        this._removeReportCommentFromLocalStorage(categoryProductCode, comment);
	    },
	    reorderReportComment: function reorderReportComment(categoryId, oldIndex, newIndex) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(categoryId);
	        var reportCategory = this.reportCategory(categoryProductCode, categoryId);

	        _array2.default.move(reportCategory.comments, oldIndex, newIndex);

	        this._saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory);
	    },


	    // (sumOfAllPoints - sumOfRedPoints) / sumOfAllPoints * 100
	    categoryScore: function categoryScore(categoryId) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(categoryId);
	        var listCommentsForCategory = _.filter(this.listComments(categoryProductCode), function (ac) {
	            return ac.categoryId === categoryId;
	        });
	        var reportCategory = this.reportCategory(categoryProductCode, categoryId);

	        var sumOfAllPoints = 0;

	        for (var i = 0; i < listCommentsForCategory.length; i++) {
	            sumOfAllPoints += listCommentsForCategory[i].points;
	        }

	        var sumOfRedPoints = 0;

	        for (var _i = 0; _i < reportCategory.comments.length; _i++) {
	            sumOfRedPoints += reportCategory.comments[_i].points;
	        }

	        return (sumOfAllPoints - sumOfRedPoints) / sumOfAllPoints * 100;
	    },
	    _calculateTopComments: function _calculateTopComments(categoryProductCode, categoryId) {
	        var redCommentsForCategory = _.filter(this.listComments(categoryProductCode), function (ac) {
	            return ac.categoryId === categoryId && ac.isRedSelected === true;
	        });
	        var topCommentsForCategory = [];

	        var loopCondition = function () {
	            if (redCommentsForCategory.length < this.nbReportComments) {
	                return topCommentsForCategory.length < redCommentsForCategory.length;
	            }
	            return topCommentsForCategory.length < this.nbReportComments;
	        }.bind(this);

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

	        return myAssessments && myAssessments[_store2.default.order.id] ? myAssessments[_store2.default.order.id].listComments : null;
	    },
	    _saveListCommentsInLocalStorage: function _saveListCommentsInLocalStorage(comments) {
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments) || {};
	        var orderId = _store2.default.order.id;

	        myAssessments[orderId] = myAssessments[orderId] || {};
	        myAssessments[orderId].listComments = comments;

	        _browser2.default.saveInLocalStorage(_global.localStorageKeys.myAssessments, myAssessments);
	    },
	    _defaultReportCategory: function _defaultReportCategory(categoryProductCode, categoryId) {
	        return {
	            comments: this._calculateTopComments(categoryProductCode, categoryId)
	        };
	    },


	    /*
	     * Structure of the report object:
	     * {
	     *   cv: {
	     *     12: {
	     *       comments: [],
	     *       wellDoneComment: null
	     *     }
	     *     13: {
	     *       comments: [],
	     *       wellDoneComment: null
	     *     }
	     *     14: {
	     *       comments: [],
	     *       wellDoneComment: null
	     *     }
	     *   },
	     *   coverLetter: {
	     *     7: {
	     *       comments: [],
	     *       wellDoneComment: null
	     *     }
	     *   },
	     *   linkedinProfile: {
	     *     16: {
	     *       comments: [],
	     *       wellDoneComment: null
	     *     }
	     *   }
	     * }
	     */
	    _saveReportCategoryInLocalStorage: function _saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory) {
	        var orderId = _store2.default.order.id;
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);

	        myAssessments[orderId].report = myAssessments[orderId].report || {};
	        myAssessments[orderId].report[categoryProductCode] = myAssessments[orderId].report[categoryProductCode] || {};
	        myAssessments[orderId].report[categoryProductCode][categoryId] = reportCategory;

	        _browser2.default.saveInLocalStorage(_global.localStorageKeys.myAssessments, myAssessments);
	    },
	    _saveReportCommentInLocalStorage: function _saveReportCommentInLocalStorage(categoryProductCode, comment) {
	        var orderId = _store2.default.order.id;
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);
	        var commentToUpdate = _.find(myAssessments[orderId].report[categoryProductCode][comment.categoryId].comments, function (c) {
	            return c.id === comment.id;
	        });

	        if (commentToUpdate) {
	            Object.assign(commentToUpdate, comment);
	        } else {
	            myAssessments[orderId].report[categoryProductCode][comment.categoryId].comments.push(comment);
	        }

	        myAssessments[orderId].report.hasBeenEdited = true;

	        _browser2.default.saveInLocalStorage(_global.localStorageKeys.myAssessments, myAssessments);
	    },
	    _removeReportCommentFromLocalStorage: function _removeReportCommentFromLocalStorage(categoryProductCode, comment) {
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);
	        var orderId = _store2.default.order.id;

	        _.remove(myAssessments[orderId].report[categoryProductCode][comment.categoryId].comments, function (c) {
	            return c.id === comment.id;
	        });

	        myAssessments[orderId].report.hasBeenEdited = true;

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
	    }

	    // Instance

	};

	exports.default = Assessment;

/***/ },
/* 3 */
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
	    myAssessments: "myAssessments"
	};

/***/ },
/* 4 */
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
/* 5 */
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _account = __webpack_require__(7);

	var _account2 = _interopRequireDefault(_account);

	var _order = __webpack_require__(8);

	var _order2 = _interopRequireDefault(_order);

	var _assessment = __webpack_require__(2);

	var _assessment2 = _interopRequireDefault(_assessment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var store = {
	    reactComponent: null,
	    account: Object.assign(Object.create(_account2.default), CR.ControllerData.account),
	    config: CR.ControllerData.config,
	    order: Object.assign(Object.create(_order2.default), CR.ControllerData.order),
	    allDefaultComments: CR.ControllerData.allDefaultComments,
	    allCommentVariations: CR.ControllerData.allCommentVariations,

	    init: function init() {
	        this._initCategories();
	    },
	    updateListComment: function updateListComment(comment) {
	        _assessment2.default.updateListComment(comment);
	        this.reactComponent.forceUpdate();
	    },
	    resetReportCategory: function resetReportCategory(categoryId) {
	        _assessment2.default.resetReportCategory(categoryId);
	        this.reactComponent.forceUpdate();
	    },
	    updateReportCategory: function updateReportCategory(category) {
	        _assessment2.default.updateReportCategory(category);
	        this.reactComponent.forceUpdate();
	    },
	    addOrUpdateReportComment: function addOrUpdateReportComment(comment) {
	        _assessment2.default.addOrUpdateReportComment(comment);
	        this.reactComponent.forceUpdate();
	    },
	    removeReportComment: function removeReportComment(comment) {
	        _assessment2.default.removeReportComment(comment);
	        this.reactComponent.forceUpdate();
	    },
	    handleReportCommentsReorder: function handleReportCommentsReorder(categoryId, oldIndex, newIndex) {
	        _assessment2.default.reorderReportComment(categoryId, oldIndex, newIndex);
	    },
	    _initCategories: function _initCategories() {
	        var predicate = function predicate(dc) {
	            return dc.categoryId;
	        };

	        this.categoryIds = {
	            cv: _.uniq(this.allDefaultComments.cv.map(predicate)),
	            coverLetter: _.uniq(this.allDefaultComments.coverLetter.map(predicate)),
	            linkedinProfile: _.uniq(this.allDefaultComments.linkedinProfile.map(predicate))
	        };

	        this.reactComponent.forceUpdate();
	    }
	};

	exports.default = store;

/***/ },
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _product = __webpack_require__(9);

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

/***/ },
/* 9 */
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
/* 10 */
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
	            "span",
	            { className: "position-sought" },
	            position
	        );
	    }
	});

	exports.default = Component;

/***/ },
/* 11 */
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
	            "span",
	            { className: "employer-sought" },
	            employer
	        );
	    }
	});

	exports.default = Component;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _product = __webpack_require__(9);

	var _product2 = _interopRequireDefault(_product);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Component = React.createClass({
	    displayName: "Component",
	    render: function render() {
	        var _this = this;

	        var order = this.props.order;

	        return React.createElement(
	            "div",
	            { ref: "root" },
	            this._couponTag(order.coupon),
	            order.tags.map(function (tag) {
	                return React.createElement(
	                    "span",
	                    { key: order.id + "-" + tag, className: "order-tag tag" },
	                    tag
	                );
	            }),
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
	        );
	    },
	    componentDidMount: function componentDidMount() {
	        this._initElements();
	    },
	    _initElements: function _initElements() {
	        var $rootEl = $(ReactDOM.findDOMNode(this.refs.root));
	        var $tooltips = $rootEl.find("[data-toggle=tooltip]");

	        $tooltips.tooltip();
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _order = __webpack_require__(8);

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
	            null,
	            timeLeft.hours(),
	            "h",
	            timeLeft.minutes(),
	            "m left"
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

	var _store = __webpack_require__(6);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Component = React.createClass({
	    displayName: "Component",
	    render: function render() {
	        var c = this.props.comment;

	        var listCommentClasses = classNames({
	            "list-comment": true,
	            grouped: c.isGrouped
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
	            { ref: "root", className: listCommentClasses },
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
	                )
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
	    _initElements: function _initElements() {
	        var $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

	        this.$redParagraphs = $rootEl.children(".red").children("p");

	        this._addContentEditableToParagraphs();
	    },
	    _addContentEditableToParagraphs: function _addContentEditableToParagraphs() {
	        _.forEach(this.$redParagraphs, function (p) {
	            return $(p).attr("contenteditable", "true");
	        });
	    },
	    _handleGreenParagraphClick: function _handleGreenParagraphClick() {
	        var c = this.props.comment;

	        c.isRedSelected = false;

	        // TODO: remove
	        c.isGreenSelected = !c.isGreenSelected;

	        /* TODO: uncomment when the above code is removed
	         comment.isGreenSelected = true; */

	        _store2.default.updateListComment(c);
	    },
	    _handleRedParagraphClick: function _handleRedParagraphClick() {
	        var c = this.props.comment;

	        c.isGreenSelected = false;
	        c.isRedSelected = true;

	        _store2.default.updateListComment(c);
	    },
	    _handleRedParagraphBlur: function _handleRedParagraphBlur(e) {
	        var c = this.props.comment;

	        c.redText = $(e.currentTarget).text();

	        _store2.default.updateListComment(c);
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

	var _category = __webpack_require__(1);

	var _category2 = _interopRequireDefault(_category);

	var _assessment = __webpack_require__(2);

	var _assessment2 = _interopRequireDefault(_assessment);

	var _string = __webpack_require__(16);

	var _string2 = _interopRequireDefault(_string);

	var _keyboard = __webpack_require__(17);

	var _keyboard2 = _interopRequireDefault(_keyboard);

	var _store = __webpack_require__(6);

	var _store2 = _interopRequireDefault(_store);

	var _reportComment = __webpack_require__(18);

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

	        return React.createElement(
	            "li",
	            { ref: "root", className: "report-category" },
	            React.createElement(
	                "h3",
	                null,
	                _category2.default.titles[_store2.default.order.languageCode][reportCategory.id]
	            ),
	            React.createElement("button", { type: "button", className: "styleless fa fa-undo", onClick: this._handleResetClick }),
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
	                { className: "comment-composer" },
	                React.createElement("textarea", { className: "form-control", onKeyUp: this._handleComposerKeyUp }),
	                React.createElement("button", { type: "button", className: "styleless fa fa-times", onClick: this._hideComposer })
	            ),
	            React.createElement(
	                "a",
	                { onClick: this._handleAddCommentClick },
	                "Add comment"
	            )
	        );
	    },
	    componentDidMount: function componentDidMount() {
	        this._initElements();
	    },
	    _initElements: function _initElements() {
	        var $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

	        this.$wellDoneCommentComposer = $rootEl.children(".well-done-comment-composer");
	        this.$wellDoneCommentTextarea = this.$wellDoneCommentComposer.children("textarea");

	        this.$commentList = $rootEl.children("ul");

	        this.$addCommentComposer = $rootEl.children(".comment-composer");
	        this.$addCommentTextarea = this.$addCommentComposer.children("textarea");

	        this._makeCommentsSortable();
	    },
	    _makeCommentsSortable: function _makeCommentsSortable() {
	        var _this = this;

	        // eslint-disable-next-line no-new
	        new Sortable(this.$commentList.get(0), {
	            animation: 150,
	            onUpdate: function onUpdate(e) {
	                return _store2.default.handleReportCommentsReorder(_this.props.reportCategory.id, e.oldIndex, e.newIndex);
	            },
	            handle: ".fa-bars"
	        });
	    },
	    _wellDoneComment: function _wellDoneComment() {
	        if (_assessment2.default.categoryScore(this.props.reportCategory.id) < _assessment2.default.minScoreForWellDoneComment) {
	            return null;
	        }

	        return React.createElement(
	            "div",
	            { className: "well-done-comment-composer" },
	            React.createElement(
	                "label",
	                null,
	                "Top comment"
	            ),
	            React.createElement("textarea", { className: "form-control", value: this.state.wellDoneComment, onChange: this._handleWellDoneCommentTextareaChange, onBlur: this._handleWellDoneCommentTextareaBlur })
	        );
	    },
	    _defaultWellDoneComment: function _defaultWellDoneComment() {
	        return _category2.default.wellDoneComments[_store2.default.order.languageCode][this.props.reportCategory.id];
	    },
	    _handleResetClick: function _handleResetClick() {
	        _store2.default.resetReportCategory(this.props.reportCategory.id);
	    },
	    _handleAddCommentClick: function _handleAddCommentClick() {
	        this.$addCommentComposer.show();
	        this.$addCommentTextarea.focus();
	        this._adaptTextareaHeight();
	    },
	    _handleComposerKeyUp: function _handleComposerKeyUp(e) {
	        this._adaptTextareaHeight();

	        if (e.keyCode === _keyboard2.default.keyCodes.enter) {
	            this._hideComposer();

	            _store2.default.addOrUpdateReportComment({
	                id: _string2.default.uuid(),
	                categoryId: this.props.reportCategory.id,
	                redText: this.$addCommentTextarea.val()
	            });

	            this.$addCommentTextarea.val(null);
	        }
	    },
	    _handleWellDoneCommentTextareaChange: function _handleWellDoneCommentTextareaChange() {
	        this.setState({
	            wellDoneComment: this.$wellDoneCommentTextarea.val()
	        });
	    },
	    _handleWellDoneCommentTextareaBlur: function _handleWellDoneCommentTextareaBlur() {
	        var updatedReportCategory = this.props.reportCategory;

	        updatedReportCategory.wellDoneComment = this.state.wellDoneComment;

	        _store2.default.updateReportCategory(updatedReportCategory);
	    },
	    _adaptTextareaHeight: function _adaptTextareaHeight() {
	        var ta = this.$addCommentTextarea.get(0);

	        if (ta.clientHeight < ta.scrollHeight) {
	            ta.style.height = ta.scrollHeight + 2 + "px";
	        }
	    },
	    _hideComposer: function _hideComposer() {
	        this.$addCommentComposer.hide();
	    }
	});

	// eslint-disable-next-line no-unused-vars
	exports.default = Component;

/***/ },
/* 16 */
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
/* 17 */
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _store = __webpack_require__(6);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Component = React.createClass({
	    displayName: "Component",
	    render: function render() {
	        var c = this.props.comment;
	        var liClasses = classNames({
	            "from-list": c.isRedSelected,
	            "well-done": c.isWellDone
	        });

	        return React.createElement(
	            "li",
	            { ref: "root", "data-comment-id": c.id, className: liClasses },
	            React.createElement("span", { className: "fa fa-bars" }),
	            React.createElement(
	                "p",
	                { className: "comment-paragraph", onBlur: this._handleParagraphBlur },
	                c.redText
	            ),
	            React.createElement("button", { type: "button", className: "styleless fa fa-trash", onClick: this._handleRemoveClick })
	        );
	    },
	    componentDidMount: function componentDidMount() {
	        this._initElements();
	    },
	    _initElements: function _initElements() {
	        var $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

	        $rootEl.children("p").attr("contenteditable", "true");
	    },
	    _handleParagraphBlur: function _handleParagraphBlur(e) {
	        var c = this.props.comment;

	        c.redText = $(e.currentTarget).text();

	        _store2.default.addOrUpdateReportComment(c);
	    },
	    _handleRemoveClick: function _handleRemoveClick() {
	        _store2.default.removeReportComment(this.props.comment);
	    }
	});

	exports.default = Component;

/***/ }
/******/ ]);