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

	var _assessment = __webpack_require__(1);

	var _assessment2 = _interopRequireDefault(_assessment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var AssessmentListController = {
	    init: function init(_ref) {
	        var _this = this;

	        var account = _ref.account;

	        this.assessment = Object.create(_assessment2.default);

	        console.log("account", account);
	        console.log("assessment", this.assessment);

	        setInterval(function () {
	            _this.assessment.secondsPassed++;
	            _this._reRender();
	        }, 1000);

	        this.reactInstance = ReactDOM.render(React.createElement(this.reactComponent), document.querySelector("[role=main]"));

	        this._reRender();
	    },
	    _reRender: function _reRender() {
	        this.reactInstance.replaceState({
	            assessment: this.assessment
	        });
	    },


	    reactComponent: React.createClass({
	        displayName: "reactComponent",
	        getInitialState: function getInitialState() {
	            return {
	                assessment: null
	            };
	        },
	        render: function render() {
	            if (this.state.assessment === null) {
	                return null;
	            }

	            return React.createElement(
	                "div",
	                { id: "content" },
	                React.createElement("header", null),
	                React.createElement(
	                    "div",
	                    { className: "with-circles" },
	                    React.createElement(
	                        "p",
	                        null,
	                        "Assessment List"
	                    ),
	                    this.state.assessment.secondsPassed
	                )
	            );
	        }
	    })
	};

	Object.create(AssessmentListController).init(CR.ControllerData);

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var AssessmentModel = {
	    secondsPassed: 0
	};

	exports.default = AssessmentModel;

/***/ }
/******/ ]);