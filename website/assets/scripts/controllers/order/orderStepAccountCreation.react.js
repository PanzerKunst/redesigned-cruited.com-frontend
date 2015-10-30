"use strict";

CR.Controllers.OrderStep3 = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                linkedinProfile: null
            };
        },

        render: function() {
            return (
                <div id="content">
                    <div id="page-header-bar">
                        <h1>{CR.i18nMessages["orderStep3.title"]}</h1>
                    </div>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["orderStep3.subtitle"]}</span>
                        <form ref="form" onSubmit={this._handleSubmit}>
                            {this._getRegisterWithLinkedinFormGroup()}
                            {this._getRegisterWithEmailFormGroup()}
                            <div className="centered-contents">
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["orderStep3.nextStepBtn.text"]}</button>
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

        _getRegisterWithLinkedinFormGroup: function() {
            return null;
        },

        _getRegisterWithEmailFormGroup: function() {
            return null;
        },

        _initElements: function() {
            this.$form = $(React.findDOMNode(this.refs.form));

            this.$linkedinFormGroup = this.$form.children("#linkedin-form-group");

            this.$emailFormGroup = this.$form.children("#email-form-group");
        },

        _initValidation: function() {
            this.validator = CR.Services.Validator([
            ]);
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            // TODO this.validator.hideErrorMessage(this.$notSignedInWithLinkedinErrorMsg);

            if (this.validator.isValid()/* TODO && this._isSignInWithLinkedinBtnValid() */) {
                var type = "POST";
                var url = "/api/accounts";

                var httpRequest = new XMLHttpRequest();
                httpRequest.onreadystatechange = function() {
                    if (httpRequest.readyState === XMLHttpRequest.DONE) {
                        // TODO this.$submitBtn.disableLoading();

                        if (httpRequest.status === CR.httpStatusCodes.created) {
                            location.href = "/order/3";
                        } else {
                            alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                        }
                    }
                };
                httpRequest.open(type, url);
                httpRequest.send();

            } else if (!this._isSignInWithLinkedinBtnValid()) {
                this.validator.showErrorMessage(this.$notSignedInWithLinkedinErrorMsg);
            }
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
        CR.order = CR.Models.Order(CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.order));

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
            linkedinErrorMessage: this.linkedinErrorMessage
        });
    };
});
