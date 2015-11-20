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
                React.createElement(
                    "form",
                    null,
                    React.createElement(
                        "div",
                        { className: "form-group fg-file-upload", id: "cv-form-group" },
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
                                { className: "btn btn-default btn-file-upload", htmlFor: "cv" },
                                React.createElement("input", { id: "cv", type: "file", accept: ".doc, .docx, .pdf, .odt, .rtf", onChange: this._handleCvFileSelected }),
                                "Browse"
                            ),
                            React.createElement("input", { type: "text", className: "form-control", disabled: true })
                        ),
                        React.createElement("p", { className: "field-error", "data-check": "empty" })
                    ),
                    React.createElement(
                        "div",
                        { className: "form-group fg-file-upload", id: "cover-letter-form-group" },
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
                                { className: "btn btn-default btn-file-upload", htmlFor: "cover-letter" },
                                React.createElement("input", { id: "cover-letter", type: "file", accept: ".doc, .docx, .pdf, .odt, .rtf", onChange: this._handleCoverLetterFileSelected }),
                                "Browse"
                            ),
                            React.createElement("input", { type: "text", className: "form-control", disabled: true })
                        ),
                        React.createElement("p", { className: "field-error", "data-check": "empty" })
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
                )
            )
        );
    },

    componentDidMount: function componentDidMount() {
        this._initElements();
    },

    _initElements: function _initElements() {
        this.$form = $("#content").find("form");

        this.$cvFormGroup = this.$form.children("#cv-form-group");
        this.$cvFileInput = this.$cvFormGroup.find("#cv");
        this.$cvFileNameInput = this.$cvFormGroup.find("input[type=text]");

        this.$coverLetterFormGroup = this.$form.children("#cover-letter-form-group");
        this.$coverLetterFileInput = this.$coverLetterFormGroup.find("#cover-letter");
        this.$coverLetterFileNameInput = this.$coverLetterFormGroup.find("input[type=text]");
    },

    _handleCvFileSelected: function _handleCvFileSelected() {
        this.cvFile = this.$cvFileInput[0].files[0];
        this.$cvFileNameInput.val(this.cvFile.name);
    },

    _handleCoverLetterFileSelected: function _handleCoverLetterFileSelected() {
        this.coverLetterFile = this.$coverLetterFileInput[0].files[0];
        this.$coverLetterFileNameInput.val(this.coverLetterFile.name);
    },

    _addDocs: function _addDocs() {
        this._submit("POST", CR.httpStatusCodes.created);
    },

    _editDocs: function _editDocs() {
        this._submit("PUT", CR.httpStatusCodes.ok);
    },

    _submit: function _submit(method, expectedHttpStatusCode) {
        var formData = new FormData();
        formData.append("orderId", 1698);
        if (this.cvFile) {
            formData.append("cvFile", this.cvFile, this.cvFile.name);
        }
        if (this.coverLetterFile) {
            formData.append("coverLetterFile", this.coverLetterFile, this.coverLetterFile.name);
        }

        var type = method;
        var url = "http://localhost:9001/docs";

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
    }
});
"use strict";

CR.Services.String = {
    template: function template(text, key, value) {
        var regex = new RegExp("{" + key + "}", "g");
        return text.replace(regex, value);
    }
};