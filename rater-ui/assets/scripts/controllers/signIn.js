import {httpStatusCodes} from "../global";
import {enableLoading, disableLoading} from "../services/jqueryAnimator";
import Validator from "../services/validator";

const controller = {
    init() {
        ReactDOM.render(
            React.createElement(this.reactComponent),
            document.querySelector("[role=main]")
        );
    },

    reactComponent: React.createClass({
        render() {
            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>Sign in</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        <div id="sign-in-panel" className="single-column-panel">
                            <form ref="form" onSubmit={this._handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email-address-si">E-mail address</label>
                                    <input type="text" className="form-control" id="email-address-si" placeholder="your@email.com" />
                                    <p className="field-error" data-check="empty" />
                                    <p className="field-error" data-check="email">Can you please double-check that address, it doesn't seem valid</p>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password-si">Password</label>
                                    <input type="password" className="form-control" id="password-si" />
                                    <p className="field-error" data-check="empty" />
                                </div>
                                <div className="centered-contents">
                                    <p className="other-form-error" id="incorrect-credentials">You are dead :'( &nbsp;&nbsp;Play again&#63;</p>
                                    <button type="submit" className="btn btn-lg btn-primary">Sign in</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>);
        },

        componentDidMount() {
            this._initElements();
            this._initValidation();
        },

        _initElements() {
            const $emailForm = $("#content").find("form");

            this.$emailAddressField = $emailForm.find("#email-address-si");
            this.$passwordField = $emailForm.find("#password-si");

            this.$otherFormErrors = $emailForm.find(".other-form-error");
            this.$incorrectCredentialsError = this.$otherFormErrors.filter("#incorrect-credentials");

            this.$submitBtn = $emailForm.find("[type=submit]");
        },

        _initValidation() {
            this.validator = Validator([
                "email-address-si",
                "password-si"
            ]);
        },

        _handleSubmit(e) {
            e.preventDefault();

            this.validator.hideErrorMessage(this.$otherFormErrors);

            if (this.validator.isValid()) {
                enableLoading(this.$submitBtn);

                const type = "POST";
                const url = "/api/auth";
                const httpRequest = new XMLHttpRequest();

                httpRequest.onreadystatechange = () => {
                    if (httpRequest.readyState === XMLHttpRequest.DONE) {
                        if (httpRequest.status === httpStatusCodes.ok) {
                            CR.loggedInAccount = JSON.parse(httpRequest.responseText);
                            location.href = "/";
                        } else {
                            disableLoading(this.$submitBtn);

                            if (httpRequest.status === httpStatusCodes.signInIncorrectCredentials) {
                                this.validator.showErrorMessage(this.$incorrectCredentialsError);
                            } else {
                                alert(`AJAX failure doing a ${type} request to "${url}"`);
                            }
                        }
                    }
                };
                httpRequest.open(type, url);
                httpRequest.setRequestHeader("Content-Type", "application/json");
                httpRequest.send(JSON.stringify({
                    emailAddress: this.$emailAddressField.val(),
                    password: this.$passwordField.val()
                }));
            }
        }
    })
};

controller.init();
