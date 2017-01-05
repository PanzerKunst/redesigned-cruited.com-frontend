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

	var _validator = __webpack_require__(3);

	var _validator2 = _interopRequireDefault(_validator);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var controller = {
	    init: function init() {
	        ReactDOM.render(React.createElement(this.reactComponent), document.querySelector("[role=main]"));
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
	                            "Sign in"
	                        )
	                    )
	                ),
	                React.createElement(
	                    "div",
	                    { className: "with-circles" },
	                    React.createElement(
	                        "div",
	                        { id: "sign-in-panel", className: "single-column-panel" },
	                        React.createElement(
	                            "form",
	                            { ref: "form", onSubmit: this._handleSubmit },
	                            React.createElement(
	                                "div",
	                                { className: "form-group" },
	                                React.createElement(
	                                    "label",
	                                    { htmlFor: "email-address-si" },
	                                    "E-mail address"
	                                ),
	                                React.createElement("input", { type: "text", className: "form-control", id: "email-address-si", placeholder: "your@email.com" }),
	                                React.createElement("p", { className: "field-error", "data-check": "empty" }),
	                                React.createElement(
	                                    "p",
	                                    { className: "field-error", "data-check": "email" },
	                                    "Can you please double-check that address, it doesn't seem valid"
	                                )
	                            ),
	                            React.createElement(
	                                "div",
	                                { className: "form-group" },
	                                React.createElement(
	                                    "label",
	                                    { htmlFor: "password-si" },
	                                    "Password"
	                                ),
	                                React.createElement("input", { type: "password", className: "form-control", id: "password-si" }),
	                                React.createElement("p", { className: "field-error", "data-check": "empty" })
	                            ),
	                            React.createElement(
	                                "div",
	                                { className: "centered-contents" },
	                                React.createElement(
	                                    "p",
	                                    { className: "other-form-error", id: "incorrect-credentials" },
	                                    "You are dead :'( \xA0\xA0Play again?"
	                                ),
	                                React.createElement(
	                                    "button",
	                                    { type: "submit", className: "btn btn-lg btn-primary" },
	                                    "Sign in"
	                                )
	                            )
	                        )
	                    )
	                )
	            );
	        },
	        componentDidMount: function componentDidMount() {
	            this._initElements();
	            this._initValidation();
	        },
	        _initElements: function _initElements() {
	            var $emailForm = $("#content").find("form");

	            this.$emailAddressField = $emailForm.find("#email-address-si");
	            this.$passwordField = $emailForm.find("#password-si");

	            this.$otherFormErrors = $emailForm.find(".other-form-error");
	            this.$incorrectCredentialsError = this.$otherFormErrors.filter("#incorrect-credentials");

	            this.$submitBtn = $emailForm.find("[type=submit]");
	        },
	        _initValidation: function _initValidation() {
	            this.validator = (0, _validator2.default)(["email-address-si", "password-si"]);
	        },
	        _handleSubmit: function _handleSubmit(e) {
	            var _this = this;

	            e.preventDefault();

	            this.validator.hideErrorMessage(this.$otherFormErrors);

	            if (this.validator.isValid()) {
	                (function () {
	                    (0, _animator.enableLoading)(_this.$submitBtn);

	                    var type = "POST";
	                    var url = "/api/auth";
	                    var httpRequest = new XMLHttpRequest();

	                    httpRequest.onreadystatechange = function () {
	                        if (httpRequest.readyState === XMLHttpRequest.DONE) {
	                            if (httpRequest.status === _global.httpStatusCodes.ok) {
	                                CR.loggedInAccount = JSON.parse(httpRequest.responseText);
	                                location.href = "/";
	                            } else {
	                                (0, _animator.disableLoading)(_this.$submitBtn);

	                                if (httpRequest.status === _global.httpStatusCodes.signInIncorrectCredentials) {
	                                    _this.validator.showErrorMessage(_this.$incorrectCredentialsError);
	                                } else {
	                                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
	                                }
	                            }
	                        }
	                    };
	                    httpRequest.open(type, url);
	                    httpRequest.setRequestHeader("Content-Type", "application/json");
	                    httpRequest.send(JSON.stringify({
	                        emailAddress: _this.$emailAddressField.val(),
	                        password: _this.$passwordField.val()
	                    }));
	                })();
	            }
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
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _global = __webpack_require__(1);

	var Validator = {
	    fieldIds: [],
	    checkEmpty: "empty",
	    checkEmail: "email",
	    checkUsername: "username",
	    checkDateInFuture: "in-future",
	    checkMinLength: "min-length",
	    checkMaxLength: "max-length",
	    checkInteger: "integer",
	    checkDecimal: "decimal",
	    checkUrl: "url",

	    init: function init() {
	        var _this = this;

	        var $field = void 0;

	        this.fieldIds.forEach(function (id) {
	            $field = $("#" + id);

	            _this._addBlurEvent($field);
	            _this._addValueChangedEvent($field);
	        });
	    },
	    isValid: function isValid() {
	        var _this2 = this;

	        var result = true;
	        var isFocusOnFirstInvalidFieldDone = false;
	        var $field = void 0;

	        this.fieldIds.forEach(function (id) {
	            $field = $("#" + id);

	            if (!_this2._validateField($field, false)) {
	                result = false;

	                // We focus on the first invalid field
	                if (!isFocusOnFirstInvalidFieldDone) {
	                    $field.focus();
	                    isFocusOnFirstInvalidFieldDone = true;
	                }
	            }
	        });

	        return result;
	    },
	    flagValid: function flagValid($field) {
	        this._getWrapperForHasErrorClass($field).removeClass("has-error");
	    },
	    flagInvalid: function flagInvalid($field) {
	        this._getWrapperForHasErrorClass($field).addClass("has-error");
	    },
	    isFlaggedInvalid: function isFlaggedInvalid($field) {
	        return $field.parent().hasClass("has-error");
	    },
	    showErrorMessage: function showErrorMessage($errorMsg) {
	        if ($errorMsg.html()) {
	            $errorMsg.css("display", "block");
	            TweenLite.to($errorMsg, _global.animationDurations.medium, { opacity: 1 });
	        }
	    },
	    hideErrorMessage: function hideErrorMessage($errorMsg) {
	        if ($errorMsg.html()) {
	            $errorMsg.css({ display: "none", opacity: 0 });
	        }
	    },
	    _validateField: function _validateField($field, isOnBlur) {

	        // Empty?
	        if (this._isToCheckIfEmpty($field)) {
	            if (this._isFieldTypeCheckbox($field)) {
	                if (!$field.prop("checked")) {
	                    this.flagInvalid($field);
	                    this.showErrorMessage(this._get$empty($field));
	                    return false;
	                }
	            } else if (this._isFieldTypeFile($field)) {
	                if (!$field[0].files[0]) {
	                    this.flagInvalid($field);
	                    this.showErrorMessage(this._get$empty($field));
	                    return false;
	                }
	            } else if (!$field.val() || !$field.val().trim()) {
	                if (!isOnBlur) {
	                    this.flagInvalid($field);
	                    this.showErrorMessage(this._get$empty($field));
	                }
	                return false;
	            }

	            this.hideErrorMessage(this._get$empty($field));
	        }

	        // Email?
	        if (this._isToCheckIfEmail($field)) {
	            if (!this._isEmail($field.val().trim())) {
	                this.flagInvalid($field);
	                this.showErrorMessage(this._get$email($field));
	                return false;
	            }

	            this.hideErrorMessage(this._get$email($field));
	        }

	        // Username?
	        if (this._isToCheckIfUsername($field)) {
	            if (!this._isUsername($field.val().trim())) {
	                this.flagInvalid($field);
	                this.showErrorMessage(this._get$username($field));
	                return false;
	            }
	            this.hideErrorMessage(this._get$username($field));
	        }

	        // In the future?
	        if (this._isToCheckIfInFuture($field)) {
	            if (!this._isInFuture($field.val().trim())) {
	                this.flagInvalid($field);
	                this.showErrorMessage(this._get$inFuture($field));
	                return false;
	            }
	            this.hideErrorMessage(this._get$inFuture($field));
	        }

	        // Min length?
	        if (this._isToCheckIfMinLength($field)) {
	            if (!this._isMinLength($field.val().trim(), $field.data("min-length"))) {
	                this.flagInvalid($field);
	                this.showErrorMessage(this._get$minLength($field));
	                return false;
	            }
	            this.hideErrorMessage(this._get$minLength($field));
	        }

	        // Max length?
	        if (this._isToCheckIfMaxLength($field)) {
	            if (!this._isMaxLength($field.val().trim(), $field.attr("maxLength"))) {
	                this.flagInvalid($field);
	                this.showErrorMessage(this._get$maxLength($field));
	                return false;
	            }
	            this.hideErrorMessage(this._get$maxLength($field));
	        }

	        // Integer number?
	        if (this._isToCheckIfInteger($field)) {
	            if (!this._isInteger($field.val().trim())) {
	                this.flagInvalid($field);
	                this.showErrorMessage(this._get$integer($field));
	                return false;
	            }
	            this.hideErrorMessage(this._get$integer($field));
	        }

	        // Decimal number?
	        if (this._isToCheckIfDecimal($field)) {
	            if (!this._isDecimal($field.val().trim())) {
	                this.flagInvalid($field);
	                this.showErrorMessage(this._get$decimal($field));
	                return false;
	            }
	            this.hideErrorMessage(this._get$decimal($field));
	        }

	        // URL?
	        if (this._isToCheckIfUrl($field)) {
	            if (!this._isUrl($field.val().trim())) {
	                this.flagInvalid($field);
	                this.showErrorMessage(this._get$url($field));
	                return false;
	            }
	            this.hideErrorMessage(this._get$url($field));
	        }

	        this.flagValid($field);

	        return true;
	    },
	    _getWrapperForHasErrorClass: function _getWrapperForHasErrorClass($field) {
	        return this._isFieldTypeCheckbox($field) ? $field.parents(".checkbox").parent() : $field.parents(".form-group");
	    },
	    _get$empty: function _get$empty($field) {
	        return this._get$error($field, this.checkEmpty);
	    },
	    _get$email: function _get$email($field) {
	        return this._get$error($field, this.checkEmail);
	    },
	    _get$username: function _get$username($field) {
	        return this._get$error($field, this.checkUsername);
	    },
	    _get$inFuture: function _get$inFuture($field) {
	        return this._get$error($field, this.checkDateInFuture);
	    },
	    _get$minLength: function _get$minLength($field) {
	        return this._get$error($field, this.checkMinLength);
	    },
	    _get$maxLength: function _get$maxLength($field) {
	        return this._get$error($field, this.checkMaxLength);
	    },
	    _get$integer: function _get$integer($field) {
	        return this._get$error($field, this.checkInteger);
	    },
	    _get$decimal: function _get$decimal($field) {
	        return this._get$error($field, this.checkDecimal);
	    },
	    _get$url: function _get$url($field) {
	        return this._get$error($field, this.checkUrl);
	    },
	    _get$error: function _get$error($field, checkType) {
	        var selector = "p[data-check=" + checkType + "]";

	        if (this._isFieldTypeCheckbox($field)) {
	            return $field.parent().siblings(selector);
	        }

	        return $field.parents(".form-group").children(selector);
	    },
	    _isToCheckIfEmpty: function _isToCheckIfEmpty($field) {
	        return this._get$empty($field).length === 1;
	    },
	    _isToCheckIfEmail: function _isToCheckIfEmail($field) {
	        return this._get$email($field).length === 1;
	    },
	    _isToCheckIfUsername: function _isToCheckIfUsername($field) {
	        return this._get$username($field).length === 1;
	    },
	    _isToCheckIfInFuture: function _isToCheckIfInFuture($field) {
	        return this._get$inFuture($field).length === 1;
	    },
	    _isToCheckIfMinLength: function _isToCheckIfMinLength($field) {
	        return this._get$minLength($field).length === 1;
	    },
	    _isToCheckIfMaxLength: function _isToCheckIfMaxLength($field) {
	        return this._get$maxLength($field).length === 1;
	    },
	    _isToCheckIfInteger: function _isToCheckIfInteger($field) {
	        return this._get$integer($field).length === 1;
	    },
	    _isToCheckIfDecimal: function _isToCheckIfDecimal($field) {
	        return this._get$decimal($field).length === 1;
	    },
	    _isToCheckIfUrl: function _isToCheckIfUrl($field) {
	        return this._get$url($field).length === 1;
	    },
	    _isEmail: function _isEmail(email) {
	        if (email === "") {
	            return true;
	        }

	        var reg = /^([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,4})$/i;

	        return reg.test(email);
	    },
	    _isUsername: function _isUsername(username) {
	        var reg = /^([a-z0-9_\-])+$/i;

	        return reg.test(username);
	    },
	    _isInFuture: function _isInFuture(dateStr) {
	        var yearMonthDay = dateStr.split("-");
	        var year = parseInt(yearMonthDay[0], 10);
	        var month = parseInt(yearMonthDay[1], 10);
	        var day = parseInt(yearMonthDay[2], 10);

	        var date = new Date(year, month - 1, day);
	        var now = new Date();

	        var oneDayInMillis = 1000 * 60 * 60 * 24;
	        var nbDaysDifference = Math.ceil((date - now) / oneDayInMillis);

	        return nbDaysDifference > 0;
	    },
	    _isMinLength: function _isMinLength(value, minLength) {
	        if (value !== 0 && !value) {
	            return true;
	        }

	        return value.length >= minLength;
	    },
	    _isMaxLength: function _isMaxLength(value, maxLength) {
	        if (value !== 0 && !value) {
	            return true;
	        }

	        return value.length <= maxLength;
	    },
	    _isInteger: function _isInteger(value) {
	        var reg = /^\d*$/;

	        return reg.test(value);
	    },
	    _isDecimal: function _isDecimal(value) {
	        var reg = /^\d*\.?\d*$/;

	        return reg.test(value);
	    },
	    _isUrl: function _isUrl(url) {
	        if (url === "") {
	            return true;
	        }

	        var reg = /^(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?$/i;

	        return reg.test(url);
	    },
	    _isFieldTypeCheckbox: function _isFieldTypeCheckbox($field) {
	        return $field.attr("type") === "checkbox";
	    },
	    _isFieldTypeFile: function _isFieldTypeFile($field) {
	        return $field.attr("type") === "file";
	    },
	    _addBlurEvent: function _addBlurEvent($field) {
	        var _this3 = this;

	        $field.blur(function () {
	            _this3._validateField($field, true);
	        });
	    },
	    _addValueChangedEvent: function _addValueChangedEvent($field) {
	        var _this4 = this;

	        $field.change(function () {
	            _this4._validateField($field);
	        });
	    }
	};

	function validator(fieldIds) {
	    var instance = Object.assign(Object.create(Validator), {
	        fieldIds: fieldIds
	    });

	    instance.init();

	    return instance;
	}

	exports.default = validator;

/***/ }
/******/ ]);