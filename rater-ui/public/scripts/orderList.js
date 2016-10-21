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

	var _listItem = __webpack_require__(1);

	var _listItem2 = _interopRequireDefault(_listItem);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var AssessmentListController = {
	    ordersToDisplayAtTheTop: [],

	    init: function init() {
	        ReactDOM.render(React.createElement(this.reactComponent), document.querySelector("[role=main]")).setState({
	            ordersToDisplayAtTheTop: this.ordersToDisplayAtTheTop
	        });
	    },


	    reactComponent: React.createClass({
	        displayName: "reactComponent",
	        getInitialState: function getInitialState() {
	            return {
	                ordersToDisplayAtTheTop: [],
	                moreOrders: []
	            };
	        },
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
	                    React.createElement(
	                        "ul",
	                        { className: "styleless" },
	                        this.state.ordersToDisplayAtTheTop.map(function (order) {
	                            return React.createElement(_listItem2.default, { key: order.id, order: order });
	                        }),
	                        this.state.moreOrders.map(function (order) {
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
	                                { onClick: this._handleLoadMoreClicked },
	                                "Load more"
	                            )
	                        )
	                    )
	                )
	            );
	        },
	        componentDidUpdate: function componentDidUpdate() {
	            this._initElements();

	            if (!this.isDefaultSearchDone) {
	                this._searchMore();
	                this.isDefaultSearchDone = true;
	            }
	        },
	        _initElements: function _initElements() {
	            var $loadMorePanel = $("#load-more-panel");

	            this.$loadMoreSpinner = $loadMorePanel.find(".fa-spinner");
	            this.$loadMoreLink = $loadMorePanel.find("a");
	        },
	        _handleLoadMoreClicked: function _handleLoadMoreClicked() {
	            this._searchMore();
	        },
	        _searchMore: function _searchMore() {
	            this._updateSearchCriteria();

	            this.$loadMoreSpinner.show();
	            this.$loadMoreLink.hide();

	            var type = "POST";
	            var url = "/api/orders/search";

	            var httpRequest = new XMLHttpRequest();

	            httpRequest.onreadystatechange = function () {
	                if (httpRequest.readyState === XMLHttpRequest.DONE) {
	                    this.$loadMoreSpinner.hide();
	                    this.$loadMoreLink.show();

	                    this.setState({
	                        moreOrders: _.concat(this.state.moreOrders, JSON.parse(httpRequest.responseText))
	                    });
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
	                    excludedOrderIds: this.state.ordersToDisplayAtTheTop.map(function (order) {
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
	}; // eslint-disable-next-line no-unused-vars


	Object.assign(Object.create(AssessmentListController), CR.ControllerData).init();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _order = __webpack_require__(2);

	var _order2 = _interopRequireDefault(_order);

	var _product = __webpack_require__(3);

	var _product2 = _interopRequireDefault(_product);

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
	                this._raterProfile(order.rater),
	                React.createElement(
	                    "p",
	                    null,
	                    "#",
	                    order.id
	                ),
	                this._timeLeft(order.paymentTimestamp, order.status),
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
	                this._actionBtn(order.id, order.idInBase64)
	            )
	        );
	    },
	    componentDidMount: function componentDidMount() {
	        this._initElements();
	    },
	    _initElements: function _initElements() {
	        var $listItem = $(ReactDOM.findDOMNode(this.refs.li));

	        this.$bootstrapTooltips = $listItem.find("[data-toggle=tooltip]");

	        this._initTooltips();
	    },
	    _initTooltips: function _initTooltips() {
	        this.$bootstrapTooltips.tooltip();
	    },
	    _cssClassForStatus: function _cssClassForStatus(status) {
	        switch (status) {
	            case _order2.default.statusIds.paid:
	                return "paid";
	            case _order2.default.statusIds.inProgress:
	                return "in-progress";
	            case _order2.default.statusIds.awaitingFeedback:
	                return "awaiting-feedback";
	            case _order2.default.statusIds.scheduled:
	                return "scheduled";
	            case _order2.default.statusIds.completed:
	                return "completed";
	            default:
	                return "not-paid";
	        }
	    },
	    _raterProfile: function _raterProfile(rater) {
	        if (!rater) {
	            return null;
	        } else {
	            var myProfilePictureStyleAttr = null;
	            var myLinkedinProfile = rater.linkedinProfile;

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
	                    rater.firstName,
	                    " ",
	                    rater.lastName
	                )
	            );
	        }
	    },
	    _timeLeft: function _timeLeft(paymentTimestamp, orderStatus) {
	        if (orderStatus === _order2.default.statusIds.completed || orderStatus === _order2.default.statusIds.scheduled) {
	            return null;
	        }

	        var dueDate = moment(paymentTimestamp).add(1, "d").subtract(90, "m");
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
	    _actionBtn: function _actionBtn(orderStatus, orderIdInBase64) {
	        var label = orderStatus === _order2.default.statusIds.completed || orderStatus === _order2.default.statusIds.scheduled ? "View" : "Assess";

	        // TODO: remove
	        console.log("orderIdInBase64", orderIdInBase64);

	        return React.createElement(
	            "div",
	            null,
	            React.createElement(
	                "button",
	                { className: "btn" },
	                label
	            )
	        );
	    }
	});

	exports.default = ListItem;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Order = {

	    // Static
	    statusIds: {
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
/* 3 */
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

/***/ }
/******/ ]);