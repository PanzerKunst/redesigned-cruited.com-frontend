"use strict";

CR.Controllers.NewPassword = P(function(c) {
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
                        <h1>{CR.i18nMessages["resetPassword.title"]}</h1>
                    </div>
                    <div className="with-circles">
                        <form onSubmit={this._handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="password">{CR.i18nMessages["resetPassword.new.form.password.label"]}</label>
                                <input type="password" className="form-control" id="password" placeholder={CR.i18nMessages["resetPassword.new.form.password.placeholder"]} data-min-length="5" />
                                <p className="field-error" data-check="empty" />
                                <p className="field-error" data-check="min-length">{CR.i18nMessages["resetPassword.new.validation.passwordTooShort"]}</p>
                            </div>
                            <div className="alert alert-success alert-dismissible" role="alert">
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <p dangerouslySetInnerHTML={{__html: CR.i18nMessages["resetPassword.new.saveSuccessful.text"]}} />
                            </div>
                            <div className="centered-contents">
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["resetPassword.new.form.submitBtn.text"]}</button>
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
            this.$form = $("#content").find("form");

            this.$passwordField = this.$form.find("#password");

            this.$submitBtn = this.$form.find("[type=submit]");
            this.$successAlert = this.$form.children(".alert");
        },

        _initValidation: function() {
            this.validator = CR.Services.Validator([
                "password"
            ]);
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            this.$successAlert.hide();

            if (this.validator.isValid()) {
                this.$submitBtn.enableLoading();

                let type = "PUT";
                let url = "/api/accounts/password";

                let httpRequest = new XMLHttpRequest();
                httpRequest.onreadystatechange = function() {
                    if (httpRequest.readyState === XMLHttpRequest.DONE) {
                        this.$submitBtn.disableLoading();

                        if (httpRequest.status === CR.httpStatusCodes.ok) {
                            this.$successAlert.show();
                        } else {
                            alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                        }
                    }
                }.bind(this);
                httpRequest.open(type, url);
                httpRequest.setRequestHeader("Content-Type", "application/json");
                httpRequest.send(JSON.stringify({
                    emailAddress: this.state.account.emailAddress,
                    firstName: this.state.account.firstName,
                    password: this.$passwordField.val(),
                    linkedinProfile: null
                }));
            }
        }
    });

    c.init = function(i18nMessages, account) {
        CR.i18nMessages = i18nMessages;
        this.account = account;

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
