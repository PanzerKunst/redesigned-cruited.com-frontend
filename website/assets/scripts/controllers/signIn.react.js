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
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["signIn.title"]}</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        <form className="single-column-panel">
                            {this._getSignInWithLinkedinForm()}
                        </form>
                        <div className="section-separator single-column-panel centered-contents">
                            <span>{CR.i18nMessages["signIn.methodSeparatorText"]}</span>
                        </div>
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

            let signInFailedParagraph = null;
            if (this.state.linkedinErrorMessage) {
                signInFailedParagraph = <p className="other-form-error shown-by-default">{this.state.linkedinErrorMessage}</p>;
            } else if (this.state.isLinkedinAccountUnregistered) {
                signInFailedParagraph = <p className="other-form-error shown-by-default" dangerouslySetInnerHTML={{__html: CR.i18nMessages["signIn.validation.linkedinAccountUnregistered"]}} />;
            }

            return (
                <div className="centered-contents">
                    <a className="btn sign-in-with-linkedin" href={this.state.linkedinAuthCodeRequestUrl}>
                        <span>{CR.i18nMessages["signIn.form.linkedIn.btn.text"]}</span>
                    </a>
                    {signInFailedParagraph}
                </div>
            );
        },

        _getSignInWithEmailForm: function() {
            return (
                <form onSubmit={this._handleSubmit} className="single-column-panel">
                    <div className="form-group">
                        <label htmlFor="email-address">{CR.i18nMessages["signIn.form.email.emailAddress.label"]}</label>
                        <input type="text" className="form-control" id="email-address" placeholder={CR.i18nMessages["signIn.form.email.emailAddress.placeholder"]} />
                        <p className="field-error" data-check="empty" />
                        <p className="field-error" data-check="email">{CR.i18nMessages["signIn.validation.incorrectEmail"]}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">{CR.i18nMessages["signIn.form.email.password.label"]}</label>
                        <input type="password" className="form-control" id="password" />
                        <p className="field-error" data-check="empty" />
                    </div>
                    <div>
                        <a href="/reset-password">{CR.i18nMessages["signIn.form.forgottenPasswordLink.text"]}</a>
                    </div>
                    <div className="centered-contents">
                        <p className="other-form-error" id="unregistered-email">{CR.i18nMessages["signIn.validation.emailNotRegistered"]}</p>
                        <p className="other-form-error" id="email-registered-password-null" dangerouslySetInnerHTML={{__html: CR.i18nMessages["signIn.validation.emailRegisteredPasswordNull"]}} />
                        <p className="other-form-error" id="email-registered-password-mismatch-linkedin-not-registered" dangerouslySetInnerHTML={{__html: CR.i18nMessages["signIn.validation.emailRegisteredPasswordMismatchLinkedinNotRegistered"]}} />
                        <p className="other-form-error" id="email-registered-password-mismatch-linkedin-registered" dangerouslySetInnerHTML={{__html: CR.i18nMessages["signIn.validation.emailRegisteredPasswordMismatchLinkedinRegistered"]}} />
                        <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["signin.form.email.submitBtn.text"]}</button>
                    </div>
                </form>
            );
        },

        _initElements: function() {
            this.$form = $("#content").find("form");
            this.$emailAddressField = this.$form.find("#email-address");
            this.$passwordField = this.$form.find("#password");

            this.$otherFormErrors = this.$form.find(".other-form-error");
            this.$unregisteredEmailError = this.$otherFormErrors.filter("#unregistered-email");
            this.$emailRegisteredPasswordNullError = this.$otherFormErrors.filter("#email-registered-password-null");
            this.$emailRegisteredPasswordMismatchLinkedinNotRegisteredError = this.$otherFormErrors.filter("#email-registered-password-mismatch-linkedin-not-registered");
            this.$emailRegisteredPasswordMismatchLinkedinRegisteredError = this.$otherFormErrors.filter("#email-registered-password-mismatch-linkedin-registered");

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

            this.validator.hideErrorMessage(this.$otherFormErrors);

            if (this.validator.isValid()) {
                this.$submitBtn.enableLoading();

                const type = "POST";
                const url = "/api/auth";

                const httpRequest = new XMLHttpRequest();
                httpRequest.onreadystatechange = function() {
                    if (httpRequest.readyState === XMLHttpRequest.DONE) {
                        if (httpRequest.status === CR.httpStatusCodes.ok) {
                            location.href = "/";
                        } else {
                            this.$submitBtn.disableLoading();

                            switch (httpRequest.status) {
                                case CR.httpStatusCodes.noContent:
                                    this.validator.showErrorMessage(this.$unregisteredEmailError);
                                    break;
                                case CR.httpStatusCodes.signInNoPassword:
                                    this.validator.showErrorMessage(this.$emailRegisteredPasswordNullError);
                                    break;
                                case CR.httpStatusCodes.signInPasswordMismatchLinkedinNotRegistered:
                                    this.validator.showErrorMessage(this.$emailRegisteredPasswordMismatchLinkedinNotRegisteredError);
                                    break;
                                case CR.httpStatusCodes.signInPasswordMismatchLinkedinRegistered:
                                    this.validator.showErrorMessage(this.$emailRegisteredPasswordMismatchLinkedinRegisteredError);
                                    break;
                                default:
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

        this.reactInstance = ReactDOM.render(
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
