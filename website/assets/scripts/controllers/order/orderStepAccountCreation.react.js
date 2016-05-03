"use strict";

CR.Controllers.OrderStepAccountCreation = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                linkedinAuthCodeRequestUrl: null,
                linkedinProfile: null,
                linkedinErrorMessage: null,
                language: null,
                isRegisterWithLinkedinDefault: false
            };
        },

        render: function() {
            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["order.accountCreation.title"]}</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.accountCreation.subtitle"]}</span>

                        <CR.Controllers.OrderStepBreadcrumbs step={CR.Controllers.OrderCommon.steps.accountCreation} />

                        <form onSubmit={this._handleSubmit} className="single-column-panel">
                            <section id="register-with-linkedin-section">
                                {this._getRegisterWithLinkedinFormSection()}
                                <div className="centered-contents">
                                    <p className="switch-registration-method">{CR.i18nMessages["order.accountCreation.registerWithLinkedin.switch.question"]}
                                        <a onClick={this._toggleSectionsRegisterWith}>{CR.i18nMessages["order.accountCreation.registerWithLinkedin.switch.link.text"]}</a>
                                    &#63;</p>
                                </div>
                            </section>
                            <section id="register-with-email-section">
                                {this._getRegisterWithEmailFormSection()}
                                <div className="centered-contents">
                                    <p className="switch-registration-method">{CR.i18nMessages["order.accountCreation.registerWithEmail.switch.question"]}
                                        <a onClick={this._toggleSectionsRegisterWith}>{CR.i18nMessages["order.accountCreation.registerWithEmail.switch.link.text"]}</a>
                                    &#63;</p>
                                </div>
                            </section>
                            <div className="centered-contents">
                                <p className="other-form-error" id="email-already-registered" dangerouslySetInnerHTML={{__html: CR.i18nMessages["order.accountCreation.validation.emailAlreadyRegistered"]}}></p>
                                <p className="other-form-error" id="linkedin-account-already-registered" dangerouslySetInnerHTML={{__html: CR.i18nMessages["order.accountCreation.validation.linkedinAccountIdAlreadyRegistered"]}}></p>
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.accountCreation.submitBtn.text"]}</button>
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
            this._fillEmailFormFields();
        },

        _getRegisterWithLinkedinFormSection: function() {
            if (!this.state.linkedinAuthCodeRequestUrl) {
                return null;
            }

            if (this.state.linkedinProfile) {
                return (
                    <div>
                        <label>{CR.i18nMessages["order.accountCreation.registerWithLinkedin.profile.label"]}</label>
                        <article id="linkedin-preview">
                            <div className="profile-picture" style={{backgroundImage: "url(" + this.state.linkedinProfile.pictureUrl + ")"}} />
                            <span>{this.state.linkedinProfile.firstName} {this.state.linkedinProfile.lastName}</span>
                        </article>
                        <div className="form-group">
                            <label htmlFor="email-from-linkedin" className="for-required-field">{CR.i18nMessages["order.accountCreation.registerWithLinkedin.email.label"]}</label>
                            <input type="text" className="form-control" id="email-from-linkedin" defaultValue={this.state.linkedinProfile.emailAddress} onChange={this._updateSubmitBtnText} />
                            <p className="field-error" data-check="empty" />
                            <p className="field-error" data-check="email">{CR.i18nMessages["order.accountCreation.registerWithLinkedin.validation.incorrectEmail"]}</p>
                        </div>
                    </div>
                );
            }

            const signInFailedParagraph = this.state.linkedinErrorMessage ? <p className="other-form-error shown-by-default">{this.state.linkedinErrorMessage}</p> : null;

            return (
                <div className="centered-contents">
                    <a className="btn sign-in-with-linkedin" href={this.state.linkedinAuthCodeRequestUrl}>
                        <span>{CR.i18nMessages["order.accountCreation.registerWithLinkedin.btn.text"]}</span>
                    </a>
                    {signInFailedParagraph}
                </div>
            );
        },

        _getRegisterWithEmailFormSection: function() {
            return (
                <div>
                    <div className="form-group">
                        <label htmlFor="first-name" className="for-required-field">{CR.i18nMessages["order.accountCreation.registerWithEmail.firstName.label"]}</label>
                        <input type="text" className="form-control" id="first-name" placeholder={CR.i18nMessages["order.accountCreation.registerWithEmail.firstName.placeholder"]} />
                        <p className="field-error" data-check="empty" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email-address" className="for-required-field">{CR.i18nMessages["order.accountCreation.registerWithEmail.emailAddress.label"]}</label>
                        <input type="text" className="form-control" id="email-address" placeholder={CR.i18nMessages["order.accountCreation.registerWithEmail.emailAddress.placeholder"]} onChange={this._updateSubmitBtnText} />
                        <p className="field-error" data-check="empty" />
                        <p className="field-error" data-check="email">{CR.i18nMessages["order.accountCreation.registerWithEmail.validation.incorrectEmail"]}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="for-required-field">{CR.i18nMessages["order.accountCreation.registerWithEmail.password.label"]}</label>
                        <input type="password" className="form-control" id="password" placeholder={CR.i18nMessages["order.accountCreation.registerWithEmail.password.placeholder"]} data-min-length="5" />
                        <p className="field-error" data-check="empty" />
                        <p className="field-error" data-check="min-length">{CR.i18nMessages["order.accountCreation.registerWithEmail.validation.passwordTooShort"]}</p>
                    </div>
                </div>
            );
        },

        _initElements: function() {
            this.$form = $("#content").find("form");
            this.$registerWithLinkedinSection = this.$form.children("#register-with-linkedin-section");
            this.$registerWithLinkedinBtn = this.$registerWithLinkedinSection.find(".sign-in-with-linkedin");
            this.$linkedinEmailField = this.$registerWithLinkedinSection.find("#email-from-linkedin");

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
            if (this._isRegisterWithLinkedinSectionVisible() || this.state.isRegisterWithLinkedinDefault) {
                this.$registerWithLinkedinSection.show();
                this.$registerWithEmailSection.hide();

                if (this._isSignInWithLinkedinBtnThere()) {
                    this.$submitBtn.hide();
                }
            } else {
                this.$registerWithLinkedinSection.hide();
                this.$registerWithEmailSection.show();
            }
        },

        _toggleSectionsRegisterWith: function() {
            this._hideOtherFormErrors();

            const animationDuration = 0.2;

            if (this._isRegisterWithLinkedinSectionVisible()) {
                this.$registerWithLinkedinSection.fadeOut({
                    animationDuration: animationDuration,
                    onComplete: function() {
                        this.$submitBtn.show();

                        this._updateSubmitBtnText();

                        this.$registerWithEmailSection.fadeIn({
                            animationDuration: animationDuration
                        });
                    }.bind(this)
                });
            } else {
                this.$registerWithEmailSection.fadeOut({
                    animationDuration: animationDuration,
                    onComplete: function() {
                        if (this._isSignInWithLinkedinBtnThere()) {
                            this.$submitBtn.hide();
                        }

                        this._updateSubmitBtnText();

                        this.$registerWithLinkedinSection.fadeIn({
                            animationDuration: animationDuration
                        });
                    }.bind(this)
                });
            }
        },

        _updateSubmitBtnText: function() {
            if (this._isRegisterWithLinkedinSectionVisible()) {
                this._setSubmitBtnText(this.$linkedinEmailField.val());
            } else {
                this._setSubmitBtnText(this.$emailAddressField.val());
            }
        },

        _setSubmitBtnText: function(emailAddress) {
            if (emailAddress) {
                this.$submitBtn.html(CR.i18nMessages["order.accountCreation.submitBtn.withEmailPrefix"] + "<br/>" + emailAddress);
            } else {
                this.$submitBtn.html(CR.i18nMessages["order.accountCreation.submitBtn.text"]);
            }
        },

        // Doing so in `_getRegisterWithEmailFormSection()`, via `defaultValue` doesn't work, and I don't understand why
        _fillEmailFormFields: function() {
            const linkedinProfile = this.state.linkedinProfile;

            if (linkedinProfile) {
                this.$firstNameField.val(linkedinProfile.firstName);
                this.$emailAddressField.val(linkedinProfile.emailAddress);
            }
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            this._hideOtherFormErrors();

            if (this._isRegisterWithLinkedinSectionVisible()) {
                if (this.registerWithLinkedinValidator.isValid() && !this.state.linkedinErrorMessage) {
                    this._submitAccountCreation();
                }
            } else {
                if (this.registerWithEmailValidator.isValid()) {
                    this._submitAccountCreation();
                }
            }
        },

        _submitAccountCreation: function() {
            this.$submitBtn.enableLoading();

            const type = "POST";
            const url = "/api/accounts";

            const httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === CR.httpStatusCodes.created) {
                        location.href = "/order/payment";
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
                languageCode: this.state.language.ietfCode,
                linkedinProfile: this._isRegisterWithLinkedinSectionVisible() ? this.state.linkedinProfile : null
            }));
        },

        _hideOtherFormErrors: function() {
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

    c.init = function(i18nMessages, linkedinAuthCodeRequestUrl, linkedinProfile, linkedinErrorMessage, language) {
        CR.i18nMessages = i18nMessages;
        this.linkedinAuthCodeRequestUrl = linkedinAuthCodeRequestUrl;
        this.linkedinProfile = linkedinProfile;
        this.linkedinErrorMessage = linkedinErrorMessage;
        this.language = language;

        this.reactInstance = ReactDOM.render(
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
            language: this.language,
            isRegisterWithLinkedinDefault: this.linkedinProfile !== null
        });
    };
});
