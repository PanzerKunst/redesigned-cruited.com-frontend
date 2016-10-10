"use strict";

CR.Controllers.SignInForm = React.createClass({
    render: function() {
        return (
            <div id="sign-in-panel" className="single-column-panel">
                {this._getSignInWithLinkedinForm()}
                <div className="section-separator centered-contents">
                    <span>{CR.i18nMessages["signIn.methodSeparatorText"]}</span>
                </div>
                {this._getSignInWithEmailForm()}
            </div>
        );
    },

    componentDidMount: function() {
        this._initElements();
        this._initValidation();
    },

    _getSignInWithLinkedinForm: function() {
        if (!this.props.linkedinAuthCodeRequestUrl) {
            return null;
        }

        let signInFailedParagraph = null;
        if (this.props.linkedinErrorMessage) {
            signInFailedParagraph = <p className="other-form-error shown-by-default">{this.props.linkedinErrorMessage}</p>;
        } else if (this.props.isLinkedinAccountUnregistered) {
            signInFailedParagraph = <p className="other-form-error shown-by-default" dangerouslySetInnerHTML={{__html: CR.i18nMessages["signIn.validation.linkedinAccountUnregistered"]}} />;
        }

        return (
            <form className="centered-contents">
                <a className="btn sign-in-with-linkedin" href={this.props.linkedinAuthCodeRequestUrl}>
                    <span>{CR.i18nMessages["signIn.form.linkedIn.btn.text"]}</span>
                </a>
                {signInFailedParagraph}
            </form>
        );
    },

    _getSignInWithEmailForm: function() {
        return (
            <form ref="form" onSubmit={this._handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email-address-si">{CR.i18nMessages["signIn.form.email.emailAddress.label"]}</label>
                    <input type="text" className="form-control" id="email-address-si" placeholder={CR.i18nMessages["signIn.form.email.emailAddress.placeholder"]} />
                    <p className="field-error" data-check="empty" />
                    <p className="field-error" data-check="email">{CR.i18nMessages["signIn.validation.incorrectEmail"]}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="password-si">{CR.i18nMessages["signIn.form.email.password.label"]}</label>
                    <input type="password" className="form-control" id="password-si" />
                    <p className="field-error" data-check="empty" />
                </div>
                <div id="reset-password-panel">
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
        const $emailForm = $(ReactDOM.findDOMNode(this.refs.form));
        this.$emailAddressField = $emailForm.find("#email-address-si");
        this.$passwordField = $emailForm.find("#password-si");

        this.$otherFormErrors = $emailForm.find(".other-form-error");
        this.$unregisteredEmailError = this.$otherFormErrors.filter("#unregistered-email");
        this.$emailRegisteredPasswordNullError = this.$otherFormErrors.filter("#email-registered-password-null");
        this.$emailRegisteredPasswordMismatchLinkedinNotRegisteredError = this.$otherFormErrors.filter("#email-registered-password-mismatch-linkedin-not-registered");
        this.$emailRegisteredPasswordMismatchLinkedinRegisteredError = this.$otherFormErrors.filter("#email-registered-password-mismatch-linkedin-registered");

        this.$submitBtn = $emailForm.find("[type=submit]");
    },

    _initValidation: function() {
        this.validator = CR.Services.Validator([
            "email-address-si",
            "password-si"
        ]);
    },

    _handleSubmit: function(e) {
        e.preventDefault();

        // TODO: remove
        console.log("sign in subbmit");

        this.validator.hideErrorMessage(this.$otherFormErrors);

        if (this.validator.isValid()) {
            this.$submitBtn.enableLoading();

            const type = "POST";
            const url = "/api/auth" + this.props.webServiceUrlParams;

            const httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === CR.httpStatusCodes.ok) {
                        CR.loggedInAccount = JSON.parse(httpRequest.responseText);

                        if (this.props.onSuccess) {
                            this.$submitBtn.disableLoading();
                            this.props.onSuccess();
                        } else {
                            location.href = "/";
                        }
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
