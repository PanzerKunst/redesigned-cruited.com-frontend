"use strict";

var CR = {};

// Additional namespaces
CR.Controllers = {};
CR.Services = {};
CR.Models = {};

CR.animationDurations = {
    short: 0.2,
    medium: 0.5
};

CR.httpStatusCodes = {
    ok: 200,
    created: 201,
    noContent: 204
};

CR.Controllers.AssessmentList = Object.create(Object.prototype, {
    init: function init(account) {
        var assessment = CR.Models.Assessment.init();

        console.log("account", account);
        console.log("assessment", assessment);

        ReactDOM.render(React.createElement(this.reactComponent), document.querySelector("[role=main]"));
    },

    @observer
    reactComponent: React.createClass({
        displayName: "reactComponent",
        getInitialState: function getInitialState() {
            return {
                assessment: null
            };
        },
        render: function render() {
            if (!this.state.assessment) {
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
                    this.state.assessment.title
                )
            );
        }
    })
});

CR.Controllers.Common = Object.create(Object.prototype, {
    init: function init() {
        CR.Services.Browser.addUserAgentAttributeToHtmlTag();
        CR.Services.Browser.fixFlexboxIndicatorClass();

        this._initElements();
        this._initEvents();
    },
    _initElements: function _initElements() {
        this.$window = $(window);

        this.$siteHeader = $("#container").children("header");
    },
    _initEvents: function _initEvents() {
        this.$window.scroll(_.debounce(this._onScroll.bind(this), 15));
    },
    _onScroll: function _onScroll() {
        var isScrolledDownEnough = this.$window.scrollTop() > 0;

        this.$siteHeader.toggleClass("scrolled-down", isScrolledDownEnough);
    }
});

CR.Models.Assessment = Object.create(Object.prototype, {
    @observable
    title: ""
});

(function ($) {
    $.fn.fadeIn = function (params) {
        if (!this.is(":visible")) {
            var animationDuration = params && _.isNumber(params.animationDuration) ? params.animationDuration : CR.animationDurations.default;
            var alpha = params && _.isNumber(params.opacity) ? params.opacity : 1;

            TweenLite.set(this, { display: "block", alpha: 0 });
            TweenLite.to(this, animationDuration, {
                alpha: alpha,
                onComplete: function onComplete() {
                    if (params && _.isFunction(params.onComplete)) {
                        params.onComplete();
                    }
                }
            });
        }
    };

    $.fn.fadeOut = function (params) {
        if (this.is(":visible")) {
            var animationDuration = params && _.isNumber(params.animationDuration) ? params.animationDuration : CR.animationDurations.default;

            TweenLite.to(this, animationDuration, {
                alpha: 0,
                onComplete: function () {
                    this.hide().css("opacity", 1);
                    if (params && _.isFunction(params.onComplete)) {
                        params.onComplete();
                    }
                }.bind(this)
            });
        }
    };

    $.fn.enableLoading = function (text) {
        if (this.prop("tagName") === "BUTTON") {
            var btn = this[0];
            var defaultText = btn.innerHTML;
            var loadingText = text || defaultText;

            this.data("defaultText", defaultText);
            this.prop("disabled", true);

            btn.innerHTML = "<i class=\"fa fa-spinner fa-pulse\"></i>" + loadingText;
        }
    };

    $.fn.disableLoading = function () {
        if (this.prop("tagName") === "BUTTON") {
            this.html(this.data("defaultText"));
            this.prop("disabled", false);
        }
    };
})(jQuery);

CR.Services.Browser = {
    regexOfUserAgentsNotSupportingFlexbox: ["OS 8_", "OS 7_", "OS 6_", "OS 5_", "OS 4_"],

    cssRules: function cssRules() {
        if (CR.Services.Browser.allCssRules) {
            return CR.Services.Browser.allCssRules;
        }

        CR.Services.Browser.allCssRules = {};

        var styleSheets = document.styleSheets;

        for (var i = 0; i < styleSheets.length; i++) {
            var styleSheet = styleSheets[i];
            var styleSheetRules = styleSheet.cssRules || styleSheet.rules; // .rules for IE, .cssRules for other browsers

            if (styleSheetRules) {
                for (var j = 0; j < styleSheetRules.length; j++) {
                    var rule = styleSheetRules[j];

                    CR.Services.Browser.allCssRules[rule.selectorText] = rule.style;
                }
            }
        }

        return CR.Services.Browser.allCssRules;
    },
    getCssRule: function getCssRule(selector, property) {
        return CR.Services.Browser.cssRules()[selector].getPropertyValue(property);
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

CR.Services.String = {
    template: function template(text, key, value) {
        var regex = new RegExp("{" + key + "}", "g");

        return text.replace(regex, value);
    }
};

CR.Services.Validator = Object.create(Object.prototype, {
    checkEmpty: "empty",
    checkEmail: "email",
    checkUsername: "username",
    checkDateInFuture: "in-future",
    checkMinLength: "min-length",
    checkMaxLength: "max-length",
    checkInteger: "integer",
    checkDecimal: "decimal",
    checkUrl: "url",

    errorMessageAnimationDuration: 0.5,

    init: function init(fieldIds) {
        this.fieldIds = fieldIds || [];

        for (var i = 0; i < this.fieldIds.length; i++) {
            var $field = $("#" + this.fieldIds[i]);

            this._addBlurEvent($field);
            this._addValueChangedEvent($field);
        }
    },
    isValid: function isValid() {
        var result = true;
        var isFocusOnFirstInvalidFieldDone = false;
        var $field = void 0;

        for (var i = 0; i < this.fieldIds.length; i++) {
            $field = $("#" + this.fieldIds[i]);

            if (!this._validateField($field, false)) {
                result = false;

                // We focus on the first invalid field
                if (!isFocusOnFirstInvalidFieldDone) {
                    $field.focus();
                    isFocusOnFirstInvalidFieldDone = true;
                }
            }
        }

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
            TweenLite.to($errorMsg, this.errorMessageAnimationDuration, { opacity: 1 });
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
        if (this._isFieldTypeCheckbox($field)) {
            return $field.parent().siblings("p[data-check=" + checkType + "]");
        }

        return $field.parents(".form-group").children("p[data-check=" + checkType + "]");
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
        $field.blur(function () {
            this._validateField($field, true);
        }.bind(this));
    },
    _addValueChangedEvent: function _addValueChangedEvent($field) {
        $field.change(function () {
            this._validateField($field);
        }.bind(this));
    }
});