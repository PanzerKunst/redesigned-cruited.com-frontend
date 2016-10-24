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

	var _Account = __webpack_require__(2);

	var _Account2 = _interopRequireDefault(_Account);

	var _listItem = __webpack_require__(3);

	var _listItem2 = _interopRequireDefault(_listItem);

	var _assignModal = __webpack_require__(7);

	var _assignModal2 = _interopRequireDefault(_assignModal);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// eslint-disable-next-line no-unused-vars
	var AssessmentListController = {
	    init: function init() {
	        ReactDOM.render(React.createElement(this.reactComponent), document.querySelector("[role=main]"));
	    },


	    reactComponent: React.createClass({
	        displayName: "reactComponent",
	        getInitialState: function getInitialState() {
	            return {
	                account: Object.assign(Object.create(_Account2.default), CR.ControllerData.account),
	                config: CR.ControllerData.config,
	                topOrders: [],
	                moreOrders: []
	            };
	        },
	        render: function render() {
	            var _this = this;

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
	                        { className: "styleless" },
	                        this.state.moreOrders.map(function (order) {
	                            return React.createElement(_listItem2.default, { key: order.id, order: order, account: _this.state.account, config: _this.state.config, parentController: _this });
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
	                                { onClick: this._handleLoadMoreClicked },
	                                "Load more"
	                            )
	                        )
	                    )
	                ),
	                React.createElement(_assignModal2.default, { parentController: this })
	            );
	        },
	        componentDidMount: function componentDidMount() {
	            this._fetchTopOrders();
	        },
	        _fetchTopOrders: function _fetchTopOrders() {
	            var type = "GET";
	            var url = "/api/orders/top";

	            var httpRequest = new XMLHttpRequest();

	            httpRequest.onreadystatechange = function () {
	                if (httpRequest.readyState === XMLHttpRequest.DONE) {
	                    if (httpRequest.status === _global.httpStatusCodes.ok) {
	                        this.setState({
	                            topOrders: JSON.parse(httpRequest.responseText)
	                        });
	                    } else {
	                        alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
	                    }
	                }
	            }.bind(this);
	            httpRequest.open(type, url);
	            httpRequest.send();
	        },
	        componentDidUpdate: function componentDidUpdate() {
	            this._initElements();

	            if (!this.isDefaultSearchDone) {
	                this._searchMore();
	                this.isDefaultSearchDone = true;
	            }
	        },


	        /* TODO: move to `deleteModal`
	         hideOrderOfId(orderId) {
	         const filterFnc = order => order.id !== orderId;
	           this.setState({
	         topOrders: _.filter(this.state.topOrders, filterFnc),
	         moreOrders: _.filter(this.state.moreOrders, filterFnc)
	         });
	         }, */

	        showAssignModal: function showAssignModal(orderId) {
	            this.$assignModal.modal();
	            this.currentOrderId = orderId;
	        },
	        assignOrderTo: function assignOrderTo(account) {
	            var _this2 = this;

	            if (!this.currentOrderId) {
	                alert("Error: `this.currentOrderId` must exist, this is a bug!");
	            } else {
	                (function () {
	                    var order = _.find(_this2.state.topOrders, ["id", _this2.currentOrderId]) || _.find(_this2.state.moreOrders, ["id", _this2.currentOrderId]);

	                    order.rater = account;

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

	                    // We update the lists
	                    _this2.forceUpdate();
	                })();
	            }
	        },
	        _initElements: function _initElements() {
	            this.$loadMorePanel = $("#load-more-panel");
	            this.$assignModal = $("#assign-modal");
	        },
	        _topOrders: function _topOrders() {
	            var _this3 = this;

	            if (this.state.topOrders.length === 0) {
	                return React.createElement(
	                    "div",
	                    { className: "centered-contents" },
	                    React.createElement("i", { className: "fa fa-spinner fa-pulse" })
	                );
	            }
	            return React.createElement(
	                "ul",
	                { className: "styleless" },
	                this.state.topOrders.map(function (order) {
	                    return React.createElement(_listItem2.default, { key: order.id, order: order, account: _this3.state.account, config: _this3.state.config, parentController: _this3 });
	                })
	            );
	        },
	        _handleLoadMoreClicked: function _handleLoadMoreClicked() {
	            this._searchMore();
	        },
	        _searchMore: function _searchMore() {
	            this._updateSearchCriteria();

	            this.$loadMorePanel.addClass("loading");

	            var type = "POST";
	            var url = "/api/orders/search";

	            var httpRequest = new XMLHttpRequest();

	            httpRequest.onreadystatechange = function () {
	                if (httpRequest.readyState === XMLHttpRequest.DONE) {
	                    this.$loadMorePanel.removeClass("loading");

	                    if (httpRequest.status === _global.httpStatusCodes.ok) {
	                        this.setState({
	                            moreOrders: _.concat(this.state.moreOrders, JSON.parse(httpRequest.responseText))
	                        });
	                    } else {
	                        alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
	                    }
	                }
	            }.bind(this);
	            httpRequest.open(type, url);
	            httpRequest.setRequestHeader("Content-Type", "application/json");
	            httpRequest.send(JSON.stringify({
	                fromTimestamp: this.searchCriteria.fromMoment ? this.searchCriteria.fromMoment.valueOf() : null,
	                toTimestamp: this.searchCriteria.toMoment.valueOf(),
	                excludedOrderIds: this.searchCriteria.excludedOrderIds
	            }));
	        },
	        _updateSearchCriteria: function _updateSearchCriteria() {
	            if (!this.searchCriteria) {
	                this.searchNbDays = 7;

	                this.searchCriteria = {
	                    toMoment: moment().subtract(this.searchNbDays, "d"),
	                    excludedOrderIds: this.state.topOrders.map(function (order) {
	                        return order.id;
	                    })
	                };
	            } else {
	                this.searchCriteria.fromMoment = moment(this.searchCriteria.toMoment);

	                this.searchNbDays *= 1.5;
	                this.searchCriteria.toMoment.subtract(this.searchNbDays, "d");
	            }
	        }
	    })
	};

	// eslint-disable-next-line no-unused-vars


	AssessmentListController.init();

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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _global = __webpack_require__(1);

	var _order = __webpack_require__(4);

	var _order2 = _interopRequireDefault(_order);

	var _product = __webpack_require__(5);

	var _product2 = _interopRequireDefault(_product);

	var _raterProfile = __webpack_require__(6);

	var _raterProfile2 = _interopRequireDefault(_raterProfile);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ListItem = React.createClass({
	    displayName: "ListItem",
	    render: function render() {
	        var _this = this;

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
	                this._timeLeft(order),
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
	                    React.createElement(
	                        "p",
	                        null,
	                        order.employerSought
	                    ),
	                    React.createElement(
	                        "p",
	                        null,
	                        order.positionSought
	                    )
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
	                React.createElement(
	                    "div",
	                    null,
	                    this._coupon(order.coupon),
	                    order.tags.map(function (tag) {
	                        var reactKey = order.id + "-" + tag;

	                        return React.createElement(
	                            "span",
	                            { key: reactKey, className: "order-list-item-tag order-tag" },
	                            tag
	                        );
	                    }),
	                    order.containedProductCodes.map(function (productCode) {
	                        return _this._productCode(productCode, order.id);
	                    }),
	                    React.createElement(
	                        "span",
	                        { className: "order-list-item-tag lang" },
	                        order.languageCode
	                    )
	                ),
	                this._actionBtn(order),
	                this._secondaryButtons(order)
	            )
	        );
	    },
	    componentDidMount: function componentDidMount() {
	        this._initElements();
	    },
	    _initElements: function _initElements() {
	        var $listItem = $(ReactDOM.findDOMNode(this.refs.li));

	        this.$bootstrapTooltips = $listItem.find("[data-toggle=tooltip]");

	        this.$bootstrapTooltips.tooltip();
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
	    _timeLeft: function _timeLeft(order) {
	        if (order.status === _order2.default.statuses.completed || order.status === _order2.default.statuses.scheduled) {
	            return null;
	        }

	        var dueDate = moment(order.paymentTimestamp).add(1, "d").subtract(90, "m");
	        var timeLeft = moment.duration(dueDate.valueOf() - moment().valueOf());

	        return React.createElement(
	            "p",
	            null,
	            timeLeft.hours(),
	            "h",
	            timeLeft.minutes(),
	            "m left"
	        );
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
	    _productCode: function _productCode(productCode, orderId) {
	        var reactKey = orderId + "-" + productCode;

	        return React.createElement(
	            "span",
	            { key: reactKey, className: "order-list-item-tag product-code" },
	            _product2.default.humanReadableCode(productCode)
	        );
	    },
	    _actionBtn: function _actionBtn(order) {
	        if (order.status === _order2.default.statuses.completed || order.status === _order2.default.statuses.scheduled) {
	            return this._checkBtn();
	        }
	        return this._assessBtn(order.rater);
	    },
	    _assessBtn: function _assessBtn(rater) {
	        var btn = rater ? React.createElement(
	            "button",
	            { className: "btn btn-default" },
	            "Assess"
	        ) : React.createElement(
	            "button",
	            { className: "btn btn-default", disabled: true },
	            "Assess"
	        );

	        return React.createElement(
	            "div",
	            null,
	            btn
	        );
	    },
	    _checkBtn: function _checkBtn() {
	        return React.createElement(
	            "div",
	            null,
	            React.createElement(
	                "button",
	                { className: "btn btn-default", href: "" },
	                "Check"
	            )
	        );
	    },
	    _secondaryButtons: function _secondaryButtons(order) {
	        var assignBtn = order.status === _order2.default.statuses.completed || order.status === _order2.default.statuses.scheduled || !this.props.account.isAdmin() ? null : React.createElement(
	            "button",
	            { className: "styleless fa fa-user", onClick: this._handleAssignClicked },
	            React.createElement("i", { className: "fa fa-check", "aria-hidden": "true" })
	        );

	        var viewBtn = order.status === _order2.default.statuses.completed || order.status === _order2.default.statuses.scheduled ? React.createElement("button", { className: "styleless fa fa-eye" }) : null;

	        var deleteBtn = this.props.account.isAdmin() ? React.createElement("button", { className: "styleless fa fa-trash", onClick: this._handleDeleteClicked }) : null;

	        return React.createElement(
	            "div",
	            { className: "secondary-buttons" },
	            assignBtn,
	            viewBtn,
	            deleteBtn
	        );
	    },
	    _handleAssignClicked: function _handleAssignClicked() {
	        this.props.parentController.showAssignModal(this.props.order.id);
	    },
	    _handleDeleteClicked: function _handleDeleteClicked() {
	        var order = this.props.order;

	        // TODO: remove
	        console.log("_handleDeleteClicked", order);

	        var type = "DELETE";
	        var url = "/api/orders";

	        var httpRequest = new XMLHttpRequest();

	        httpRequest.onreadystatechange = function () {
	            if (httpRequest.readyState === XMLHttpRequest.DONE) {
	                if (httpRequest.status === _global.httpStatusCodes.ok) {
	                    this.props.parentController.hideOrderOfId(order.id);
	                } else {
	                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
	                }
	            }
	        }.bind(this);
	        httpRequest.open(type, url);
	        httpRequest.setRequestHeader("Content-Type", "application/json");
	        httpRequest.send(JSON.stringify(order));
	    }
	});

	// eslint-disable-next-line no-unused-vars
	exports.default = ListItem;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
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
	    fileNamePrefixSeparator: "-"
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
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var RaterProfile = React.createClass({
	    displayName: "RaterProfile",
	    render: function render() {
	        var account = this.props.account;

	        if (!this.props.account) {
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

	exports.default = RaterProfile;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _global = __webpack_require__(1);

	var _raterProfile = __webpack_require__(6);

	var _raterProfile2 = _interopRequireDefault(_raterProfile);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var AssignModal = React.createClass({
	    displayName: "AssignModal",
	    getInitialState: function getInitialState() {
	        return {
	            allRaters: []
	        };
	    },
	    render: function render() {
	        var _this = this;

	        return React.createElement(
	            "div",
	            { id: "assign-modal", className: "modal fade", tabIndex: "-1", role: "dialog" },
	            React.createElement(
	                "div",
	                { className: "modal-dialog modal-sm", role: "document" },
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
	                            this.state.allRaters.map(function (account) {
	                                return React.createElement(
	                                    "li",
	                                    { key: account.id, onClick: _this._handleItemClicked, "data-account-id": account.id },
	                                    React.createElement(_raterProfile2.default, { account: account })
	                                );
	                            })
	                        )
	                    )
	                )
	            )
	        );
	    },
	    componentDidMount: function componentDidMount() {
	        this._initElements();
	        this._fetchAllRaters();
	    },
	    _initElements: function _initElements() {
	        this.$modal = $("#assign-modal");

	        /* TODO
	         $modal.on("show.bs.modal", function(e) {
	         // Disable the rater currently assigned to the order
	         }); */
	    },
	    _fetchAllRaters: function _fetchAllRaters() {
	        var type = "GET";
	        var url = "/api/accounts/raters";

	        var httpRequest = new XMLHttpRequest();

	        httpRequest.onreadystatechange = function () {
	            if (httpRequest.readyState === XMLHttpRequest.DONE) {
	                if (httpRequest.status === _global.httpStatusCodes.ok) {
	                    this.setState({
	                        allRaters: JSON.parse(httpRequest.responseText)
	                    });
	                } else {
	                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
	                }
	            }
	        }.bind(this);
	        httpRequest.open(type, url);
	        httpRequest.send();
	    },
	    _handleItemClicked: function _handleItemClicked(e) {
	        var accountId = $(e.currentTarget).data("account-id");

	        this.props.parentController.assignOrderTo(_.find(this.state.allRaters, ["id", accountId]));
	        this.$modal.modal("hide");
	    }
	});

	// eslint-disable-next-line no-unused-vars
	exports.default = AssignModal;

/***/ }
/******/ ]);