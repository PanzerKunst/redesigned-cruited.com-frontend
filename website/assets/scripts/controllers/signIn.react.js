"use strict";

CR.Controllers.SignIn = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                linkedinAuthCodeRequestUrl: null,
                linkedinErrorMessage: null,
                isLinkedinAccountUnregistered: false
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
                        <CR.Controllers.SignInForm linkedinAuthCodeRequestUrl={this.state.linkedinAuthCodeRequestUrl} linkedinErrorMessage={this.state.linkedinErrorMessage} isLinkedinAccountUnregistered={this.state.isLinkedinAccountUnregistered} />
                    </div>
                </div>
            );
        }
    });

    c.init = function(i18nMessages, linkedinAuthCodeRequestUrl, linkedinErrorMessage, isLinkedinAccountUnregistered) {
        CR.i18nMessages = i18nMessages;
        this.linkedinAuthCodeRequestUrl = linkedinAuthCodeRequestUrl;
        this.linkedinErrorMessage = linkedinErrorMessage;
        this.isLinkedinAccountUnregistered = isLinkedinAccountUnregistered;

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
            isLinkedinAccountUnregistered: this.isLinkedinAccountUnregistered
        });
    };
});
