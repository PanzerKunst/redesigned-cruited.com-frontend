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
                                <p className="other-form-error" id="not-signed-in-with-linkedin">{CR.i18nMessages["order.accountCreation.registerWithLinkedin.validation.notSignedIn"]}</p>
                            </section>
                            <section id="register-with-email-section">
                                <a onClick={this._toggleSectionsRegisterWith}>{CR.i18nMessages["order.accountCreation.registerWithEmail.switchLink.text"]}</a>
                                {this._getRegisterWithEmailFormSection()}
                            </section>
                            <div className="centered-contents">
                                <p className="other-form-error" id="email-already-registered">{CR.i18nMessages["order.accountCreation.validation.emailAlreadyRegistered"]}</p>
                                <p className="other-form-error" id="linkedin-account-already-registered">{CR.i18nMessages["order.accountCreation.validation.linkedinAccountIdAlreadyRegistered"]}</p>
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
            this._updateSubmitBtnText();
        },

        _getRegisterWithLinkedinFormSection: function() {
            if (!this.state.linkedinAuthCodeRequestUrl) {
                return null;
            }

            if (this.state.linkedinErrorMessage) {
                return (<p className="other-form-error shown-by-default">{this.state.linkedinErrorMessage}</p>);
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
                            <input type="text" className="form-control" id="email-from-linkedin" defaultValue={this.state.linkedinProfile.emailAddress} onChange={this._handleLinkedinEmailChanged} />
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
                        <input type="text" className="form-control" id="email-address" placeholder={CR.i18nMessages["order.accountCreation.registerWithEmail.emailAddress.field.placeholder"]} onChange={this._handleEmailAddressChanged} />
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
            this.$linkedinEmailField = this.$registerWithLinkedinSection.find("#email-from-linkedin");
            this.$notSignedInWithLinkedinError = this.$registerWithLinkedinSection.find("#not-signed-in-with-linkedin");

            this.$registerWithEmailSection = this.$form.children("#register-with-email-section");
            this.$firstNameField = this.$registerWithEmailSection.find("#first-name");
            this.$emailAddressField = this.$registerWithEmailSection.find("#email-address");
            this.$passwordField = this.$registerWithEmailSection.find("#password");

            this.$emailAlreadyRegisteredError = this.$form.find("#email-already-registered");
            this.$linkedinAccountAlreadyRegisteredError = this.$form.find("#linkedin-account-already-registered");

            this.$submitBtn = this.$form.find("[type=submit]");
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
            if (this._isSignInWithLinkedinBtnThere() || this.state.isRegisterWithLinkedinDefault) {
                this.$registerWithLinkedinSection.show();
                this.$registerWithEmailSection.hide();
            } else {
                this.$registerWithLinkedinSection.hide();
                this.$registerWithEmailSection.show();
            }
        },

        _toggleSectionsRegisterWith: function() {
            this._hideOtherFormErrors();

            if (this._isRegisterWithLinkedinSectionVisible()) {
                var $registerWithEmailSection = this.$registerWithEmailSection;

                this.$registerWithLinkedinSection.fadeOut({
                    animationDuration: 0.2,
                    onComplete: function() {
                        $registerWithEmailSection.fadeIn({
                            animationDuration: 0.2
                        });

                        this._handleEmailAddressChanged();
                    }.bind(this)
                });
            } else {
                var $registerWithLinkedinSection = this.$registerWithLinkedinSection;

                this.$registerWithEmailSection.fadeOut({
                    animationDuration: 0.2,
                    onComplete: function() {
                        $registerWithLinkedinSection.fadeIn({
                            animationDuration: 0.2
                        });

                        this._handleLinkedinEmailChanged();
                    }.bind(this)
                });
            }
        },

        _handleEmailAddressChanged: function() {
            this._changeSubmitBtnText(this.$emailAddressField.val());
        },

        _handleLinkedinEmailChanged: function() {
            this._changeSubmitBtnText(this.$linkedinEmailField.val());
        },

        _changeSubmitBtnText: function(emailAddress) {
            if (emailAddress) {
                this.$submitBtn.html(CR.i18nMessages["order.accountCreation.nextStepBtn.withEmailPrefix"] + " " + emailAddress);
            } else {
                this.$submitBtn.html(CR.i18nMessages["order.accountCreation.nextStepBtn.text"]);
            }
        },

        _updateSubmitBtnText: function() {
            if (this._isRegisterWithLinkedinSectionVisible()) {
                this._handleLinkedinEmailChanged();
            } else {
                this._handleEmailAddressChanged();
            }
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            this._hideOtherFormErrors();

            if (this._isRegisterWithLinkedinSectionVisible()) {
                if (!this._isSignInWithLinkedinBtnThere()) {
                    if (this.registerWithLinkedinValidator.isValid()) {
                        this._submitAccountCreation();
                    }
                } else {
                    this.registerWithEmailValidator.showErrorMessage(this.$notSignedInWithLinkedinError);
                }
            } else {
                if (this.registerWithEmailValidator.isValid()) {
                    this._submitAccountCreation();
                }
            }
        },

        _submitAccountCreation: function() {
            this.$submitBtn.enableLoading();

            var type = "POST";
            var url = "/api/accounts";

            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === CR.httpStatusCodes.created) {
                        location.href = "/order/pay";
                    } else {
                        this.$submitBtn.disableLoading();

                        if (httpRequest.status === CR.httpStatusCodes.emailAlreadyRegistered) {
                            this.registerWithEmailValidator.showErrorMessage(this.$emailAlreadyRegisteredError);
                        } else if (httpRequest.status === CR.httpStatusCodes.linkedinAccountIdAlreadyRegistered) {
                            this.registerWithLinkedinValidator.showErrorMessage(this.$linkedinAccountAlreadyRegisteredError);
                        } else {
                            alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                        }
                    }
                }
            }.bind(this);
            httpRequest.open(type, url);
            httpRequest.setRequestHeader("Content-Type", "application/json");
            httpRequest.send(JSON.stringify({
                emailAddress: this._isRegisterWithLinkedinSectionVisible() ? this.$linkedinEmailField.val() : this.$emailAddressField.val(),
                firstName: this._isRegisterWithLinkedinSectionVisible() ? this.state.linkedinProfile.firstName : this.$firstNameField.val(),
                password: this._isRegisterWithLinkedinSectionVisible() ? null : this.$passwordField.val(),
                linkedinProfile: this._isRegisterWithLinkedinSectionVisible() ? this.state.linkedinProfile : null
            }));
        },

        _hideOtherFormErrors: function() {
            this.registerWithLinkedinValidator.hideErrorMessage(this.$notSignedInWithLinkedinError);
            this.registerWithLinkedinValidator.hideErrorMessage(this.$linkedinAccountAlreadyRegisteredError);
            this.registerWithEmailValidator.hideErrorMessage(this.$emailAlreadyRegisteredError);
        },

        _isRegisterWithLinkedinSectionVisible: function() {
            return this.$registerWithLinkedinSection.is(":visible");
        },

        _isSignInWithLinkedinBtnThere: function() {
            return this.$registerWithLinkedinBtn.length === 1;
        }
    });

    c.init = function(i18nMessages, linkedinAuthCodeRequestUrl, linkedinProfile, linkedinErrorMessage) {
        CR.i18nMessages = i18nMessages;
        this.linkedinAuthCodeRequestUrl = linkedinAuthCodeRequestUrl;
        this.linkedinProfile = linkedinProfile;

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
