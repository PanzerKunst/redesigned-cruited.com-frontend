"use strict";

CR.Controllers.ResetPassword = P(function(c) {
    c.reactClass = React.createClass({
        render: function() {
            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["resetPassword.title"]}</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        <form onSubmit={this._handleSubmit} className="single-column-panel">
                            <div className="form-group">
                                <label htmlFor="email-address">{CR.i18nMessages["resetPassword.form.emailAddress.label"]}</label>
                                <input type="text" className="form-control" id="email-address" placeholder={CR.i18nMessages["resetPassword.form.emailAddress.placeholder"]} />
                                <p className="field-error" data-check="empty" />
                                <p className="field-error" data-check="email">{CR.i18nMessages["resetPassword.validation.incorrectEmail"]}</p>
                            </div>
                            <div className="alert alert-success alert-dismissible" role="alert">
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                {CR.i18nMessages["resetPassword.emailSent.text"]}
                            </div>
                            <div className="centered-contents">
                                <p className="other-form-error">{CR.i18nMessages["resetPassword.validation.noAccountFoundForThisEmailAddress"]}</p>
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["resetPassword.form.submitBtn.text"]}</button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        },

        componentDidMount: function() {
            this._initElements();
            this._initValidation();
        },

        _initElements: function() {
            this.$form = $("#content").find("form");

            this.$emailAddressField = this.$form.find("#email-address");

            this.$noAccountFoundForThisEmailAddressError = this.$form.find(".other-form-error");
            this.$submitBtn = this.$form.find("[type=submit]");
            this.$successAlert = this.$form.children(".alert");
        },

        _initValidation: function() {
            this.validator = CR.Services.Validator([
                "email-address"
            ]);
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            this.validator.hideErrorMessage(this.$noAccountFoundForThisEmailAddressError);

            if (this.validator.isValid()) {
                this.$submitBtn.enableLoading();

                const type = "POST";
                const url = "/api/auth/reset-password";

                const httpRequest = new XMLHttpRequest();
                httpRequest.onreadystatechange = function() {
                    if (httpRequest.readyState === XMLHttpRequest.DONE) {
                        this.$submitBtn.disableLoading();

                        if (httpRequest.status === CR.httpStatusCodes.ok) {
                            this.$successAlert.show();
                        } else if (httpRequest.status === CR.httpStatusCodes.noContent) {
                            this.validator.showErrorMessage(this.$noAccountFoundForThisEmailAddressError);
                        } else {
                            alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                        }
                    }
                }.bind(this);
                httpRequest.open(type, url);
                httpRequest.send(this.$emailAddressField.val());
            }
        }
    });

    c.init = function(i18nMessages) {
        CR.i18nMessages = i18nMessages;

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );
    };
});
