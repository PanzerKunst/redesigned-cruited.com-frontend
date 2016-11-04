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

	var _store = __webpack_require__(2);

	var _store2 = _interopRequireDefault(_store);

	var _positionSought = __webpack_require__(9);

	var _positionSought2 = _interopRequireDefault(_positionSought);

	var _employerSought = __webpack_require__(10);

	var _employerSought2 = _interopRequireDefault(_employerSought);

	var _orderTags = __webpack_require__(11);

	var _orderTags2 = _interopRequireDefault(_orderTags);

	var _timeLeft = __webpack_require__(12);

	var _timeLeft2 = _interopRequireDefault(_timeLeft);

	var _greenRedAssessmentComment = __webpack_require__(13);

	var _greenRedAssessmentComment2 = _interopRequireDefault(_greenRedAssessmentComment);

	var _topComment = __webpack_require__(14);

	var _topComment2 = _interopRequireDefault(_topComment);

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
	                        React.createElement(
	                            "li",
	                            { role: "presentation", className: "active" },
	                            React.createElement(
	                                "a",
	                                { href: "#CV_REVIEW-comments-selection-panel", "aria-controls": "CV_REVIEW-comments-selection-panel", role: "tab", "data-toggle": "tab", onClick: this._handleTabClick },
	                                "CV"
	                            )
	                        ),
	                        React.createElement(
	                            "li",
	                            { role: "presentation" },
	                            React.createElement(
	                                "a",
	                                { href: "#COVER_LETTER_REVIEW-comments-selection-panel", "aria-controls": "COVER_LETTER_REVIEW-comments-selection-panel", role: "tab", "data-toggle": "tab", onClick: this._handleTabClick },
	                                "Cover Letter"
	                            )
	                        ),
	                        React.createElement(
	                            "li",
	                            { role: "presentation" },
	                            React.createElement(
	                                "a",
	                                { href: "#LINKEDIN_PROFILE_REVIEW-comments-selection-panel", "aria-controls": "LINKEDIN_PROFILE_REVIEW-comments-selection-panel", role: "tab", "data-toggle": "tab", onClick: this._handleTabClick },
	                                "Linkedin Profile"
	                            )
	                        )
	                    ),
	                    React.createElement(
	                        "div",
	                        { className: "tab-content" },
	                        React.createElement(
	                            "div",
	                            { role: "tabpanel", className: "tab-pane fade in active", id: "CV_REVIEW-comments-selection-panel" },
	                            this._listCategory(_category2.default.productCodes.cv),
	                            this._assessmentForm(_category2.default.productCodes.cv)
	                        ),
	                        React.createElement(
	                            "div",
	                            { role: "tabpanel", className: "tab-pane fade", id: "COVER_LETTER_REVIEW-comments-selection-panel" },
	                            this._listCategory(_category2.default.productCodes.coverLetter),
	                            this._assessmentForm(_category2.default.productCodes.coverLetter)
	                        ),
	                        React.createElement(
	                            "div",
	                            { role: "tabpanel", className: "tab-pane fade", id: "LINKEDIN_PROFILE_REVIEW-comments-selection-panel" },
	                            this._listCategory(_category2.default.productCodes.linkedinProfile),
	                            this._assessmentForm(_category2.default.productCodes.linkedinProfile)
	                        )
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
	        _listCategory: function _listCategory(categoryProductCode) {
	            if (_store2.default.categoryIds) {
	                return _store2.default.categoryIds[categoryProductCode].map(function (categoryId) {
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
	                            _category2.default.titles[_store2.default.order.languageCode][categoryId]
	                        ),
	                        React.createElement(
	                            "ul",
	                            { className: "styleless" },
	                            listCommentsForThisCategory.map(function (ac) {
	                                return React.createElement(_greenRedAssessmentComment2.default, { key: "assessment-list-comment-" + ac.id, comment: ac });
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
	                { className: "assessment-form single-column-panel" },
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
	                this._topComments(categoryProductCode)
	            );
	        },
	        _topComments: function _topComments(categoryProductCode) {
	            var _this = this;

	            if (_store2.default.categoryIds) {
	                return React.createElement(
	                    "ul",
	                    { className: "styleless" },
	                    _store2.default.categoryIds[categoryProductCode].map(function (categoryId) {
	                        return React.createElement(
	                            "li",
	                            { key: "assessment-category-" + categoryId },
	                            React.createElement(
	                                "h3",
	                                null,
	                                _category2.default.titles[_store2.default.order.languageCode][categoryId]
	                            ),
	                            _this._topCommentsForCategory(categoryProductCode, categoryId)
	                        );
	                    })
	                );
	            }

	            return null;
	        },
	        _topCommentsForCategory: function _topCommentsForCategory(categoryProductCode, categoryId) {
	            if (_store2.default.assessment.areAllListCommentsSelected(categoryProductCode)) {
	                return React.createElement(
	                    "ul",
	                    { className: "styleless" },
	                    _store2.default.assessment.topComments(categoryProductCode, categoryId).map(function (comment) {
	                        return React.createElement(_topComment2.default, { key: "top-comment-" + comment.id, comment: comment });
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

	var _account = __webpack_require__(3);

	var _account2 = _interopRequireDefault(_account);

	var _order = __webpack_require__(4);

	var _order2 = _interopRequireDefault(_order);

	var _assessment = __webpack_require__(6);

	var _assessment2 = _interopRequireDefault(_assessment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var store = {
	    reactComponent: null,
	    account: Object.assign(Object.create(_account2.default), CR.ControllerData.account),
	    config: CR.ControllerData.config,
	    order: Object.assign(Object.create(_order2.default), CR.ControllerData.order),
	    allDefaultComments: CR.ControllerData.allDefaultComments,
	    allCommentVariations: CR.ControllerData.allCommentVariations,
	    assessment: Object.create(_assessment2.default),

	    init: function init() {
	        this._initCategories();
	    },
	    updateListComment: function updateListComment(comment) {
	        this.assessment.updateListComment(comment);
	        this.reactComponent.forceUpdate();
	    },
	    updateTopComment: function updateTopComment(comment) {
	        this.assessment.updateTopComment(comment);
	        this.reactComponent.forceUpdate();
	    },
	    resetTopComment: function resetTopComment(comment) {
	        this.assessment.resetTopComment(comment);
	        this.reactComponent.forceUpdate();
	    },
	    removeTopComment: function removeTopComment(comment) {
	        this.assessment.removeTopComment(comment);
	        this.reactComponent.forceUpdate();
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
/* 3 */
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

	    isAdmin: function isAdmin() {
	        return this.type === this.types.admin;
	    }
	};

	exports.default = Account;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

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

	    documentUrl: function documentUrl(config, productCode) {
	        var urlMiddle = "cv";

	        switch (productCode) {
	            case _product2.default.codes.COVER_LETTER_REVIEW:
	                urlMiddle = "cover-letter";
	                break;
	            case _product2.default.codes.LINKEDIN_PROFILE_REVIEW:
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
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Product = {

	    // Static
	    codes: {
	        CV_REVIEW: "CV_REVIEW",
	        COVER_LETTER_REVIEW: "COVER_LETTER_REVIEW",
	        LINKEDIN_PROFILE_REVIEW: "LINKEDIN_PROFILE_REVIEW"
	    },

	    humanReadableCode: function humanReadableCode(dbCode) {
	        switch (dbCode) {
	            case this.codes.CV_REVIEW:
	                return "CV";
	            case this.codes.COVER_LETTER_REVIEW:
	                return "Cover letter";
	            default:
	                return "Linkedin";
	        }
	    }
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

	var _global = __webpack_require__(7);

	var _category = __webpack_require__(1);

	var _category2 = _interopRequireDefault(_category);

	var _browser = __webpack_require__(8);

	var _browser2 = _interopRequireDefault(_browser);

	var _store = __webpack_require__(2);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Assessment = {

	    // Static
	    nbTopComments: 3,

	    updateListComment: function updateListComment(comment) {
	        var listComments = this._getListCommentsFromLocalStorage();
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
	        var listComments = this._getListCommentsFromLocalStorage();

	        if (!listComments) {
	            listComments = _.cloneDeep(_store2.default.allDefaultComments);
	            this._saveListCommentsInLocalStorage(listComments);
	        }

	        return listComments[categoryProductCode];
	    },
	    topComments: function topComments(categoryProductCode, categoryId) {
	        var topCommentsFromLocalStorage = this._getTopCommentsFromLocalStorage();

	        if (topCommentsFromLocalStorage && topCommentsFromLocalStorage.haveBeenEdited) {
	            return _.filter(topCommentsFromLocalStorage[categoryProductCode], function (ac) {
	                return ac.categoryId === categoryId;
	            });
	        }

	        var topCommentsForCategory = this._calculateTopComments(categoryProductCode, categoryId);

	        this._saveAllTopCommentsInLocalStorage(categoryProductCode, topCommentsForCategory);

	        return topCommentsForCategory;
	    },
	    updateTopComment: function updateTopComment(comment) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(comment.categoryId);

	        this._saveTopCommentInLocalStorage(categoryProductCode, comment);
	    },
	    resetTopComment: function resetTopComment(comment) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(comment.categoryId);
	        var originalComment = _.find(this.listComments(categoryProductCode), function (c) {
	            return c.id === comment.id;
	        });

	        this._saveTopCommentInLocalStorage(categoryProductCode, originalComment);
	    },
	    removeTopComment: function removeTopComment(comment) {
	        var categoryProductCode = _category2.default.productCodeFromCategoryId(comment.categoryId);

	        this._removeTopCommentFromLocalStorage(categoryProductCode, comment);
	    },
	    areAllListCommentsSelected: function areAllListCommentsSelected(categoryProductCode) {
	        var listComments = this._getListCommentsFromLocalStorage();
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
	    _calculateTopComments: function _calculateTopComments(categoryProductCode, categoryId) {
	        var redCommentsForCategory = _.filter(this.listComments(categoryProductCode), function (ac) {
	            return ac.categoryId === categoryId && ac.isRedSelected === true;
	        });
	        var topCommentsForCategory = [];

	        var loopCondition = function () {
	            if (redCommentsForCategory.length < this.nbTopComments) {
	                return topCommentsForCategory.length < redCommentsForCategory.length;
	            }
	            return topCommentsForCategory.length < this.nbTopComments;
	        }.bind(this);

	        while (loopCondition()) {
	            var topComment = this._findRedCommentWithMostPointsInListExcept(redCommentsForCategory, topCommentsForCategory);

	            if (topComment) {
	                topCommentsForCategory.push(topComment);
	            }
	        }

	        return topCommentsForCategory;
	    },
	    _getListCommentsForCategoryContainingCommentId: function _getListCommentsForCategoryContainingCommentId(id, categoryProductCode) {
	        var listCommentsForCategory = this.listComments(categoryProductCode);

	        return _.find(listCommentsForCategory, function (c) {
	            return c.id === id;
	        }) ? listCommentsForCategory : null;
	    },
	    _getListCommentsFromLocalStorage: function _getListCommentsFromLocalStorage() {
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
	    _getTopCommentsFromLocalStorage: function _getTopCommentsFromLocalStorage() {
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);
	        var orderId = _store2.default.order.id;

	        return myAssessments && myAssessments[orderId] ? myAssessments[orderId].topComments : null;
	    },
	    _saveAllTopCommentsInLocalStorage: function _saveAllTopCommentsInLocalStorage(categoryProductCode, comments) {
	        var orderId = _store2.default.order.id;
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);

	        myAssessments[orderId].topComments = myAssessments[orderId].topComments || {};

	        // We remove the comments of the same ID
	        comments.forEach(function (comment) {
	            return _.remove(myAssessments[orderId].topComments[categoryProductCode], function (c) {
	                return c.id === comment.id;
	            });
	        });

	        myAssessments[orderId].topComments[categoryProductCode] = _.concat(myAssessments[orderId].topComments[categoryProductCode] || [], comments);

	        _browser2.default.saveInLocalStorage(_global.localStorageKeys.myAssessments, myAssessments);
	    },
	    _saveTopCommentInLocalStorage: function _saveTopCommentInLocalStorage(categoryProductCode, comment) {
	        var orderId = _store2.default.order.id;
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);
	        var commentToUpdate = _.find(myAssessments[orderId].topComments[categoryProductCode], function (c) {
	            return c.id === comment.id;
	        });

	        if (commentToUpdate) {
	            Object.assign(commentToUpdate, comment);
	        } else {
	            myAssessments[orderId].topComments[categoryProductCode].push(comment);
	        }

	        myAssessments[orderId].topComments.haveBeenEdited = true;

	        _browser2.default.saveInLocalStorage(_global.localStorageKeys.myAssessments, myAssessments);
	    },
	    _removeTopCommentFromLocalStorage: function _removeTopCommentFromLocalStorage(categoryProductCode, comment) {
	        var myAssessments = _browser2.default.getFromLocalStorage(_global.localStorageKeys.myAssessments);
	        var orderId = _store2.default.order.id;

	        _.remove(myAssessments[orderId].topComments[categoryProductCode], function (c) {
	            return c.id === comment.id;
	        });

	        myAssessments[orderId].topComments.haveBeenEdited = true;

	        _browser2.default.saveInLocalStorage(_global.localStorageKeys.myAssessments, myAssessments);
	    },
	    _findRedCommentWithMostPointsInListExcept: function _findRedCommentWithMostPointsInListExcept(redCommentsForCategory, topCommentsForCategory) {
	        var commentWithMostPoints = null;

	        redCommentsForCategory.forEach(function (redComment) {
	            var isCommentAlreadyInList = _.find(topCommentsForCategory, function (tc) {
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
	};

	exports.default = Assessment;

/***/ },
/* 7 */
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
/* 8 */
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
/* 9 */
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
/* 10 */
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
/* 11 */
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _order = __webpack_require__(4);

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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _store = __webpack_require__(2);

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
	            selected: c.isGreenSelected
	        });
	        var redParagraphClasses = classNames({
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
	        c.isGreenSelected = true;

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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _store = __webpack_require__(2);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Component = React.createClass({
	    displayName: "Component",
	    render: function render() {
	        var c = this.props.comment;

	        return React.createElement(
	            "li",
	            { ref: "root", "data-comment-id": c.id },
	            React.createElement(
	                "p",
	                { onBlur: this._handleParagraphBlur },
	                c.redText
	            ),
	            React.createElement("button", { type: "button", className: "styleless fa fa-undo", onClick: this._handleResetClick }),
	            React.createElement("button", { type: "button", className: "styleless fa fa-trash", onClick: this._handleRemoveClick })
	        );
	    },
	    componentDidMount: function componentDidMount() {
	        this._initElements();
	    },
	    _initElements: function _initElements() {
	        var $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

	        this.$p = $rootEl.children("p");

	        this.$p.attr("contenteditable", "true");
	    },
	    _handleParagraphBlur: function _handleParagraphBlur() {
	        var c = this.props.comment;

	        c.redText = this.$p.text();

	        _store2.default.updateTopComment(c);
	    },
	    _handleResetClick: function _handleResetClick() {
	        _store2.default.resetTopComment(this.props.comment);
	    },
	    _handleRemoveClick: function _handleRemoveClick() {
	        _store2.default.removeTopComment(this.props.comment);
	    }
	});

	exports.default = Component;

/***/ }
/******/ ]);