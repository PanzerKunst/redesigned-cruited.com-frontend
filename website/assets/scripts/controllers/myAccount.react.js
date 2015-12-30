"use strict";

CR.Controllers.MyAccount = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                account: null,
                isSaveSuccessful: false
            };
        },

        render: function() {
            if (!this.state.account) {
                return null;
            }

            let successAlert = null;
            if (this.state.isSaveSuccessful) {
                successAlert = (
                    <div className="alert alert-success alert-dismissible" role="alert">
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        {CR.i18nMessages["myAccount.saveSuccessful.text"]}
                    </div>
                );
            }

            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["myAccount.title"]}</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        {successAlert}
                        <form onSubmit={this._handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email-address">{CR.i18nMessages["myAccount.form.emailAddress.label"]}</label>
                                <input type="text" className="form-control" id="email-address" defaultValue={this.state.account.emailAddress} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="first-name" className="for-required-field">{CR.i18nMessages["myAccount.form.firstName.label"]}</label>
                                <input type="text" className="form-control" id="first-name" defaultValue={this.state.account.firstName} />
                                <p className="field-error" data-check="empty" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">{CR.i18nMessages["myAccount.form.password.label"]}</label>
                                <input type="password" className="form-control" id="password" placeholder={CR.i18nMessages["myAccount.form.password.placeholder"]} data-min-length="5" />
                                <p className="field-error" data-check="min-length">{CR.i18nMessages["myAccount.validation.passwordTooShort"]}</p>
                            </div>
                            <div className="centered-contents">
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["myAccount.form.submitBtn.text"]}</button>
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
            this.$content = $("#content");
            this.$form = this.$content.find("form");

            this.$emailAddressField = this.$form.find("#email-address");
            this.$firstNameField = this.$form.find("#first-name");
            this.$passwordField = this.$form.find("#password");

            this.$submitBtn = this.$form.find("[type=submit]");
            this.$successAlert = this.$content.children().children(".alert");
        },

        _initValidation: function() {
            this.validator = CR.Services.Validator([
                "first-name",
                "password"
            ]);
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            this.$successAlert.remove();

            if (this.validator.isValid()) {
                this.$submitBtn.enableLoading();

                let type = "PUT";
                let url = "/api/accounts";

                let httpRequest = new XMLHttpRequest();
                httpRequest.onreadystatechange = function() {
                    if (httpRequest.readyState === XMLHttpRequest.DONE) {
                        if (httpRequest.status === CR.httpStatusCodes.ok) {
                            document.location.reload(true);
                        } else {
                            this.$submitBtn.disableLoading();
                            alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                        }
                    }
                }.bind(this);
                httpRequest.open(type, url);
                httpRequest.setRequestHeader("Content-Type", "application/json");
                httpRequest.send(JSON.stringify({
                    emailAddress: this.$emailAddressField.val(),
                    firstName: this.$firstNameField.val(),
                    password: this.$passwordField.val() || null,
                    linkedinProfile: null
                }));
            }
        }
    });

    c.init = function(i18nMessages, account, isSaveSuccessful) {
        CR.i18nMessages = i18nMessages;
        this.account = account;
        this.isSaveSuccessful = isSaveSuccessful;

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            account: this.account,
            isSaveSuccessful: this.isSaveSuccessful
        });
    };
});
