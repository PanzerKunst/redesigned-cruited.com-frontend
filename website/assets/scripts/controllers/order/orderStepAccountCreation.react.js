"use strict";

CR.Controllers.OrderStepAccountCreation = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                linkedinAuthCodeRequestUrl: null,
                linkedinProfile: null,
                linkedinErrorMessage: null,
                isRegisterWithLinkedinCheckboxChecked: false
            };
        },

        render: function() {
            return (
                <div id="content">
                    <div id="page-header-bar">
                        <h1>{CR.i18nMessages["order.accountCreation.title"]}</h1>
                    </div>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.accountCreation.subtitle"]}</span>
                        {this._getRegisterWithLinkedinForm()}
                        {this._getRegisterWithEmailForm()}
                        <div className="centered-contents">
                            <button className="btn btn-lg btn-primary">{CR.i18nMessages["order.accountCreation.nextStepBtn.text"]}</button>
                        </div>
                    </div>
                </div>
                );
        },

        componentDidUpdate: function() {
            this._initElements();
            this._initValidation();
            this._showRelevantElements();
        },

        _getRegisterWithLinkedinForm: function() {
            if (this.state.linkedinErrorMessage) {
                return (<p style="color: red">{this.state.linkedinErrorMessage}</p>);   // TODO
            } else {
                if (!this.state.linkedinAuthCodeRequestUrl) {
                    return null;
                }

                var formContents = null;

                if (this.state.linkedinProfile) {
                    formContents = (
                        <div>
                            <div className="checkbox checkbox-primary">
                                <input type="checkbox" id="register-with-linkedin-checkbox" checked={this.state.isRegisterWithLinkedinCheckboxChecked} onChange={this._handleRegisterCheckboxToggle} />
                                <label htmlFor="register-with-linkedin-checkbox">{CR.i18nMessages["order.accountCreation.registerWithLinkedin.checkbox.label"]}</label>
                            </div>
                            <article>
                                <img src={this.state.linkedinProfile.pictureUrl} />
                                <span>{this.state.linkedinProfile.firstName} {this.state.linkedinProfile.lastName}</span>
                            </article>
                            <div className="form-group">
                                <label htmlFor="email-from-linkedin">{CR.i18nMessages["order.accountCreation.registerWithLinkedin.email.label"]}</label>
                                <input type="text" className="form-control" id="email-from-linkedin" defaultValue={this.state.linkedinProfile.emailAddress} />
                            </div>
                        </div>
                        );
                } else {
                    formContents = (
                        <a className="btn sign-in-with-linkedin" href={this.state.linkedinAuthCodeRequestUrl}>
                            <span>{CR.i18nMessages["order.accountCreation.registerWithLinkedin.btn.text"]}</span>
                        </a>
                        );
                }

                return (
                    <form id="register-with-linkedin-form" onSubmit={this._handleRegisterWithLinkedinSubmit}>
                        {formContents}
                    </form>
                    );
            }
        },

        _getRegisterWithEmailForm: function() {
            var formContents = null;

            if (this.state.isRegisterWithLinkedinCheckboxChecked) {
                formContents = (
                    <div className="checkbox checkbox-primary">
                        <input type="checkbox" id="register-with-email-checkbox" onChange={this._handleRegisterCheckboxToggle} />
                        <label htmlFor="register-with-email-checkbox">{CR.i18nMessages["order.accountCreation.registerWithEmail.checkbox.label"]}</label>
                    </div>
                    );
            } else {
                formContents = (
                    <div>
                        <div className="form-group">
                            <label htmlFor="first-name">{CR.i18nMessages["order.accountCreation.registerWithEmail.firstName.label"]}</label>
                            <input type="text" className="form-control" id="first-name" placeholder={CR.i18nMessages["order.accountCreation.registerWithEmail.firstName.field.placeholder"]} />
                            <p className="field-error" data-check="empty" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email-address">{CR.i18nMessages["order.accountCreation.registerWithEmail.emailAddress.label"]}</label>
                            <input type="text" className="form-control" id="email-address" placeholder={CR.i18nMessages["order.accountCreation.registerWithEmail.emailAddress.field.placeholder"]} />
                            <p className="field-error" data-check="empty" />
                            <p className="field-error" data-check="email">{CR.i18nMessages["order.accountCreation.registerWithEmail.validation.incorrectEmail"]}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">{CR.i18nMessages["order.accountCreation.registerWithEmail.password.label"]}</label>
                            <input type="password" className="form-control" id="password" placeholder={CR.i18nMessages["order.accountCreation.registerWithEmail.password.field.placeholder"]} />
                            <p className="field-error" data-check="empty" />
                            <p className="field-error" data-check="min-length" data-min-length="8">{CR.i18nMessages["order.accountCreation.registerWithEmail.validation.passwordTooShort"]}</p>
                        </div>
                    </div>
                    );
            }

            return (
                <form id="register-with-email-form" onSubmit={this._handleRegisterWithEmailSubmit}>
                    {formContents}
                </form>
                );
        },

        _initElements: function() {
            this.$contentWrapper = $("#content");

            this.$registerWithLinkedinForm = this.$contentWrapper.find("#register-with-linkedin-form");
            this.$registerWithLinkedinCheckbox = this.$registerWithLinkedinForm.find("#register-with-linkedin-checkbox");
            this.$registerWithLinkedinProfile = this.$registerWithLinkedinForm.find("article");
            this.$registerWithLinkedinEmailFormGroup = this.$registerWithLinkedinForm.find(".form-group");

            this.$registerWithEmailForm = this.$contentWrapper.find("#register-with-email-form");
        },

        _initValidation: function() {
            this.registerWithEmailValidator = CR.Services.Validator([
            ]);
        },

        _showRelevantElements: function() {
            if (this.$registerWithLinkedinCheckbox.prop("checked")) {
                this.$registerWithLinkedinProfile.show();
                this.$registerWithLinkedinEmailFormGroup.show();
            } else {
                this.$registerWithLinkedinProfile.hide();
                this.$registerWithLinkedinEmailFormGroup.hide();
            }
        },

        _handleRegisterCheckboxToggle: function() {
            this.setState({
                isRegisterWithLinkedinCheckboxChecked: !this.state.isRegisterWithLinkedinCheckboxChecked
            });
        },

        _handleRegisterWithLinkedinSubmit: function(e) {
            e.preventDefault();

            this.registerWithEmailValidator.hideErrorMessage(this.$notSignedInWithLinkedinErrorMsg);

            if (this.$registerWithLinkedinRadio.prop("checked") && this._isSignInWithLinkedinBtnValid()) {
                this._submitAccountCreation();
            } else if (!this._isSignInWithLinkedinBtnValid()) {
                this.registerWithEmailValidator.showErrorMessage(this.$notSignedInWithLinkedinErrorMsg);
            }
        },

        _handleRegisterWithEmailSubmit: function(e) {
            e.preventDefault();

            if (this.$registerWithEmailRadio.prop("checked") && this.registerWithEmailValidator.isValid()) {
                this._submitAccountCreation();
            }
        },

        _submitAccountCreation: function() {

        },

        _isSignInWithLinkedinBtnValid: function() {
            return this.$signInWithLinkedinBtn.length === 0;
        }
    });

    c.init = function(i18nMessages, linkedinAuthCodeRequestUrl, linkedinProfile, linkedinErrorMessage) {
        CR.i18nMessages = i18nMessages;
        this.linkedinAuthCodeRequestUrl = linkedinAuthCodeRequestUrl;
        this.linkedinProfile = JSON.parse(linkedinProfile);

        this.linkedinErrorMessage = linkedinErrorMessage;

        this.reactInstance = React.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            linkedinAuthCodeRequestUrl: this.linkedinAuthCodeRequestUrl,
            linkedinProfile: this.linkedinProfile,
            linkedinErrorMessage: this.linkedinErrorMessage,
            isRegisterWithLinkedinCheckboxChecked: this.linkedinProfile !== undefined
        });
    };
});
