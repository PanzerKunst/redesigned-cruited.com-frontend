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

	var _store = __webpack_require__(1);

	var _store2 = _interopRequireDefault(_store);

	var _listItem = __webpack_require__(6);

	var _listItem2 = _interopRequireDefault(_listItem);

	var _assignModal = __webpack_require__(13);

	var _assignModal2 = _interopRequireDefault(_assignModal);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// eslint-disable-next-line no-unused-vars
	var controller = {
	    init: function init() {
	        _store2.default.reactComponent = ReactDOM.render(React.createElement(this.reactComponent), document.querySelector("[role=main]"));

	        _store2.default.init();
	    },


	    reactComponent: React.createClass({
	        displayName: "reactComponent",
	        render: function render() {
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
	                            "Orders"
	                        )
	                    )
	                ),
	                React.createElement(
	                    "div",
	                    { className: "with-circles" },
	                    this._topOrders(),
	                    React.createElement(
	                        "ul",
	                        { className: "styleless orders" },
	                        _store2.default.moreOrders.map(function (order) {
	                            return React.createElement(_listItem2.default, { key: order.id, order: order });
	                        })
	                    ),
	                    React.createElement(
	                        "div",
	                        { id: "load-more-panel" },
	                        React.createElement(
	                            "div",
	                            { className: "centered-contents" },
	                            React.createElement("i", { className: "fa fa-spinner fa-pulse" })
	                        ),
	                        React.createElement(
	                            "div",
	                            { id: "load-more-link-panel" },
	                            React.createElement(
	                                "a",
	                                { onClick: this._handleLoadMoreClick },
	                                "Load more"
	                            )
	                        )
	                    )
	                ),
	                React.createElement(_assignModal2.default, null),
	                React.createElement("div", { id: "delete-modal", className: "modal fade", tabIndex: "-1", role: "dialog" })
	            );
	        },
	        componentDidMount: function componentDidMount() {
	            this._initElements();
	        },
	        componentDidUpdate: function componentDidUpdate() {
	            if (_store2.default.areTopOrdersFetched && !this.isDefaultSearchDone) {
	                this._searchMore();
	                this.isDefaultSearchDone = true;
	            }
	        },
	        _initElements: function _initElements() {
	            this.$loadMorePanel = $("#load-more-panel");
	        },
	        _topOrders: function _topOrders() {
	            if (_store2.default.areTopOrdersFetched) {
	                return React.createElement(
	                    "ul",
	                    { className: "styleless orders" },
	                    _store2.default.topOrders.map(function (order) {
	                        return React.createElement(_listItem2.default, { key: order.id, order: order });
	                    })
	                );
	            }
	            return React.createElement(
	                "div",
	                { className: "centered-contents" },
	                React.createElement("i", { className: "fa fa-spinner fa-pulse" })
	            );
	        },
	        _handleLoadMoreClick: function _handleLoadMoreClick() {
	            this._searchMore();
	        },
	        _searchMore: function _searchMore() {
	            var _this = this;

	            this.$loadMorePanel.addClass("loading");
	            _store2.default.searchMore(function () {
	                return _this.$loadMorePanel.removeClass("loading");
	            });
	        }
	    })
	};

	// eslint-disable-next-line no-unused-vars


	controller.init();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _global = __webpack_require__(2);

	var _account = __webpack_require__(3);

	var _account2 = _interopRequireDefault(_account);

	var _order = __webpack_require__(4);

	var _order2 = _interopRequireDefault(_order);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var store = {
	    reactComponent: null,
	    account: Object.assign(Object.create(_account2.default), CR.ControllerData.account),
	    config: CR.ControllerData.config,
	    topOrders: [],
	    moreOrders: [],
	    allRaters: [],
	    currentOrder: null,
	    areTopOrdersFetched: false,
	    stats: null,
	    dueOrders: [],
	    ordersSentToTheCustomerThisMonth: [],

	    init: function init() {
	        this._fetchTopOrders();
	        this._fetchAllRaters();

	        /* TODO: uncomment when work resumes on the stats panel
	        this._fetchDueOrders();
	        this._fetchOrdersSentToTheCustomerThisMonth();
	          setInterval(() => {
	            this._fetchDueOrders();
	            this._fetchOrdersSentToTheCustomerThisMonth();
	        }, 10 * 1000); */
	    },
	    _fetchTopOrders: function _fetchTopOrders() {
	        var _this = this;

	        var type = "GET";
	        var url = "/api/orders/top";
	        var httpRequest = new XMLHttpRequest();

	        httpRequest.onreadystatechange = function () {
	            if (httpRequest.readyState === XMLHttpRequest.DONE) {
	                if (httpRequest.status === _global.httpStatusCodes.ok) {
	                    var topOrdersJson = JSON.parse(httpRequest.responseText);

	                    _this.topOrders = topOrdersJson.map(function (o) {
	                        return Object.assign(Object.create(_order2.default), o);
	                    });
	                    _this.areTopOrdersFetched = true;
	                    _this.reactComponent.forceUpdate();
	                } else {
	                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
	                }
	            }
	        };
	        httpRequest.open(type, url);
	        httpRequest.send();
	    },
	    _fetchAllRaters: function _fetchAllRaters() {
	        var _this2 = this;

	        var type = "GET";
	        var url = "/api/accounts/raters";
	        var httpRequest = new XMLHttpRequest();

	        httpRequest.onreadystatechange = function () {
	            if (httpRequest.readyState === XMLHttpRequest.DONE) {
	                if (httpRequest.status === _global.httpStatusCodes.ok) {
	                    var allRatersJson = JSON.parse(httpRequest.responseText);

	                    _this2.allRaters = allRatersJson.map(function (o) {
	                        return Object.assign(Object.create(_account2.default), o);
	                    });
	                    _this2.reactComponent.forceUpdate();
	                } else {
	                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
	                }
	            }
	        };
	        httpRequest.open(type, url);
	        httpRequest.send();
	    },


	    /* TODO: uncomment when work resumes on the stats panel
	    _fetchDueOrders() {
	        const type = "GET";
	        const url = "/api/orders/due";
	          const httpRequest = new XMLHttpRequest();
	          httpRequest.onreadystatechange = () => {
	            if (httpRequest.readyState === XMLHttpRequest.DONE) {
	                if (httpRequest.status === httpStatusCodes.ok) {
	                    const dueOrdersJson = JSON.parse(httpRequest.responseText);
	                      this.dueOrders = dueOrdersJson.map(o => Object.assign(Object.create(Order), o));
	                    this.reactComponent.forceUpdate();
	                } else {
	                    alert(`AJAX failure doing a ${type} request to "${url}"`);
	                }
	            }
	        };
	        httpRequest.open(type, url);
	        httpRequest.send();
	    },
	      _fetchOrdersSentToTheCustomerThisMonth() {
	        const type = "GET";
	        const url = "/api/orders/sent";
	          const httpRequest = new XMLHttpRequest();
	          httpRequest.onreadystatechange = () => {
	            if (httpRequest.readyState === XMLHttpRequest.DONE) {
	                if (httpRequest.status === httpStatusCodes.ok) {
	                    const sentOrdersJson = JSON.parse(httpRequest.responseText);
	                      this.ordersSentToTheCustomerThisMonth = sentOrdersJson.map(o => Object.assign(Object.create(Order), o));
	                    this.reactComponent.forceUpdate();
	                } else {
	                    alert(`AJAX failure doing a ${type} request to "${url}"`);
	                }
	            }
	        };
	        httpRequest.open(type, url);
	        httpRequest.send();
	    }, */

	    assignOrderTo: function assignOrderTo(account) {
	        var _this3 = this;

	        if (!this.currentOrder) {
	            alert("Error: `this.currentOrder` must exist, this is a bug!");
	        } else {
	            (function () {
	                var predicate = ["id", _this3.currentOrder.id];
	                var order = _.find(_this3.topOrders, predicate) || _.find(_this3.moreOrders, predicate);

	                order.rater = account;

	                _this3.reactComponent.forceUpdate();

	                var type = "PUT";
	                var url = "/api/orders";
	                var httpRequest = new XMLHttpRequest();

	                httpRequest.onreadystatechange = function () {
	                    if (httpRequest.readyState === XMLHttpRequest.DONE) {
	                        if (httpRequest.status !== _global.httpStatusCodes.ok) {
	                            alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
	                        }
	                    }
	                };
	                httpRequest.open(type, url);
	                httpRequest.setRequestHeader("Content-Type", "application/json");
	                httpRequest.send(JSON.stringify(order));
	            })();
	        }
	    },
	    deleteCurrentOrder: function deleteCurrentOrder() {
	        var _this4 = this;

	        if (!this.currentOrder) {
	            alert("Error: `this.currentOrder` must exist, this is a bug!");
	        } else {
	            (function () {
	                var orderId = _this4.currentOrder.id;

	                var type = "DELETE";
	                var url = "/api/orders/" + orderId;
	                var httpRequest = new XMLHttpRequest();

	                httpRequest.onreadystatechange = function () {
	                    if (httpRequest.readyState === XMLHttpRequest.DONE) {
	                        if (httpRequest.status === _global.httpStatusCodes.ok) {
	                            var predicate = function predicate(o) {
	                                return o.id === orderId;
	                            };

	                            _.remove(_this4.topOrders, predicate);
	                            _.remove(_this4.moreOrders, predicate);

	                            _this4.reactComponent.forceUpdate();
	                        } else {
	                            alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
	                        }
	                    }
	                };
	                httpRequest.open(type, url);
	                httpRequest.send();
	            })();
	        }
	    },
	    searchMore: function searchMore(onAjaxRequestDone) {
	        var _this5 = this;

	        this._updateSearchCriteria();

	        var type = "POST";
	        var url = "/api/orders/search";
	        var httpRequest = new XMLHttpRequest();

	        httpRequest.onreadystatechange = function () {
	            if (httpRequest.readyState === XMLHttpRequest.DONE) {
	                onAjaxRequestDone();

	                if (httpRequest.status === _global.httpStatusCodes.ok) {
	                    var moreOrdersJson = JSON.parse(httpRequest.responseText);
	                    var moreOrders = moreOrdersJson.map(function (o) {
	                        return Object.assign(Object.create(_order2.default), o);
	                    });

	                    _this5.moreOrders = _.concat(_this5.moreOrders, moreOrders);
	                    _this5.reactComponent.forceUpdate();
	                } else {
	                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
	                }
	            }
	        };
	        httpRequest.open(type, url);
	        httpRequest.setRequestHeader("Content-Type", "application/json");
	        httpRequest.send(JSON.stringify({
	            from: this.searchCriteria.fromMoment ? this.searchCriteria.fromMoment.valueOf() : null,
	            to: this.searchCriteria.toMoment.valueOf(),
	            excludedOrderIds: this.searchCriteria.excludedOrderIds
	        }));
	    },
	    _updateSearchCriteria: function _updateSearchCriteria() {
	        if (!this.searchCriteria) {
	            this.searchNbDays = 7;

	            this.searchCriteria = {
	                toMoment: moment().subtract(this.searchNbDays, "d"),
	                excludedOrderIds: this.topOrders.map(function (order) {
	                    return order.id;
	                })
	            };
	        } else {
	            this.searchCriteria.fromMoment = moment(this.searchCriteria.toMoment);

	            this.searchNbDays *= 1.5;
	            this.searchCriteria.toMoment.subtract(this.searchNbDays, "d");
	        }
	    }
	};

	exports.default = store;

