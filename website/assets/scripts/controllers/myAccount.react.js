"use strict";

CR.Controllers.MyAccount = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                account: null
            };
        },

        render: function() {
            if (!this.state.account) {
                return null;
            }

            return (
                <div id="content">
                    <div id="page-header-bar">
                        <h1>{CR.i18nMessages["myAccount.title"]}</h1>
                    </div>
                    <div className="with-circles">
                        <form onSubmit={this._handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email-address">{CR.i18nMessages["myAccount.form.emailAddress.label"]}</label>
                                <input type="text" className="form-control" id="email-address" defaultValue={this.state.account.emailAddress} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="first-name">{CR.i18nMessages["myAccount.form.firstName.label"]}</label>
                                <input type="text" className="form-control" id="email-address" defaultValue={this.state.account.firstName} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">{CR.i18nMessages["myAccount.form.password.label"]}</label>
                                <input type="password" className="form-control" id="password" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm-password">{CR.i18nMessages["myAccount.form.email.confirmPassword.label"]}</label>
                                <input type="password" className="form-control" id="confirm-password" />
                            </div>
                            <div className="centered-contents">
                                <p className="other-form-error" id="password-mismatch">{CR.i18nMessages["myAccount.validation.passwordMismatch"]}</p>
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["myAccount.form.submit.btn.text"]}</button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        },

        componentDidUpdate: function() {
            this._initElements();
            this._initValidation();
        },

        _initElements: function() {
        },

        _initValidation: function() {
            this.validator = CR.Services.Validator([]);
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            // this.validator.hideErrorMessage(this.$invalidCredentialsError);

            if (this.validator.isValid()) {
                /* this.$submitBtn.enableLoading();

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
                 })); */
            }
        }
    });

    c.init = function(i18nMessages, account) {
        CR.i18nMessages = i18nMessages;
        this.account = account;

        // TODO: remove
        console.log("account", account);

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            account: this.account
        });
    };
});
