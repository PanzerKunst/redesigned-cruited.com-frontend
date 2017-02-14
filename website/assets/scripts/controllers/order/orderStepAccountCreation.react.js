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
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["order.accountCreation.title"]}</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.accountCreation.subtitle"]}</span>

                        <CR.Controllers.OrderStepBreadcrumbs step={CR.Controllers.OrderCommon.steps.accountCreation} />

                        <section className="single-column-panel" id="register-section">
                            {this._getRegisterWithLinkedinSection()}
                            <div className="section-separator centered-contents">
                                <span>{CR.i18nMessages["signIn.methodSeparatorText"]}</span>
                            </div>
                            <form onSubmit={this._handleSubmit}>
                                {this._getRegisterWithEmailFormContent()}
                                <div className="centered-contents">
                                    <p>{CR.i18nMessages["order.accountCreation.registerWithEmail.signInInstead.text"]} <a onClick={this._handleSwitchLink}>{CR.i18nMessages["order.accountCreation.registerWithEmail.signInInstead.link.text"]}</a></p>
                                    <p className="other-form-error" id="email-already-registered">{CR.i18nMessages["order.accountCreation.registerWithEmail.validation.alreadyRegistered"]}</p>
                                    <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.accountCreation.registerWithEmail.submitBtn.text"]}</button>
                                </div>
                            </form>
                        </section>
                        <section className="single-column-panel" id="sign-in-section">
                            <CR.Controllers.SignInForm linkedinAuthCodeRequestUrl={this.state.linkedinAuthCodeRequestUrl} linkedinErrorMessage={this.state.linkedinErrorMessage} webServiceUrlParams="?isFromAccountCreation=true" onSuccess={this._handleSignInWithEmailSuccess} />
                            <p className="centered-contents">{CR.i18nMessages["order.accountCreation.signIn.registerInstead.text"]} <a onClick={this._handleSwitchLink}>{CR.i18nMessages["order.accountCreation.signIn.registerInstead.link.text"]}</a></p>
                        </section>
                        <section className="single-column-panel centered-contents" id="you-are-signed-in-section">
                            <p>{CR.i18nMessages["order.accountCreation.signedIn.text"]}</p>
                            <div className="alert alert-info alert-dismissible" role="alert" id="coupon-removed-alert">
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <p>{CR.i18nMessages["order.accountcreation.signedIn.couponRemoved.text"]}</p>
                            </div>
                            <a href="/order/payment" className="btn btn-lg btn-primary">{CR.i18nMessages["order.accountcreation.signedIn.btn.text"]}</a>
                        </section>
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

        _getRegisterWithLinkedinSection: function() {
            if (!this.state.linkedinAuthCodeRequestUrl) {
                return null;
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

        _getRegisterWithEmailFormContent: function() {
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
            const $withCirclesContainer = $("#content").children(".with-circles");

            this.$registerSection = $withCirclesContainer.children("#register-section");
            this.$firstNameField = this.$registerSection.find("#first-name");
            this.$emailAddressField = this.$registerSection.find("#email-address");
            this.$passwordField = this.$registerSection.find("#password");
            this.$registerWithEmailSubmitBtn = this.$registerSection.find("[type=submit]");
            this.$emailAlreadyRegisteredError = this.$registerSection.find("#email-already-registered");

            this.$signInSection = $withCirclesContainer.children("#sign-in-section");
            this.$couponRemovedAlert = $withCirclesContainer.find("#coupon-removed-alert");

            this.$youAreSignedInSection = $withCirclesContainer.children("#you-are-signed-in-section");
        },

        _initValidation: function() {
            this.validator = CR.Services.Validator([
                "first-name",
                "email-address",
                "password"
            ]);
        },

        _showRelevantElements: function() {
            if (CR.loggedInAccount && CR.loggedInAccount.id > 0) {
                this.$youAreSignedInSection.show();
                this._removeCouponIfNeeded();
            } else {
                this.$registerSection.show();
            }
        },

        _updateSubmitBtnText: function() {
            const emailAddress = this.$emailAddressField.val();
            if (emailAddress) {
                this.$registerWithEmailSubmitBtn.html(CR.i18nMessages["order.accountCreation.registerWithEmail.submitBtn.withEmailPrefix"] + "<br/>" + emailAddress);
            } else {
                this.$registerWithEmailSubmitBtn.html(CR.i18nMessages["order.accountCreation.registerWithEmail.submitBtn.text"]);
            }
        },

        _removeCouponIfNeeded: function() {
            const coupon = CR.order.getCoupon();
            if (coupon) {
                const type = "GET";
                const url = "/api/coupons/" + coupon.code;

                const httpRequest = new XMLHttpRequest();
                httpRequest.onreadystatechange = function() {
                    if (httpRequest.readyState === XMLHttpRequest.DONE) {
                        switch (httpRequest.status) {
                            case CR.httpStatusCodes.couponExpired:
                                this.$couponRemovedAlert.fadeIn();

                                CR.order.setCoupon(undefined);
                                CR.order.saveInLocalStorage();
                                this._removeCouponFromOrderOnServerSide();

                                break;
                            case CR.httpStatusCodes.ok:
                                break;
                            default:
                                alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                        }
                    }
                }.bind(this);
                httpRequest.open(type, url);
                httpRequest.send();
            }
        },

        _removeCouponFromOrderOnServerSide: function() {
            const type = "DELETE";
            const url = "/api/orders/coupon";

            const httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status !== CR.httpStatusCodes.ok) {
                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                }
            };
            httpRequest.open(type, url);
            httpRequest.send();
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            this.validator.hideErrorMessage(this.$emailAlreadyRegisteredError);
            this.$registerWithEmailSubmitBtn.enableLoading();

            const type = "POST";
            const url = "/api/accounts";

            const httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === CR.httpStatusCodes.created) {
                        location.href = "/order/payment";
                    } else {
                        this.$registerWithEmailSubmitBtn.disableLoading();

                        if (httpRequest.status === CR.httpStatusCodes.emailAlreadyRegistered) {
                            this.validator.showErrorMessage(this.$emailAlreadyRegisteredError);
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
                firstName: this.$firstNameField.val(),
                password: this.$passwordField.val()
            }));
        },

        _handleSwitchLink: function() {
            const isRegisterSectionVisible = this.$registerSection.is(":visible");

            if (isRegisterSectionVisible) {
                this.$registerSection.fadeOut({
                    animationDuration: CR.animationDurations.short,
                    onComplete: function() {
                        this.$signInSection.fadeIn({
                            animationDuration: CR.animationDurations.short
                        });
                    }.bind(this)
                });
            } else {
                this.$signInSection.fadeOut({
                    animationDuration: CR.animationDurations.short,
                    onComplete: function() {
                        this.$registerSection.fadeIn({
                            animationDuration: CR.animationDurations.short
                        });
                    }.bind(this)
                });
            }
        },

        _handleSignInWithEmailSuccess: function() {
            this.$signInSection.fadeOut({
                animationDuration: CR.animationDurations.short,
                onComplete: function() {
                    this.$youAreSignedInSection.fadeIn({
                        animationDuration: CR.animationDurations.short
                    });
                    this._removeCouponIfNeeded();
                }.bind(this)
            });
        }
    });

    c.init = function(i18nMessages, linkedinAuthCodeRequestUrl, linkedinProfile, linkedinErrorMessage, loggedInAccount) {
        CR.i18nMessages = i18nMessages;
        this.linkedinAuthCodeRequestUrl = linkedinAuthCodeRequestUrl;
        this.linkedinProfile = linkedinProfile;
        this.linkedinErrorMessage = linkedinErrorMessage;
        CR.loggedInAccount = loggedInAccount;

        const orderFromLocalStorage = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.order);
        CR.order = CR.Models.Order(orderFromLocalStorage);

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
            isRegisterWithLinkedinDefault: this.linkedinProfile !== null
        });
    };
});
