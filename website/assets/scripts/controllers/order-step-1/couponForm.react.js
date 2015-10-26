"use strict";

CR.Controllers.CouponForm = React.createClass({
    render: function() {
        return (
            <form ref="form" onSubmit={this._handleSubmit}>
                <div className="form-group">
                    <label htmlFor="coupon-code">{this.props.i18nMessages["productSelection.cartSection.coupon.label"]}</label>
                    <input type="text" className="form-control" id="coupon-code" placeholder={this.props.i18nMessages["productSelection.cartSection.coupon.field.placeholder"]} />
                    <p className="field-error" data-check="empty" />
                    <p className="field-error" id="coupon-not-found-error">{this.props.i18nMessages["productSelection.cartSection.coupon.notFoundError"]}</p>
                </div>
                <button type="submit" className="btn btn-default">{this.props.i18nMessages["productSelection.cartSection.coupon.addButton.text"]}</button>
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

        if (this.validator.isValid()) {
            this.$addCouponBtn.enableLoading(this.props.i18nMessages["productSelection.cartSection.coupon.addButton.loadingText"]);
            this.$couponNotFoundError.hide();

            var type = "GET";
            var url = "/api/coupons/" + this.$couponCodeField.val();

            $.ajax({
                url: url,
                type: type,
                contentType: "application/json",
                success: function(coupon, textStatus, jqXHR) {
                    this.$addCouponBtn.disableLoading();

                    if (jqXHR.status === CR.httpStatusCodes.noContent) {
                        this.$couponNotFoundError.show();
                    } else if (coupon) {
                        this.$form[0].reset();
                        CR.cart.setCoupon(coupon);
                        this.props.controller.reRender();
                    }
                }.bind(this),
                error: function() {
                    this.$addCouponBtn.disableLoading();

                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                }.bind(this)
            });
        }
    }
});
