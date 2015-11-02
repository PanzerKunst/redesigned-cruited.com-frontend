"use strict";

CR.Controllers.OrderStepAccountCreation = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                linkedinAuthCodeRequestUrl: null,
                linkedinProfile: null,
                linkedinErrorMessage: null,
                isRegisterWithLinkedinDefault: false
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
                        <form onSubmit={this._handleSubmit}>
                            <section id="register-with-linkedin-section">
                                <a onClick={this._toggleSectionsRegisterWith}>{CR.i18nMessages["order.accountCreation.registerWithLinkedin.switchLink.text"]}</a>
                                {this._getRegisterWithLinkedinFormSection()}
                            </section>
                            <section id="register-with-email-section">
                                <a onClick={this._toggleSectionsRegisterWith}>{CR.i18nMessages["order.accountCreation.registerWithEmail.switchLink.text"]}</a>
                                {this._getRegisterWithEmailFormSection()}
                            </section>
                            <div className="centered-contents">
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.accountCreation.nextStepBtn.text"]}</button>
                            </div>
                        </form>
                    </div>
                </div>
                );
        },

        componentDidUpdate: function() {
            this._initElements();
            this._initValidation();
            this._showRelevantElements();
        },

        _getRegisterWithLinkedinFormSection: function() {

            // TODO: remove
            console.log("_getRegisterWithLinkedinFormSection");

            if (!this.state.linkedinAuthCodeRequestUrl) {
                return null;
            }

            if (this.state.linkedinErrorMessage) {
                return (<p style="color: red">{this.state.linkedinErrorMessage}</p>);   // TODO
            }

            if (this.state.linkedinProfile) {
                return (
                    <div>
                        <article className="linkedin-profile-sneak-peek">
                            <img src={this.state.linkedinProfile.pictureUrl} />
                            <span>{this.state.linkedinProfile.firstName} {this.state.linkedinProfile.lastName}</span>
                        </article>
                        <div className="form-group">
                            <label htmlFor="email-from-linkedin">{CR.i18nMessages["order.accountCreation.registerWithLinkedin.email.label"]}</label>
                            <input type="text" className="form-control" id="email-from-linkedin" defaultValue={this.state.linkedinProfile.emailAddress} />
                            <p className="field-error" data-check="empty" />
                            <p className="field-error" data-check="email">{CR.i18nMessages["order.accountCreation.registerWithLinkedin.validation.incorrectEmail"]}</p>
                        </div>
                    </div>
                    );
            }

            return (
                <div>
                    <a className="btn sign-in-with-linkedin" href={this.state.linkedinAuthCodeRequestUrl}>
                        <span>{CR.i18nMessages["order.accountCreation.registerWithLinkedin.btn.text"]}</span>
                    </a>
                    <p className="field-error" id="not-signed-in-with-linkedin">{CR.i18nMessages["order.accountCreation.registerWithLinkedin.validation.notSignedIn"]}</p>
                </div>
                );
        },

        _getRegisterWithEmailFormSection: function() {
            return (
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
                        <input type="password" className="form-control" id="password" placeholder={CR.i18nMessages["order.accountCreation.registerWithEmail.password.field.placeholder"]} data-min-length="8" />
                        <p className="field-error" data-check="empty" />
                        <p className="field-error" data-check="min-length">{CR.i18nMessages["order.accountCreation.registerWithEmail.validation.passwordTooShort"]}</p>
                    </div>
                </div>
                );
        },

        _initElements: function() {
            this.$contentWrapper = $("#content");

            this.$form = this.$contentWrapper.find("form");
            this.$registerWithLinkedinSection = this.$form.children("#register-with-linkedin-section");
            this.$registerWithLinkedinBtn = this.$registerWithLinkedinSection.find(".sign-in-with-linkedin");
            this.$notSignedInWithLinkedinErrorMsg = this.$registerWithLinkedinSection.find("#not-signed-in-with-linkedin");

            this.$registerWithEmailSection = this.$form.children("#register-with-email-section");
        },

        _initValidation: function() {
            this.registerWithLinkedinValidator = CR.Services.Validator([
                "email-from-linkedin"
            ]);
            this.registerWithEmailValidator = CR.Services.Validator([
                "first-name",
                "email-address",
                "password"
            ]);
        },

        _showRelevantElements: function() {
            if (this.$registerWithLinkedinBtn.length || this.state.isRegisterWithLinkedinDefault) {
                this.$registerWithLinkedinSection.show();
                this.$registerWithEmailSection.hide();
            } else {
                this.$registerWithLinkedinSection.hide();
                this.$registerWithEmailSection.show();
            }
        },

        _toggleSectionsRegisterWith: function() {
            if (this.$registerWithLinkedinSection.is(":visible")) {
                var $registerWithEmailSection = this.$registerWithEmailSection;

                this.$registerWithLinkedinSection.fadeOut({
                    animationDuration: 0.2,
                    onComplete: function() {
                        $registerWithEmailSection.fadeIn({
                            animationDuration: 0.2
                        });
                    }
                });
            } else {
                var $registerWithLinkedinSection = this.$registerWithLinkedinSection;

                this.$registerWithEmailSection.fadeOut({
                    animationDuration: 0.2,
                    onComplete: function() {
                        $registerWithLinkedinSection.fadeIn({
                            animationDuration: 0.2
                        });
                    }
                });
            }
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            if (this.$registerWithLinkedinSection.is(":visible")) {
                this.registerWithLinkedinValidator.hideErrorMessage(this.$notSignedInWithLinkedinErrorMsg);

                if (this._isSignInWithLinkedinBtnValid()) {
                    if (this.registerWithLinkedinValidator.isValid()) {
                        this._submitAccountCreation();
                    }
                } else {
                    this.registerWithEmailValidator.showErrorMessage(this.$notSignedInWithLinkedinErrorMsg);
                }
            } else {
                if (this.registerWithEmailValidator.isValid()) {
                    this._submitAccountCreation();
                }
            }
        },

        _submitAccountCreation: function() {

        },

        _isSignInWithLinkedinBtnValid: function() {
            return this.$registerWithLinkedinBtn.length === 0;
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
            isRegisterWithLinkedinDefault: this.linkedinProfile !== undefined
        });
    };
});
