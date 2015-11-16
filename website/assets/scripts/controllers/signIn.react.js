"use strict";

CR.Controllers.SignIn = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                linkedinAuthCodeRequestUrl: null,
                linkedinErrorMessage: null,
                isLinkedinAccountUnregistered: false
            };
        },

        render: function() {
            return (
                <div id="content">
                    <div id="page-header-bar">
                        <h1>{CR.i18nMessages["signIn.title"]}</h1>
                    </div>
                    <div className="with-circles">
                        <form>
                            {this._getSignInWithLinkedinForm()}
                        </form>
                        {this._getSignInWithEmailForm()}
                    </div>
                </div>
                );
        },

        componentDidUpdate: function() {
            this._initElements();
            this._initValidation();
        },

        _getSignInWithLinkedinForm: function() {
            if (!this.state.linkedinAuthCodeRequestUrl) {
                return null;
            }

            if (this.state.linkedinErrorMessage) {
                return (<p className="other-form-error shown-by-default">{this.state.linkedinErrorMessage}</p>);
            }

            if (this.state.isLinkedinAccountUnregistered) {
                return (<p className="other-form-error shown-by-default" dangerouslySetInnerHTML={{__html: CR.i18nMessages["signIn.validation.linkedinAccountUnregistered"]}} />);
            }

            return (
                <a className="btn sign-in-with-linkedin" href={this.state.linkedinAuthCodeRequestUrl}>
                    <span>{CR.i18nMessages["signIn.form.linkedIn.btn.text"]}</span>
                </a>
                );
        },

        _getSignInWithEmailForm: function() {
            return (
                <form onSubmit={this._handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email-address">{CR.i18nMessages["signIn.form.email.emailAddress.label"]}</label>
                        <input type="text" className="form-control" id="email-address" placeholder={CR.i18nMessages["signIn.form.email.emailAddress.field.placeholder"]} />
                        <p className="field-error" data-check="empty" />
                        <p className="field-error" data-check="email">{CR.i18nMessages["signIn.validation.incorrectEmail"]}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">{CR.i18nMessages["signIn.form.email.password.label"]}</label>
                        <input type="password" className="form-control" id="password" />
                        <p className="field-error" data-check="empty" />
                    </div>
                    <div className="centered-contents">
                        <p className="other-form-error" id="invalid-credentials">{CR.i18nMessages["signIn.validation.invalidCredentials"]}</p>
                        <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["signin.form.email.submit.btn.text"]}</button>
                    </div>
                </form>
                );
        },

        _initElements: function() {
            this.$contentWrapper = $("#content");

            this.$form = this.$contentWrapper.find("form");
            this.$emailAddressField = this.$form.find("#email-address");
            this.$passwordField = this.$form.find("#password");
            this.$invalidCredentialsError = this.$form.find("#invalid-credentials");
            this.$submitBtn = this.$form.find("[type=submit]");
        },

        _initValidation: function() {
            this.validator = CR.Services.Validator([
                "email-address",
                "password"
            ]);
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            this.validator.hideErrorMessage(this.$invalidCredentialsError);

            if (this.validator.isValid()) {
                this.$submitBtn.enableLoading();

                let type = "POST";
                let url = "/api/auth";

                let httpRequest = new XMLHttpRequest();
                httpRequest.onreadystatechange = function() {
                    if (httpRequest.readyState === XMLHttpRequest.DONE) {
                        if (httpRequest.status === CR.httpStatusCodes.ok) {
                            location.href = "/";
                        } else {
                            this.$submitBtn.disableLoading();

                            if (httpRequest.status === CR.httpStatusCodes.noContent) {
                                this.validator.showErrorMessage(this.$invalidCredentialsError);
                            } else {
                                alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                            }
                        }
                    }
                }.bind(this);
                httpRequest.open(type, url);
                httpRequest.setRequestHeader("Content-Type", "application/json");
                httpRequest.send(JSON.stringify({
                    emailAddress: this.$emailAddressField.val(),
                    password: this.$passwordField.val()
                }));
            }
        }
    });

    c.init = function(i18nMessages, linkedinAuthCodeRequestUrl, linkedinErrorMessage, isLinkedinAccountUnregistered) {
        CR.i18nMessages = i18nMessages;
        this.linkedinAuthCodeRequestUrl = linkedinAuthCodeRequestUrl;
        this.linkedinErrorMessage = linkedinErrorMessage;
        this.isLinkedinAccountUnregistered = isLinkedinAccountUnregistered;

        this.reactInstance = React.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            linkedinAuthCodeRequestUrl: this.linkedinAuthCodeRequestUrl,
            linkedinErrorMessage: this.linkedinErrorMessage,
            isLinkedinAccountUnregistered: this.isLinkedinAccountUnregistered
        });
    };
});
