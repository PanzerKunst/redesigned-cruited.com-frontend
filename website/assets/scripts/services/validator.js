"use strict";

CR.Services.Validator = P(function(c) {
    c.checkEmpty = "empty";
    c.checkEmail = "email";
    c.checkUsername = "username";
    c.checkDateInFuture = "in-future";
    c.checkMinLength = "min-length";
    c.checkMaxLength = "max-length";
    c.checkInteger = "integer";
    c.checkDecimal = "decimal";
    c.checkUrl = "url";

    c.errorMessageAnimationDuration = 0.5;

    c.init = function(fieldIds) {
        this.fieldIds = fieldIds || [];

        for (let i = 0; i < this.fieldIds.length; i++) {
            const $field = $("#" + this.fieldIds[i]);

            this._addBlurEvent($field);
            this._addValueChangedEvent($field);
        }
    };

    c.isValid = function() {
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
    };

    c.flagValid = function($field) {
        this._getWrapperForHasErrorClass($field).removeClass("has-error");
    };

    c.flagInvalid = function($field) {
        this._getWrapperForHasErrorClass($field).addClass("has-error");
    };

    c.isFlaggedInvalid = function($field) {
        return $field.parent().hasClass("has-error");
    };

    c.showErrorMessage = function($errorMsg) {
        if ($errorMsg.html()) {
            $errorMsg.css("display", "block");
            TweenLite.to($errorMsg, this.errorMessageAnimationDuration, {opacity: 1});
        }
    };

    c.hideErrorMessage = function($errorMsg) {
        if ($errorMsg.html()) {
            $errorMsg.css({"display": "none", "opacity": 0});
        }
    };

    c._validateField = function($field, isOnBlur) {
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

        // Date in the future?
        if (this._isToCheckIfDateInFuture($field)) {
            if (!this._isDateInFuture($field.val().trim())) {
                this.flagInvalid($field);
                this.showErrorMessage(this._get$dateInFuture($field));
                return false;
            }
            this.hideErrorMessage(this._get$dateInFuture($field));
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
    };

    c._getWrapperForHasErrorClass = function($field) {
        return this._isFieldTypeCheckbox($field) ?
            $field.parents(".checkbox").parent() :
            $field.parents(".form-group");
    };

    c._get$empty = function($field) {
        return this._get$error($field, this.checkEmpty);
    };

    c._get$email = function($field) {
        return this._get$error($field, this.checkEmail);
    };

    c._get$username = function($field) {
        return this._get$error($field, this.checkUsername);
    };

    c._get$dateInFuture = function($field) {
        return this._get$error($field, this.checkDateInFuture);
    };

    c._get$minLength = function($field) {
        return this._get$error($field, this.checkMinLength);
    };

    c._get$maxLength = function($field) {
        return this._get$error($field, this.checkMaxLength);
    };

    c._get$integer = function($field) {
        return this._get$error($field, this.checkInteger);
    };

    c._get$decimal = function($field) {
        return this._get$error($field, this.checkDecimal);
    };

    c._get$url = function($field) {
        return this._get$error($field, this.checkUrl);
    };

    c._get$error = function($field, checkType) {
        if (this._isFieldTypeCheckbox($field)) {
            return $field.parent().siblings("p[data-check=" + checkType + "]");
        }

        return $field.parents(".form-group").children("p[data-check=" + checkType + "]");
    };

    c._isToCheckIfEmpty = function($field) {
        return this._get$empty($field).length === 1;
    };

    c._isToCheckIfEmail = function($field) {
        return this._get$email($field).length === 1;
    };

    c._isToCheckIfUsername = function($field) {
        return this._get$username($field).length === 1;
    };

    c._isToCheckIfDateInFuture = function($field) {
        return this._get$dateInFuture($field).length === 1;
    };

    c._isToCheckIfMinLength = function($field) {
        return this._get$minLength($field).length === 1;
    };

    c._isToCheckIfMaxLength = function($field) {
        return this._get$maxLength($field).length === 1;
    };

    c._isToCheckIfInteger = function($field) {
        return this._get$integer($field).length === 1;
    };

    c._isToCheckIfDecimal = function($field) {
        return this._get$decimal($field).length === 1;
    };

    c._isToCheckIfUrl = function($field) {
        return this._get$url($field).length === 1;
    };

    c._isEmail = function(email) {
        if (email === "") {
            return true;
        }

        const reg = /^([a-z0-9_\-.])+@([a-z0-9_\-.])+\.([a-z]{2,4})$/i;
        return reg.test(email);
    };

    c._isUsername = function(username) {
        const reg = /^([a-z0-9_\-])+$/i;
        return reg.test(username);
    };

    c._isDateInFuture = function(dateStr) {
        const yearMonthDay = dateStr.split("-");
        const year = parseInt(yearMonthDay[0], 10);
        const month = parseInt(yearMonthDay[1], 10);
        const day = parseInt(yearMonthDay[2], 10);

        const date = new Date(year, month - 1, day);
        const now = new Date();

        const oneDayInMillis = 1000 * 60 * 60 * 24;
        const nbDaysDifference = Math.ceil((date - now) / oneDayInMillis);

        return nbDaysDifference > 0;
    };

    c._isMinLength = function(value, minLength) {
        if (value === null || value === undefined || value === "") {
            return true;
        }

        return value.length >= minLength;
    };

    c._isMaxLength = function(value, maxLength) {
        if (value === null || value === undefined || value === "") {
            return true;
        }

        return value.length <= maxLength;
    };

    c._isInteger = function(value) {
        const reg = /^\d*$/;
        return reg.test(value);
    };

    c._isDecimal = function(value) {
        const reg = /^\d*\.?\d*$/;
        return reg.test(value);
    };

    c._isUrl = function(url) {
        if (url === "") {
            return true;
        }

        const reg = /^(https?|ftp):\/\/(-\.)?([^\s/?.#-]+\.?)+(\/[^\s]*)?$/i;
        return reg.test(url);
    };

    c._isFieldTypeCheckbox = function($field) {
        return $field.attr("type") === "checkbox";
    };

    c._isFieldTypeFile = function($field) {
        return $field.attr("type") === "file";
    };

    c._addBlurEvent = function($field) {
        $field.blur(function() {
            this._validateField($field, true);
        }.bind(this));
    };

    c._addValueChangedEvent = function($field) {
        $field.change(function() {
            this._validateField($field);
        }.bind(this));
    };
});
