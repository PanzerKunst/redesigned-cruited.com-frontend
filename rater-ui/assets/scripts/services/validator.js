import $ from "jquery";
import {TweenLite} from "gsap";

const ValidatorService = Object.create(Object.prototype, {
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

    init(fieldIds) {
        this.fieldIds = fieldIds || [];

        for (let i = 0; i < this.fieldIds.length; i++) {
            const $field = $("#" + this.fieldIds[i]);

            this._addBlurEvent($field);
            this._addValueChangedEvent($field);
        }
    },

    isValid() {
        let result = true;
        let isFocusOnFirstInvalidFieldDone = false;
        let $field;

        for (let i = 0; i < this.fieldIds.length; i++) {
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

    flagValid($field) {
        this._getWrapperForHasErrorClass($field).removeClass("has-error");
    },

    flagInvalid($field) {
        this._getWrapperForHasErrorClass($field).addClass("has-error");
    },

    isFlaggedInvalid($field) {
        return $field.parent().hasClass("has-error");
    },

    showErrorMessage($errorMsg) {
        if ($errorMsg.html()) {
            $errorMsg.css("display", "block");
            TweenLite.to($errorMsg, this.errorMessageAnimationDuration, {opacity: 1});
        }
    },

    hideErrorMessage($errorMsg) {
        if ($errorMsg.html()) {
            $errorMsg.css({display: "none", opacity: 0});
        }
    },

    _validateField($field, isOnBlur) {

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

    _getWrapperForHasErrorClass($field) {
        return this._isFieldTypeCheckbox($field) ?
            $field.parents(".checkbox").parent() :
            $field.parents(".form-group");
    },

    _get$empty($field) {
        return this._get$error($field, this.checkEmpty);
    },

    _get$email($field) {
        return this._get$error($field, this.checkEmail);
    },

    _get$username($field) {
        return this._get$error($field, this.checkUsername);
    },

    _get$inFuture($field) {
        return this._get$error($field, this.checkDateInFuture);
    },

    _get$minLength($field) {
        return this._get$error($field, this.checkMinLength);
    },

    _get$maxLength($field) {
        return this._get$error($field, this.checkMaxLength);
    },

    _get$integer($field) {
        return this._get$error($field, this.checkInteger);
    },

    _get$decimal($field) {
        return this._get$error($field, this.checkDecimal);
    },

    _get$url($field) {
        return this._get$error($field, this.checkUrl);
    },

    _get$error($field, checkType) {
        if (this._isFieldTypeCheckbox($field)) {
            return $field.parent().siblings("p[data-check=" + checkType + "]");
        }

        return $field.parents(".form-group").children("p[data-check=" + checkType + "]");
    },

    _isToCheckIfEmpty($field) {
        return this._get$empty($field).length === 1;
    },

    _isToCheckIfEmail($field) {
        return this._get$email($field).length === 1;
    },

    _isToCheckIfUsername($field) {
        return this._get$username($field).length === 1;
    },

    _isToCheckIfInFuture($field) {
        return this._get$inFuture($field).length === 1;
    },

    _isToCheckIfMinLength($field) {
        return this._get$minLength($field).length === 1;
    },

    _isToCheckIfMaxLength($field) {
        return this._get$maxLength($field).length === 1;
    },

    _isToCheckIfInteger($field) {
        return this._get$integer($field).length === 1;
    },

    _isToCheckIfDecimal($field) {
        return this._get$decimal($field).length === 1;
    },

    _isToCheckIfUrl($field) {
        return this._get$url($field).length === 1;
    },

    _isEmail(email) {
        if (email === "") {
            return true;
        }

        const reg = /^([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,4})$/i;

        return reg.test(email);
    },

    _isUsername(username) {
        const reg = /^([a-z0-9_\-])+$/i;

        return reg.test(username);
    },

    _isInFuture(dateStr) {
        const yearMonthDay = dateStr.split("-");
        const year = parseInt(yearMonthDay[0], 10);
        const month = parseInt(yearMonthDay[1], 10);
        const day = parseInt(yearMonthDay[2], 10);

        const date = new Date(year, month - 1, day);
        const now = new Date();

        const oneDayInMillis = 1000 * 60 * 60 * 24;
        const nbDaysDifference = Math.ceil((date - now) / oneDayInMillis);

        return nbDaysDifference > 0;
    },

    _isMinLength(value, minLength) {
        if (value !== 0 && !value) {
            return true;
        }

        return value.length >= minLength;
    },

    _isMaxLength(value, maxLength) {
        if (value !== 0 && !value) {
            return true;
        }

        return value.length <= maxLength;
    },

    _isInteger(value) {
        const reg = /^\d*$/;

        return reg.test(value);
    },

    _isDecimal(value) {
        const reg = /^\d*\.?\d*$/;

        return reg.test(value);
    },

    _isUrl(url) {
        if (url === "") {
            return true;
        }

        const reg = /^(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?$/i;

        return reg.test(url);
    },

    _isFieldTypeCheckbox($field) {
        return $field.attr("type") === "checkbox";
    },

    _isFieldTypeFile($field) {
        return $field.attr("type") === "file";
    },

    _addBlurEvent($field) {
        $field.blur(function() {
            this._validateField($field, true);
        }.bind(this));
    },

    _addValueChangedEvent($field) {
        $field.change(function() {
            this._validateField($field);
        }.bind(this));
    }
});

export {ValidatorService as default};