/***/ },
/* 2 */
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

	    // Instance
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


	    // Raters who are not assigned should still be able to check the assessment, even before it's completed
	    isReadOnlyBy: function isReadOnlyBy(raterId) {
	        return this.status < Order.statuses.inProgress || this.status === Order.statuses.completed || this.status === Order.statuses.scheduled || !this.rater || this.rater.id !== raterId;
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

	var _order = __webpack_require__(4);

	var _order2 = _interopRequireDefault(_order);

	var _store = __webpack_require__(1);

	var _store2 = _interopRequireDefault(_store);

	var _deleteModal = __webpack_require__(7);

	var _deleteModal2 = _interopRequireDefault(_deleteModal);

	var _raterProfile = __webpack_require__(11);

	var _raterProfile2 = _interopRequireDefault(_raterProfile);

	var _timeLeft = __webpack_require__(12);

	var _timeLeft2 = _interopRequireDefault(_timeLeft);

	var _positionSought = __webpack_require__(8);

	var _positionSought2 = _interopRequireDefault(_positionSought);

	var _employerSought = __webpack_require__(9);

	var _employerSought2 = _interopRequireDefault(_employerSought);

	var _orderTags = __webpack_require__(10);

	var _orderTags2 = _interopRequireDefault(_orderTags);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// eslint-disable-next-line no-unused-vars


	// eslint-disable-next-line no-unused-vars
	var Component = React.createClass({
	    displayName: "Component",
	    render: function render() {
	        var order = this.props.order;

	        return React.createElement(
	            "li",
	            { ref: "li", className: this._cssClassForStatus(order.status) },
	            React.createElement(
	                "section",
	                null,
	                React.createElement(_raterProfile2.default, { account: order.rater }),
	                React.createElement(
	                    "p",
	                    null,
	                    "#",
	                    order.id
	                ),
	                React.createElement(_timeLeft2.default, { order: order }),
	                React.createElement(
	                    "p",
	                    null,
	                    moment(order.paymentTimestamp).format("YYYY-MM-DD H:mm")
	                )
	            ),
	            React.createElement(
	                "section",
	                null,
	                React.createElement(
	                    "div",
	                    null,
	                    React.createElement(_positionSought2.default, { position: order.positionSought }),
	                    React.createElement(_employerSought2.default, { employer: order.employerSought })
	                ),
	                React.createElement(
	                    "div",
	                    null,
	                    React.createElement(
	                        "p",
	                        null,
	                        order.customer.firstName
	                    ),
	                    React.createElement(
	                        "p",
	                        null,
	                        order.customer.emailAddress
	                    )
	                )
	            ),
	            React.createElement(
	                "section",
	                null,
	                React.createElement(_orderTags2.default, { order: order, config: _store2.default.config }),
	                this._actionBtn(order),
	                this._secondaryButtons(order)
	            )
	        );
	    },
	    componentDidMount: function componentDidMount() {
	        this._initElements();
	    },
	    _initElements: function _initElements() {
	        this.$assignModal = $("#assign-modal");
	        this.$deleteModal = $("#delete-modal");
	    },
	    _cssClassForStatus: function _cssClassForStatus(status) {
	        switch (status) {
	            case _order2.default.statuses.paid:
	                return "paid";
	            case _order2.default.statuses.inProgress:
	                return "in-progress";
	            case _order2.default.statuses.awaitingFeedback:
	                return "awaiting-feedback";
	            case _order2.default.statuses.scheduled:
	                return "scheduled";
	            case _order2.default.statuses.completed:
	                return "completed";
	            default:
	                return "not-paid";
	        }
	    },
	    _coupon: function _coupon(coupon) {
	        if (!coupon) {
	            return null;
	        }
	        return React.createElement(
	            "span",
	            { className: "order-list-item-tag coupon", "data-toggle": "tooltip", title: coupon.code },
	            coupon.campaignName
	        );
	    },
	    _actionBtn: function _actionBtn(order) {
	        var text = order.isReadOnlyBy(_store2.default.account.id) ? "Check" : "Assess";

	        return React.createElement(
	            "div",
	            null,
	            React.createElement(
	                "a",
	                { href: this._assessmentUrl(order.id), className: "btn btn-default" },
	                text
	            )
	        );
	    },
	    _secondaryButtons: function _secondaryButtons(order) {
	        var assignBtn = order.status === _order2.default.statuses.completed || order.status === _order2.default.statuses.scheduled ? null : React.createElement(
	            "button",
	            { className: "styleless fa fa-user", onClick: this._handleAssignClick },
	            React.createElement("i", { className: "fa fa-check", "aria-hidden": "true" })
	        );

	        var viewBtn = null;

	        if (order.status === _order2.default.statuses.completed || order.status === _order2.default.statuses.scheduled) {
	            var href = _store2.default.config.customerAppRootUrl + "reports/" + order.id;

	            viewBtn = React.createElement("a", { href: href, target: "_blank", className: "fa fa-eye" });
	        }

	        // TODO: make the button available to everyone
	        var deleteBtn = _store2.default.account.isAdmin() ? React.createElement("button", { className: "styleless fa fa-trash", onClick: this._handleDeleteClick }) : null;

	        return React.createElement(
	            "div",
	            { className: "secondary-buttons" },
	            assignBtn,
	            viewBtn,
	            deleteBtn
	        );
	    },
	    _handleAssignClick: function _handleAssignClick() {
	        _store2.default.currentOrder = this.props.order;
	        this.$assignModal.modal();
	    },
	    _handleDeleteClick: function _handleDeleteClick() {
	        _store2.default.currentOrder = this.props.order;

	        ReactDOM.render(React.createElement(_deleteModal2.default), document.querySelector("#delete-modal"));

	        this.$deleteModal.modal();
	    },
	    _assessmentUrl: function _assessmentUrl(orderId) {
	        return "/assessments/" + orderId;
	    }
	});

	// eslint-disable-next-line no-unused-vars


	// eslint-disable-next-line no-unused-vars


	// eslint-disable-next-line no-unused-vars
	exports.default = Component;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _store = __webpack_require__(1);

	var _store2 = _interopRequireDefault(_store);

	var _positionSought = __webpack_require__(8);

	var _positionSought2 = _interopRequireDefault(_positionSought);

	var _employerSought = __webpack_require__(9);

	var _employerSought2 = _interopRequireDefault(_employerSought);

	var _orderTags = __webpack_require__(10);

	var _orderTags2 = _interopRequireDefault(_orderTags);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// eslint-disable-next-line no-unused-vars
	var Component = React.createClass({
	    displayName: "Component",
	    render: function render() {
	        var order = _store2.default.currentOrder;

	        return React.createElement(
	            "div",
	            { className: "modal-dialog", role: "document" },
	            React.createElement(
	                "div",
	                { className: "modal-content" },
	                React.createElement(
	                    "div",
	                    { className: "modal-header" },
	                    React.createElement(
	                        "button",
	                        { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
	                        React.createElement(
	                            "span",
	                            { "aria-hidden": "true" },
	                            "\xD7"
	                        )
	                    ),
	                    React.createElement(
	                        "h3",
	                        { className: "modal-title" },
	                        "Delete this order?"
	                    )
	                ),
	                React.createElement(
	                    "div",
	                    { className: "modal-body" },
	                    React.createElement(
	                        "section",
	                        null,
	                        React.createElement(
	                            "p",
	                            null,
	                            "#",
	                            order.id
	                        ),
	                        React.createElement(
	                            "p",
	                            null,
	                            moment(order.paymentTimestamp).format("YYYY-MM-DD H:mm")
	                        )
	                    ),
	                    React.createElement(
	                        "section",
	                        null,
	                        React.createElement(
	                            "div",
	                            null,
	                            React.createElement(_positionSought2.default, { position: order.positionSought }),
	                            React.createElement(_employerSought2.default, { employer: order.employerSought })
	                        ),
	                        React.createElement(
	                            "div",
	                            null,
	                            React.createElement(
	                                "p",
	                                null,
	                                order.customer.firstName
	                            ),
	                            React.createElement(
	                                "p",
	                                null,
	                                order.customer.emailAddress
	                            )
	                        )
	                    ),
	                    React.createElement(
	                        "section",
	                        null,
	                        React.createElement(_orderTags2.default, { order: order, config: _store2.default.config })
	                    )
	                ),
	                React.createElement(
	                    "div",
	                    { className: "modal-footer" },
	                    React.createElement(
	                        "button",
	                        { type: "button", className: "btn btn-primary", onClick: this._handleDeleteClick },
	                        "Mark as deleted"
	                    )
	                )
	            )
	        );
	    },
	    componentDidMount: function componentDidMount() {
	        this._initElements();
	    },
	    _initElements: function _initElements() {
	        this.$modal = $("#delete-modal");
	    },
	    _handleDeleteClick: function _handleDeleteClick() {
	        _store2.default.deleteCurrentOrder();
	        this.$modal.modal("hide");
	    }
	});

	// eslint-disable-next-line no-unused-vars


	// eslint-disable-next-line no-unused-vars
	exports.default = Component;

/***/ },
/* 8 */
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
/* 9 */
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
/* 10 */
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
	            React.createElement(
	                "span",
	                { className: "order-tag edition" },
	                order.editionCode
	            ),
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
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Component = React.createClass({
	    displayName: "Component",
	    render: function render() {
	        var account = this.props.account;

	        if (!account) {
	            return null;
	        }

	        var myProfilePictureStyleAttr = null;
	        var myLinkedinProfile = account.linkedinProfile;

	        if (myLinkedinProfile) {
	            myProfilePictureStyleAttr = { backgroundImage: "url(" + myLinkedinProfile.pictureUrl + ")" };
	        }

	        return React.createElement(
	            "article",
	            { className: "rater-profile" },
	            React.createElement("div", { className: "profile-picture", style: myProfilePictureStyleAttr }),
	            React.createElement(
	                "span",
	                null,
	                account.firstName,
	                " ",
	                account.lastName
	            )
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

	var _store = __webpack_require__(1);

	var _store2 = _interopRequireDefault(_store);

	var _raterProfile = __webpack_require__(11);

	var _raterProfile2 = _interopRequireDefault(_raterProfile);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Component = React.createClass({
	    displayName: "Component",
	    getInitialState: function getInitialState() {
	        return _store2.default;
	    },
	    render: function render() {
	        var _this = this;

	        return React.createElement(
	            "div",
	            { id: "assign-modal", className: "modal fade", tabIndex: "-1", role: "dialog" },
	            React.createElement(
	                "div",
	                { className: "modal-dialog", role: "document" },
	                React.createElement(
	                    "div",
	                    { className: "modal-content" },
	                    React.createElement(
	                        "div",
	                        { className: "modal-header" },
	                        React.createElement(
	                            "button",
	                            { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
	                            React.createElement(
	                                "span",
	                                { "aria-hidden": "true" },
	                                "\xD7"
	                            )
	                        ),
	                        React.createElement(
	                            "h3",
	                            { className: "modal-title" },
	                            "Assign to"
	                        )
	                    ),
	                    React.createElement(
	                        "div",
	                        { className: "modal-body" },
	                        React.createElement(
	                            "ul",
	                            { className: "styleless" },
	                            _store2.default.allRaters.map(function (account) {
	                                return React.createElement(
	                                    "li",
	                                    { key: account.id, onClick: _this._handleItemClick, "data-account-id": account.id },
	                                    React.createElement(_raterProfile2.default, { account: account })
	                                );
	                            })
	                        )
	                    )
	                )
	            )
	        );
	    },
	    componentDidUpdate: function componentDidUpdate() {
	        this._initElements();

	        if (!this.isOnModalShowEventInitialised) {
	            this._initOnModalShowEvent();
	            this.isOnModalShowEventInitialised = true;
	        }
	    },
	    _initElements: function _initElements() {
	        this.$modal = $("#assign-modal");
	        this.$listItems = this.$modal.find("li");
	    },
	    _initOnModalShowEvent: function _initOnModalShowEvent() {
	        var _this2 = this;

	        this.$modal.on("show.bs.modal", function () {
	            _this2.$listItems.removeClass("disabled");

	            // Disable the rater currently assigned to the order
	            var liCurrentlyAssigned = _.find(_this2.$listItems, function (li) {
	                var accountId = $(li).data("account-id");
	                var raterOfCurrentOrder = _store2.default.currentOrder.rater;

	                return raterOfCurrentOrder && raterOfCurrentOrder.id === accountId;
	            });

	            $(liCurrentlyAssigned).addClass("disabled");
	        });
	    },
	    _handleItemClick: function _handleItemClick(e) {
	        var $li = $(e.currentTarget);

	        if (!$li.hasClass("disabled")) {
	            var accountId = $li.data("account-id");

	            _store2.default.assignOrderTo(_.find(_store2.default.allRaters, ["id", accountId]));
	            this.$modal.modal("hide");
	        }
	    }
	});

	// eslint-disable-next-line no-unused-vars
	exports.default = Component;

/***/ }
/******/ ]);