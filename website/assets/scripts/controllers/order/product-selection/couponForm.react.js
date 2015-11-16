"use strict";

CR.Controllers.CouponForm = React.createClass({
    render: function() {
        return (
            <form ref="form" onSubmit={this._handleSubmit}>
                <div className="form-group">
                    <label htmlFor="coupon-code">{CR.i18nMessages["order.productSelection.cartSection.coupon.label"]}</label>
                    <input type="text" className="form-control" id="coupon-code" placeholder={CR.i18nMessages["order.productSelection.cartSection.coupon.field.placeholder"]} />
                    <p className="field-error" data-check="empty" />
                    <p className="other-form-error" id="coupon-not-found-error">{CR.i18nMessages["order.productSelection.cartSection.coupon.notFoundError"]}</p>
                </div>
                <button type="submit" className="btn btn-default">{CR.i18nMessages["order.productSelection.cartSection.coupon.addBtn.text"]}</button>
            </form>
            );
    },

    componentDidMount: function() {
        this._initElements();
        this._initValidation();
    },

    _initElements: function() {
        this.$form = $(React.findDOMNode(this.refs.form));
        this.$couponCodeField = this.$form.find("#coupon-code");
        this.$addCouponBtn = this.$form.children("button");
        this.$couponNotFoundError = this.$form.find("#coupon-not-found-error");
    },

    _initValidation: function() {
        this.validator = CR.Services.Validator([
            "coupon-code"
        ]);
    },

    _handleSubmit: function(e) {
        e.preventDefault();

        this.validator.hideErrorMessage(this.$couponNotFoundError);


        if (this.validator.isValid()) {
            this.$addCouponBtn.enableLoading(CR.i18nMessages["order.productSelection.cartSection.coupon.addBtn.loadingText"]);

            let type = "GET";
            let url = "/api/coupons/" + this.$couponCodeField.val();

            let httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    this.$addCouponBtn.disableLoading();

                    if (httpRequest.status === CR.httpStatusCodes.noContent) {
                        this.validator.showErrorMessage(this.$couponNotFoundError);
                    } else if (httpRequest.status === CR.httpStatusCodes.ok) {
                        let coupon = JSON.parse(httpRequest.responseText);
                        if (coupon) {
                            this.$form[0].reset();
                            CR.order.setCoupon(coupon);
                            this.props.controller.reRender();
                        }
                    } else {
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
