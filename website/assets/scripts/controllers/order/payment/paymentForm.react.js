CR.Controllers.PaymentForm = React.createClass({
    render() {
        const cardNumberAndCvcInputType = Modernizr.touchevents ? "number" : "text";

        return (
            <form ref="form" onSubmit={this._handleSubmit}>
                <div className="form-group">
                    <label htmlFor="card-number" className="for-required-field">{CR.i18nMessages["order.payment.form.cardNumber.label"]}</label>
                    <input type={cardNumberAndCvcInputType} className="form-control" id="card-number" placeholder={CR.i18nMessages["order.payment.form.cardNumber.placeholder"]} onBlur={this._handleCardNumberFieldBlur} />
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
                        <label htmlFor="expires-year">&nbsp;</label>
                        <select className="form-control" id="expires-year" defaultValue="" onChange={this._handleExpirationDateChange}>
                            <option value="" disabled>YYYY</option>
                        </select>
                        <p className="field-error" data-check="empty" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cvc" className="for-required-field">{CR.i18nMessages["order.payment.form.cvc.label"]}</label>
                        <input type={cardNumberAndCvcInputType} className="form-control" id="cvc" placeholder={CR.i18nMessages["order.payment.form.cvc.placeholder"]} />
                        <p className="field-error" data-check="empty" />
                    </div>
                </div>
                <p className="field-error" id="invalid-expiration-date">{CR.i18nMessages["order.payment.validation.invalidExpirationDate"]}</p>
                <div className="form-group">
                    <label htmlFor="cardholder-name" className="for-required-field">{CR.i18nMessages["order.payment.form.cardholderName.label"]}</label>
                    <input type="text" className="form-control" id="cardholder-name" />
                    <p className="field-error" data-check="empty" />
                </div>
                <div className="centered-contents">
                    <p className="other-form-error"/>
                    <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.payment.submitBtn.text"]}</button>
                </div>
            </form>
        );
    },

    componentDidMount() {
        this._initElements();
        this._initValidation();
        this._populateYearDropdown();
    },

    _initElements() {
        this.$form = $(ReactDOM.findDOMNode(this.refs.form));

        this.$cardNumberField = this.$form.find("#card-number");
        this.$invalidCardNumberError = this.$form.find("#invalid-card-number");

        this.$expiresAndCvcWrapper = this.$form.children("#expires-and-cvc");
        this.$expiresMonthField = this.$expiresAndCvcWrapper.find("#expires-month");
        this.$expiresYearField = this.$expiresAndCvcWrapper.find("#expires-year");
        this.$cvcField = this.$expiresAndCvcWrapper.find("#cvc");
        this.$invalidExpirationDateError = this.$form.find("#invalid-expiration-date");

        this.$cardholderNameField = this.$expiresAndCvcWrapper.find("#cardholder-name");

        this.$submitBtn = this.$form.find("button[type=submit]");
    },

    _initValidation() {
        this.validator = CR.Services.Validator([
            "card-number",
            "expires-month",
            "expires-year",
            "cvc",
            "cardholder-name"
        ]);
    },

    _populateYearDropdown() {
        const currentYear = parseInt(moment().format("YYYY"), 10);

        for (let i = 0; i < 5; i++) {
            const year = currentYear + i;

            this.$expiresYearField.append("<option value=\"" + year + "\">" + year + "</option>");
        }
    },

    _handleSubmit(e) {
        e.preventDefault();

        if (this.validator.isValid()) {
            this.$submitBtn.enableLoading();

            const cardNumber = this.$cardNumberField.val();
            const cardExpiryMonth = this.$expiresMonthField.val();
            const cardExpiryYear = this.$expiresYearField.val();

            const currencyCodesWhereAmountIsMultipliedBy100 = ["USD", "EUR"];
            const transactionAmount = _.includes(currencyCodesWhereAmountIsMultipliedBy100, this.props.currencyCode) ? this.props.price * 100 : this.props.price;

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
                    amount: transactionAmount,
                    currency: this.props.currencyCode
                }, this._handlePaymillResponse);
            }
        }
    },

    _handlePaymillResponse(error, result) {
        if (error) {
            alert("Paymill error: " + error.apierror);
            this.$submitBtn.disableLoading();
        } else {
            const type = "PUT";
            const url = "/api/orders/pay";
            const httpRequest = new XMLHttpRequest();

            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === CR.httpStatusCodes.ok) {
                        location.href = "/?action=orderCompleted&type=1";
                    } else {
                        this.$submitBtn.disableLoading();

                        if (httpRequest.status === CR.httpStatusCodes.paymillError) {
                            alert("Payment error: " + httpRequest.responseText);
                        } else {
                            alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                        }
                    }
                }
            }.bind(this);
            httpRequest.open(type, url);
            httpRequest.send(result.token);
        }
    },

    _handleCardNumberFieldBlur() {
        this.validator.hideErrorMessage(this.$invalidCardNumberError);
    },

    _handleExpirationDateChange() {
        this.validator.hideErrorMessage(this.$invalidExpirationDateError);
    }
});
