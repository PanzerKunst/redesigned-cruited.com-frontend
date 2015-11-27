"use strict";

var CR = {};

// Additional namespaces
CR.Controllers = {};
CR.Services = {};
CR.Models = {};

CR.animationDurations = {
    "default": 0.5
};

CR.httpStatusCodes = {
    ok: 200,
    created: 201,
    noContent: 204,
    emailAlreadyRegistered: 230,
    linkedinAccountIdAlreadyRegistered: 231
};

CR.localStorageKeys = {
    order: "order"
};

// Global functions
"use strict";

CR.Controllers.Index = React.createClass({
    displayName: "Index",

    dwsUrlRoot: "http://localhost:9001/",

    render: function render() {
        return React.createElement(
            "div",
            { id: "content" },
            React.createElement(
                "div",
                { id: "page-header-bar" },
                React.createElement(
                    "h1",
                    null,
                    "DWS Test Client"
                )
            ),
            React.createElement(
                "div",
                { className: "with-circles" },
                this._getCreateOrderForm(),
                this._getFileUploadForm(),
                this._getDocLinksAndThumbs()
            )
        );
    },

    componentDidMount: function componentDidMount() {
        this._initElements();
        this._initValidation();
        this._initLinksAndThumbs();
    },

    _getCreateOrderForm: function _getCreateOrderForm() {
        return React.createElement(
            "form",
            { id: "create-order-form", onSubmit: this._cofSubmit },
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                    "label",
                    { htmlFor: "doc-types" },
                    "Doc types"
                ),
                React.createElement("input", { type: "text", id: "doc-types", className: "form-control" }),
                React.createElement("p", { className: "field-error", "data-check": "empty" })
            ),
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                    "label",
                    { htmlFor: "edition-id" },
                    "Edition ID"
                ),
                React.createElement("input", { type: "text", id: "edition-id", className: "form-control" }),
                React.createElement("p", { className: "field-error", "data-check": "empty" })
            ),
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                    "label",
                    { htmlFor: "session-id" },
                    "Session ID"
                ),
                React.createElement("input", { type: "text", id: "session-id", className: "form-control" }),
                React.createElement("p", { className: "field-error", "data-check": "empty" })
            ),
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                    "label",
                    { htmlFor: "position-sought" },
                    "Position sought"
                ),
                React.createElement("input", { type: "text", id: "position-sought", className: "form-control" })
            ),
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                    "label",
                    { htmlFor: "employer-sought" },
                    "Employer sought"
                ),
                React.createElement("input", { type: "text", id: "employer-sought", className: "form-control" })
            ),
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                    "label",
                    { htmlFor: "user-id" },
                    "User Id"
                ),
                React.createElement("input", { type: "text", id: "user-id", className: "form-control" })
            ),
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                    "label",
                    { htmlFor: "coupon-code" },
                    "Coupon"
                ),
                React.createElement("input", { type: "text", id: "coupon-code", className: "form-control" })
            ),
            React.createElement(
                "div",
                { className: "form-group fg-file-upload", "data-id": "cv-form-group" },
                React.createElement(
                    "label",
                    null,
                    "Your CV"
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "label",
                        { className: "btn btn-default btn-file-upload" },
                        React.createElement("input", { type: "file", accept: ".doc, .docx, .pdf, .odt, .rtf", onChange: this._handleCofCvFileSelected }),
                        "Browse"
                    ),
                    React.createElement("input", { type: "text", className: "form-control", disabled: true })
                )
            ),
            React.createElement(
                "div",
                { className: "form-group fg-file-upload", "data-id": "cover-letter-form-group" },
                React.createElement(
                    "label",
                    null,
                    "Your cover letter"
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "label",
                        { className: "btn btn-default btn-file-upload" },
                        React.createElement("input", { type: "file", accept: ".doc, .docx, .pdf, .odt, .rtf", onChange: this._handleCofCoverLetterFileSelected }),
                        "Browse"
                    ),
                    React.createElement("input", { type: "text", className: "form-control", disabled: true })
                )
            ),
            React.createElement(
                "div",
                { className: "centered-contents" },
                React.createElement(
                    "button",
                    { type: "submit", className: "btn btn-lg btn-primary" },
                    "Create order"
                )
            )
        );
    },

    _getFileUploadForm: function _getFileUploadForm() {
        return React.createElement(
            "form",
            { id: "file-upload-form" },
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                    "label",
                    { htmlFor: "order-id" },
                    "Order ID"
                ),
                React.createElement("input", { type: "text", id: "order-id", className: "form-control", defaultValue: "1711", onChange: this._initLinksAndThumbs })
            ),
            React.createElement(
                "div",
                { className: "form-group fg-file-upload", "data-id": "cv-form-group" },
                React.createElement(
                    "label",
                    null,
                    "Your CV"
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "label",
                        { className: "btn btn-default btn-file-upload" },
                        React.createElement("input", { type: "file", accept: ".doc, .docx, .pdf, .odt, .rtf", onChange: this._handleFufCvFileSelected }),
                        "Browse"
                    ),
                    React.createElement("input", { type: "text", className: "form-control", disabled: true })
                )
            ),
            React.createElement(
                "div",
                { className: "form-group fg-file-upload", "data-id": "cover-letter-form-group" },
                React.createElement(
                    "label",
                    null,
                    "Your cover letter"
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "label",
                        { className: "btn btn-default btn-file-upload" },
                        React.createElement("input", { type: "file", accept: ".doc, .docx, .pdf, .odt, .rtf", onChange: this._handleFufCoverLetterFileSelected }),
                        "Browse"
                    ),
                    React.createElement("input", { type: "text", className: "form-control", disabled: true })
                )
            ),
            React.createElement(
                "div",
                { className: "centered-contents" },
                React.createElement(
                    "button",
                    { type: "button", className: "btn btn-lg btn-primary", onClick: this._addDocs },
                    "Add"
                ),
                React.createElement(
                    "button",
                    { type: "button", className: "btn btn-lg btn-primary", onClick: this._editDocs },
                    "Edit"
                )
            )
        );
    },

    _getDocLinksAndThumbs: function _getDocLinksAndThumbs() {
        return React.createElement(
            "section",
            null,
            React.createElement(
                "div",
                null,
                React.createElement(
                    "a",
                    { id: "cv-link" },
                    "CV"
                ),
                React.createElement(
                    "a",
                    { id: "cover-letter-link" },
                    "Cover Letter"
                ),
                React.createElement(
                    "a",
                    { id: "linkedin-profile-link" },
                    "Linkedin profile"
                )
            ),
            React.createElement(
                "div",
                null,
                React.createElement("img", { id: "cv-thumb" }),
                React.createElement("img", { id: "cover-letter-thumb" }),
                React.createElement("img", { id: "linkedin-profile-thumb" })
            )
        );
    },

    _initElements: function _initElements() {
        this.$createOrderForm = $("#create-order-form");

        this.$docTypesInput = $("#doc-types");
        this.$editionIdInput = $("#edition-id");
        this.$sessionIdInput = $("#session-id");
        this.$positionSoughtInput = $("#position-sought");
        this.$employerSoughtInput = $("#employer-sought");
        this.$userIdInput = $("#user-id");
        this.$couponCodeInput = $("#coupon-code");

        this.$cofCvFormGroup = this.$createOrderForm.children().filter("[data-id=\"cv-form-group\"]");
        this.$cofCvFileInput = this.$cofCvFormGroup.find("input[type=file]");
        this.$cofCvFileNameInput = this.$cofCvFormGroup.find("input[type=text]");

        this.$cofCoverLetterFormGroup = this.$createOrderForm.children().filter("[data-id=\"cover-letter-form-group\"]");
        this.$cofCoverLetterFileInput = this.$cofCoverLetterFormGroup.find("input[type=file]");
        this.$cofCoverLetterFileNameInput = this.$cofCoverLetterFormGroup.find("input[type=text]");

        this.$fileUploadForm = $("#file-upload-form");

        this.$orderIdInput = $("#order-id");

        this.$fufCvFormGroup = this.$fileUploadForm.children().filter("[data-id=\"cv-form-group\"]");
        this.$fufCvFileInput = this.$fufCvFormGroup.find("input[type=file]");
        this.$fufCvFileNameInput = this.$fufCvFormGroup.find("input[type=text]");

        this.$fufCoverLetterFormGroup = this.$fileUploadForm.children().filter("[data-id=\"cover-letter-form-group\"]");
        this.$fufCoverLetterFileInput = this.$fufCoverLetterFormGroup.find("input[type=file]");
        this.$fufCoverLetterFileNameInput = this.$fufCoverLetterFormGroup.find("input[type=text]");

        this.$cvLink = $("#cv-link");
        this.$coverLetterLink = $("#cover-letter-link");
        this.$linkedinProfileLink = $("#linkedin-profile-link");

        this.$cvImg = $("#cv-thumb");
        this.$coverLetterImg = $("#cover-letter-thumb");
        this.$linkedinProfileImg = $("#linkedin-profile-thumb");
    },

    _initValidation: function _initValidation() {
        this.validator = CR.Services.Validator(["doc-types", "edition-id", "session-id"]);
    },

    _initLinksAndThumbs: function _initLinksAndThumbs() {
        var orderId = this.$orderIdInput.val();

        var cvUrl = this.dwsUrlRoot + "docs/" + orderId + "/cv";
        var coverLetterUrl = this.dwsUrlRoot + "docs/" + orderId + "/cover-letter";
        var linkedinProfileUrl = this.dwsUrlRoot + "docs/" + orderId + "/linkedin-profile";

        this.$cvLink.attr("href", cvUrl);
        this.$coverLetterLink.attr("href", coverLetterUrl);
        this.$linkedinProfileLink.attr("href", linkedinProfileUrl);

        this.$cvImg.attr("href", cvUrl + "/thumbnail");
        this.$coverLetterImg.attr("href", coverLetterUrl + "/thumbnail");
        this.$linkedinProfileImg.attr("href", linkedinProfileUrl + "/thumbnail");
    },

    _handleCofCvFileSelected: function _handleCofCvFileSelected() {
        this.cofCvFile = this.$cofCvFileInput[0].files[0];
        this.$cofCvFileNameInput.val(this.cofCvFile.name);
    },

    _handleFufCvFileSelected: function _handleFufCvFileSelected() {
        this.fufCvFile = this.$fufCvFileInput[0].files[0];
        this.$fufCvFileNameInput.val(this.fufCvFile.name);
    },

    _handleCofCoverLetterFileSelected: function _handleCofCoverLetterFileSelected() {
        this.cofCoverLetterFile = this.$cofCoverLetterFileInput[0].files[0];
        this.$cofCoverLetterFileNameInput.val(this.cofCoverLetterFile.name);
    },

    _handleFufCoverLetterFileSelected: function _handleFufCoverLetterFileSelected() {
        this.fufCoverLetterFile = this.$fufCoverLetterFileInput[0].files[0];
        this.$fufCoverLetterFileNameInput.val(this.fufCoverLetterFile.name);
    },

    _cofSubmit: function _cofSubmit(e) {
        var _this = this;

        e.preventDefault();

        if (this.validator.isValid()) {
            (function () {
                var formData = new FormData();
                formData.append("docTypes", _this.$docTypesInput.val());
                formData.append("editionId", _this.$editionIdInput.val());
                formData.append("sessionId", _this.$sessionIdInput.val());

                var positionSought = _this.$positionSoughtInput.val();
                if (positionSought) {
                    formData.append("positionSought", positionSought);
                }

                var employerSought = _this.$employerSoughtInput.val();
                if (employerSought) {
                    formData.append("employerSought", employerSought);
                }

                var userId = _this.$userIdInput.val();
                if (userId) {
                    formData.append("userId", userId);
                }

                var couponCode = _this.$couponCodeInput.val();
                if (couponCode) {
                    formData.append("couponCode", couponCode);
                }

                if (_this.cofCvFile) {
                    formData.append("cvFile", _this.cofCvFile, _this.cofCvFile.name);
                }
                if (_this.cofCoverLetterFile) {
                    formData.append("coverLetterFile", _this.cofCoverLetterFile, _this.cofCoverLetterFile.name);
                }

                var type = "POST";
                var url = _this.dwsUrlRoot + "order";

                var httpRequest = new XMLHttpRequest();
                httpRequest.onreadystatechange = function () {
                    if (httpRequest.readyState === XMLHttpRequest.DONE) {
                        if (httpRequest.status === CR.httpStatusCodes.created) {
                            alert("success! Order ID is '" + httpRequest.responseText + "'");
                        } else {
                            alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                        }
                    }
                };
                httpRequest.open(type, url);
                httpRequest.send(formData);
            })();
        }
    },

    _addDocs: function _addDocs() {
        this._fufSubmit("POST", CR.httpStatusCodes.created);
    },

    _editDocs: function _editDocs() {
        this._fufSubmit("PUT", CR.httpStatusCodes.ok);
    },

    _fufSubmit: function _fufSubmit(method, expectedHttpStatusCode) {
        var _this2 = this;

        if (this.fufCvFile || this.fufCoverLetterFile) {
            (function () {
                var formData = new FormData();
                formData.append("orderId", _this2.$orderIdInput.val());
                if (_this2.fufCvFile) {
                    formData.append("cvFile", _this2.fufCvFile, _this2.fufCvFile.name);
                }
                if (_this2.fufCoverLetterFile) {
                    formData.append("coverLetterFile", _this2.fufCoverLetterFile, _this2.fufCoverLetterFile.name);
                }

                var type = method;
                var url = _this2.dwsUrlRoot + "docs";

                var httpRequest = new XMLHttpRequest();
                httpRequest.onreadystatechange = function () {
                    if (httpRequest.readyState === XMLHttpRequest.DONE) {
                        if (httpRequest.status === expectedHttpStatusCode) {
                            alert("success!");
                        } else {
                            alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                        }
                    }
                };
                httpRequest.open(type, url);
                httpRequest.send(formData);
            })();
        }
    }
});
"use strict";

