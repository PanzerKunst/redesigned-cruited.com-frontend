"use strict";

CR.Controllers.SignIn = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                linkedinAuthCodeRequestUrl: null,
                linkedinErrorMessage: null,
                isLinkedinAccountUnregistered: false,
                orderId: null
            };
        },

        render: function() {
            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["signIn.title"]}</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        {this._signInToAccessYourReportAlert()}
                        <CR.Controllers.SignInForm linkedinAuthCodeRequestUrl={this.state.linkedinAuthCodeRequestUrl} linkedinErrorMessage={this.state.linkedinErrorMessage} isLinkedinAccountUnregistered={this.state.isLinkedinAccountUnregistered} orderId={this.state.orderId} />
                    </div>
                </div>
            );
        },

        _signInToAccessYourReportAlert: function() {
            if (!this.state.orderId) {
                return null;
            }

            return (
                <div className="alert alert-info alert-dismissible single-column-panel" role="alert">
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <p dangerouslySetInnerHTML={{__html: CR.i18nMessages["signIn.alert.text"]}} />
                </div>);
        }
    });

    c.init = function(i18nMessages, linkedinAuthCodeRequestUrl, linkedinErrorMessage, isLinkedinAccountUnregistered, orderId) {
        CR.i18nMessages = i18nMessages;
        this.linkedinAuthCodeRequestUrl = linkedinAuthCodeRequestUrl;
        this.linkedinErrorMessage = linkedinErrorMessage;
        this.isLinkedinAccountUnregistered = isLinkedinAccountUnregistered;
        this.orderId = orderId;

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            linkedinAuthCodeRequestUrl: this.linkedinAuthCodeRequestUrl,
            linkedinErrorMessage: this.linkedinErrorMessage,
            isLinkedinAccountUnregistered: this.isLinkedinAccountUnregistered,
            orderId: this.orderId
        });
    };
});
