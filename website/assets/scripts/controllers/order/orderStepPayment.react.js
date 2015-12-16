"use strict";

CR.Controllers.OrderStepPayment = P(function(c) {
    c.reactClass = React.createClass({
        render: function() {
            return (
                <div id="content">
                    <div id="page-header-bar">
                        <h1>{CR.i18nMessages["order.payment.title"]}</h1>
                    </div>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.payment.subtitle"]}</span>

                        <CR.Controllers.OrderStepBreadcrumbs step={CR.Controllers.OrderCommon.steps.payment} />

                        <form onSubmit={this._handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="card-number" className="for-required-field">{CR.i18nMessages["order.payment.form.cardNumber.label"]}</label>
                                <input type="text" className="form-control" id="card-number" placeholder={CR.i18nMessages["order.payment.form.cardNumber.placeholder"]} onBlur={this._handleCardNumberFieldBlur} />
                                <p className="field-error" data-check="empty" />
                                <p className="field-error" id="invalid-card-number">{CR.i18nMessages["order.payment.validation.invalidCardNumber"]}</p>
                            </div>
                            <div id="expires-and-cvc">
                                <div className="form-group">
                                    <label htmlFor="expires-month" className="for-required-field">{CR.i18nMessages["order.payment.form.expires.month.label"]}</label>
                                    <select className="form-control" id="expires-month" defaultValue="" onChange={this._handleExpirationDateChange}>
                                        <option value="" disabled>MM</option>
                                        <option value="01">01</option>
                                        <option value="02">02</option>
                                        <option value="03">03</option>
                                        <option value="04">04</option>
                                        <option value="05">05</option>
                                        <option value="06">06</option>
                                        <option value="07">07</option>
                                        <option value="08">08</option>
                                        <option value="09">09</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                    </select>
                                    <p className="field-error" data-check="empty" />
                                </div>
                                <div className="form-group">
                                    <select className="form-control" id="expires-year" defaultValue="" onChange={this._handleExpirationDateChange}>
                                        <option value="" disabled>YYYY</option>
                                    </select>
                                    <p className="field-error" data-check="empty" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cvc" className="for-required-field">{CR.i18nMessages["order.payment.form.cvc.label"]}</label>
                                    <input type="text" className="form-control" id="cvc" placeholder={CR.i18nMessages["order.payment.form.cvc.placeholder"]} />
                                    <p className="field-error" data-check="empty" />
                                </div>
                            </div>
                            <p className="field-error" id="invalid-expiration-date">{CR.i18nMessages["order.payment.validation.invalidExpirationDate"]}</p>
                            <div className="form-group">
                                <label htmlFor="cardholder-name" className="for-required-field">{CR.i18nMessages["order.payment.form.cardholderName.label"]}</label>
                                <input type="text" className="form-control" id="cardholder-name" />
                                <p className="field-error" data-check="empty" />
                            </div>
                            <div className="alert alert-success alert-dismissible" role="alert">
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <p dangerouslySetInnerHtml={{__html: CR.i18nMessages["order.payment.success.text"]}} />
                            </div>
                            <div className="centered-contents">
                                <p className="other-form-error"></p>
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.payment.submitBtn.text"]}</button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        },

        componentDidMount: function() {
            this._initElements();
            this._initValidation();
            this._populateYearDropdown();
        },

        _initElements: function() {
            this.$form = $("#content").find("form");

            this.$cardNumberField = this.$form.find("#card-number");
            this.$invalidCardNumberError = this.$form.find("#invalid-card-number");

            this.$expiresAndCvcWrapper = this.$form.children("#expires-and-cvc");
            this.$expiresMonthField = this.$expiresAndCvcWrapper.find("#expires-month");
            this.$expiresYearField = this.$expiresAndCvcWrapper.find("#expires-year");
            this.$cvcField = this.$expiresAndCvcWrapper.find("#cvc");
            this.$invalidExpirationDateError = this.$form.find("#invalid-expiration-date");

            this.$cardholderNameField = this.$expiresAndCvcWrapper.find("#cardholder-name");

            this.$successAlert = this.$form.children(".alert");

            this.$submitBtn = this.$form.find("button[type=submit]");
        },

        _initValidation: function() {
            this.validator = CR.Services.Validator([
                "card-number",
                "expires-month",
                "expires-year",
                "cvc",
                "cardholder-name"
            ]);
        },

        _populateYearDropdown: function() {
            let currentYear = parseInt(moment().format("YYYY"), 10);

            for (let i = 0; i < 4; i++) {
                let year = currentYear + i;
                this.$expiresYearField.append("<option value=\"" + year + "\">" + year + "</option>");
            }
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            if (this.validator.isValid()) {
                this.$submitBtn.enableLoading();

                let cardNumber = this.$cardNumberField.val();
                let cardExpiryMonth = this.$expiresMonthField.val();
                let cardExpiryYear = this.$expiresYearField.val();

                if (!paymill.validateCardNumber(cardNumber)) {
                    this.validator.showErrorMessage(this.$invalidCardNumberError);
                    this.$submitBtn.disableLoading();
                } else if (!paymill.validateExpiry(cardExpiryMonth, cardExpiryYear)) {
                    this.validator.showErrorMessage(this.$invalidExpirationDateError);
                    this.$submitBtn.disableLoading();
                } else {
                    paymill.createToken({
                        number: cardNumber,
                        exp_month: cardExpiryMonth,
                        exp_year: cardExpiryYear,
                        cvc: this.$cvcField.val(),
                        cardholder: this.$cardholderNameField.val(),
                        amount: CR.order.getTotalPrice() * 100,
                        currency: "SEK"
                    }, this._handlePaymillResponse);
                }
            }
        },

        _handlePaymillResponse: function(error, result) {
            if (error) {
                console.log("error.apierror: " + error.apierror);
            } else {
                let type = "PUT";
                let url = "/api/orders/pay";

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
                httpRequest.send(result.token);
            }
        },

        _handleCardNumberFieldBlur: function() {
            this.validator.hideErrorMessage(this.$invalidCardNumberError);
        },

        _handleExpirationDateChange: function() {
            this.validator.hideErrorMessage(this.$invalidExpirationDateError);
        }
    });

    c.init = function(i18nMessages, orderId) {
        CR.i18nMessages = i18nMessages;

        let orderFromLocalStorage = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.order);
        CR.order = CR.Models.Order(orderFromLocalStorage);
        CR.order.setId(orderId);
        CR.order.saveInLocalStorage();

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );
    };
});