CR.Services.String = {
    template: function template(text, key, value) {
        var regex = new RegExp("{" + key + "}", "g");
        return text.replace(regex, value);
    }
};
"use strict";

CR.Services.Validator = P(function (c) {
    c.checkEmpty = "empty";
    c.checkEmail = "email";
    c.checkUsername = "username";
    c.checkDateInFuture = "in-future";
    c.checkMinLength = "min-length";
    c.checkMaxLength = "max-length";
    c.checkInteger = "integer";
    c.checkDecimal = "decimal";
    c.checkUrl = "url";

    c.errorMessageHeight = "21px";
    c.errorMessageHeightMediumScreen = "27px";
    c.errorMessageHeightLargeScreen = "34px";

    c.errorMessageAnimationDuration = 0.5;

    c.init = function (fieldIds) {
        this.fieldIds = fieldIds || [];

        for (var i = 0; i < this.fieldIds.length; i++) {
            var $field = $("#" + this.fieldIds[i]);

            this._addBlurEvent($field);
            this._addValueChangedEvent($field);
        }
    };

    c.isValid = function () {
        var result = true;
        var isFocusOnFirstInvalidFieldDone = false;
        var $field = undefined;

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
    };

    c.flagValid = function ($field) {
        this._getWrapperForHasErrorClass($field).removeClass("has-error");
    };

    c.flagInvalid = function ($field) {
        this._getWrapperForHasErrorClass($field).addClass("has-error");
    };

    c.isFlaggedInvalid = function ($field) {
        return $field.parent().hasClass("has-error");
    };

    c.showErrorMessage = function ($errorMsg) {
        if ($errorMsg.html()) {
            var height = this.errorMessageHeight;
            if (CR.Services.Browser.isMediumScreen()) {
                height = this.errorMessageHeightMediumScreen;
            } else if (CR.Services.Browser.isLargeScreen()) {
                height = this.errorMessageHeightLargeScreen;
            }

            TweenLite.to($errorMsg, this.errorMessageAnimationDuration, { height: height });
        }
    };

    c.hideErrorMessage = function ($errorMsg) {
        if ($errorMsg.html()) {
            TweenLite.to($errorMsg, this.errorMessageAnimationDuration, { height: 0 });
        }
    };

    c._validateField = function ($field, isOnBlur) {
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
            } else if (!$field.val().trim()) {
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
    };

    c._getWrapperForHasErrorClass = function ($field) {
        return this._isFieldTypeCheckbox($field) ? $field.parents(".checkbox").parent() : $field.parents(".form-group");
    };

    c._get$empty = function ($field) {
        return this._get$error($field, this.checkEmpty);
    };

    c._get$email = function ($field) {
        return this._get$error($field, this.checkEmail);
    };

    c._get$username = function ($field) {
        return this._get$error($field, this.checkUsername);
    };

    c._get$inFuture = function ($field) {
        return this._get$error($field, this.checkDateInFuture);
    };

    c._get$minLength = function ($field) {
        return this._get$error($field, this.checkMinLength);
    };

    c._get$maxLength = function ($field) {
        return this._get$error($field, this.checkMaxLength);
    };

    c._get$integer = function ($field) {
        return this._get$error($field, this.checkInteger);
    };

    c._get$decimal = function ($field) {
        return this._get$error($field, this.checkDecimal);
    };

    c._get$url = function ($field) {
        return this._get$error($field, this.checkUrl);
    };

    c._get$error = function ($field, checkType) {
        if (this._isFieldTypeCheckbox($field)) {
            return $field.parent().siblings("p[data-check=" + checkType + "]");
        }

        return $field.parents(".form-group").children("p[data-check=" + checkType + "]");
    };

    c._isToCheckIfEmpty = function ($field) {
        return this._get$empty($field).length === 1;
    };

    c._isToCheckIfEmail = function ($field) {
        return this._get$email($field).length === 1;
    };

    c._isToCheckIfUsername = function ($field) {
        return this._get$username($field).length === 1;
    };

    c._isToCheckIfInFuture = function ($field) {
        return this._get$inFuture($field).length === 1;
    };

    c._isToCheckIfMinLength = function ($field) {
        return this._get$minLength($field).length === 1;
    };

    c._isToCheckIfMaxLength = function ($field) {
        return this._get$maxLength($field).length === 1;
    };

    c._isToCheckIfInteger = function ($field) {
        return this._get$integer($field).length === 1;
    };

    c._isToCheckIfDecimal = function ($field) {
        return this._get$decimal($field).length === 1;
    };

    c._isToCheckIfUrl = function ($field) {
        return this._get$url($field).length === 1;
    };

    c._isEmail = function (email) {
        if (email === "") {
            return true;
        }

        var reg = /^([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,4})$/i;
        return reg.test(email);
    };

    c._isUsername = function (username) {
        var reg = /^([a-z0-9_\-])+$/i;
        return reg.test(username);
    };

    c._isInFuture = function (dateStr) {
        var yearMonthDay = dateStr.split("-");
        var year = parseInt(yearMonthDay[0], 10);
        var month = parseInt(yearMonthDay[1], 10);
        var day = parseInt(yearMonthDay[2], 10);

        var date = new Date(year, month - 1, day);
        var now = new Date();

        var oneDayInMillis = 1000 * 60 * 60 * 24;
        var nbDaysDifference = Math.ceil((date - now) / oneDayInMillis);

        return nbDaysDifference > 0;
    };

    c._isMinLength = function (value, minLength) {
        if (value === null || value === undefined || value === "") {
            return true;
        }

        return value.length >= minLength;
    };

    c._isMaxLength = function (value, maxLength) {
        if (value === null || value === undefined || value === "") {
            return true;
        }

        return value.length <= maxLength;
    };

    c._isInteger = function (value) {
        var reg = /^\d*$/;
        return reg.test(value);
    };

    c._isDecimal = function (value) {
        var reg = /^\d*\.?\d*$/;
        return reg.test(value);
    };

    c._isUrl = function (url) {
        if (url === "") {
            return true;
        }

        var reg = /^(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?$/i;
        return reg.test(url);
    };

    c._isFieldTypeCheckbox = function ($field) {
        return $field.attr("type") === "checkbox";
    };

    c._isFieldTypeFile = function ($field) {
        return $field.attr("type") === "file";
    };

    c._addBlurEvent = function ($field) {
        $field.blur((function () {
            this._validateField($field, true);
        }).bind(this));
    };

    c._addValueChangedEvent = function ($field) {
        $field.change((function () {
            this._validateField($field);
        }).bind(this));
    };
});