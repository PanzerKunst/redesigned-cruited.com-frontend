"use strict";

CR.Controllers.CouponForm = React.createClass({
    render: function() {
        if (CR.Services.Browser.isSmallScreen()) {
            return (
                <form ref="form" onSubmit={this._handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="coupon-code">{CR.i18nMessages["order.productSelection.cartSection.coupon.label"]}</label>
                        <input type="text" className="form-control" id="coupon-code" placeholder={CR.i18nMessages["order.productSelection.cartSection.coupon.placeholder"]} />
                        <p className="field-error" data-check="empty" />
                        <p className="other-form-error" id="coupon-not-found-error">{CR.i18nMessages["order.productSelection.cartSection.coupon.notFoundError"]}</p>
                        <p className="other-form-error" id="coupon-has-reached-max-uses-error">{CR.i18nMessages["order.productSelection.cartSection.coupon.hasReachedMaxUsesError"]}</p>
                    </div>
                    <button type="submit" className="btn btn-default">{CR.i18nMessages["order.productSelection.cartSection.coupon.addBtn.text"]}</button>
                </form>
            );
        }

        return (
            <form ref="form" onSubmit={this._handleSubmit}>
                <div className="form-group">
                    <label htmlFor="coupon-code">{CR.i18nMessages["order.productSelection.cartSection.coupon.label"]}</label>
                    <div>
                        <input type="text" className="form-control" id="coupon-code" placeholder={CR.i18nMessages["order.productSelection.cartSection.coupon.placeholder"]} />
                        <button type="submit" className="btn btn-default">{CR.i18nMessages["order.productSelection.cartSection.coupon.addBtn.text"]}</button>
                    </div>
                    <p className="field-error" data-check="empty" />
                    <p className="other-form-error" id="coupon-not-found-error">{CR.i18nMessages["order.productSelection.cartSection.coupon.notFoundError"]}</p>
                    <p className="other-form-error" id="coupon-has-reached-max-uses-error">{CR.i18nMessages["order.productSelection.cartSection.coupon.hasReachedMaxUsesError"]}</p>
                </div>
            </form>
        );
    },

    componentDidMount: function() {
        this._initElements();
        this._initValidation();
    },

    _initElements: function() {
        this.$form = $(ReactDOM.findDOMNode(this.refs.form));
        this.$couponCodeField = this.$form.find("#coupon-code");
        this.$addCouponBtn = this.$form.children("button");

        this.$otherFormErrors = this.$form.find(".other-form-error");
        this.$couponNotFoundError = this.$otherFormErrors.filter("#coupon-not-found-error");
        this.$couponHasReachedMaxUsesError = this.$otherFormErrors.filter("#coupon-has-reached-max-uses-error");
    },

    _initValidation: function() {
        this.validator = CR.Services.Validator([
            "coupon-code"
        ]);
    },

    _handleSubmit: function(e) {
        e.preventDefault();

        this.validator.hideErrorMessage(this.$otherFormErrors);

        if (this.validator.isValid()) {
            this.$addCouponBtn.enableLoading(CR.i18nMessages["order.productSelection.cartSection.coupon.addBtn.loadingText"]);

            const type = "GET";
            const url = "/api/coupons/" + this.$couponCodeField.val();

            const httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    this.$addCouponBtn.disableLoading();

                    switch (httpRequest.status) {
                        case CR.httpStatusCodes.noContent:
                            this.validator.showErrorMessage(this.$couponNotFoundError);
                            break;
                        case CR.httpStatusCodes.couponHasReachedMaxUses:
                            this.validator.showErrorMessage(this.$couponHasReachedMaxUsesError);
                            break;
                        case CR.httpStatusCodes.ok:
                            const coupon = JSON.parse(httpRequest.responseText);
                            if (coupon) {
                                this.$form[0].reset();

                                CR.order.setCoupon(coupon);
                                CR.order.saveInLocalStorage();

                                this.props.controller.reRender();

                                this.$couponCodeField.blur();
                            }
                            break;
                        default:
                            alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                    }
                }
            }.bind(this);
            httpRequest.open(type, url);
            httpRequest.setRequestHeader("Content-Type", "application/json");
            httpRequest.send();
        }
    }
});
