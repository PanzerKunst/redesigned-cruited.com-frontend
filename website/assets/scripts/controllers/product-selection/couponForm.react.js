"use strict";

CR.Controllers.CouponForm = React.createClass({
    render: function() {
        return (
            <form ref="form" onSubmit={this._handleSubmit}>
                <div className="form-group">
                    <label htmlFor="coupon-code">{this.props.i18nMessages["productSelection.cartSection.coupon.label"]}</label>
                    <input type="text" className="form-control" id="coupon-code" placeholder={this.props.i18nMessages["productSelection.cartSection.coupon.field.placeholder"]} />
                    <p className="field-error" data-check="empty" />
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

            var type = "GET";
            var url = "/api/coupons/" + this.$couponCodeField.val();

            $.ajax({
                url: url,
                type: type,
                contentType: "application/json",
                success: function(coupon) {
                    this.$addCouponBtn.disableLoading();
                    this.$form[0].reset();

                    CR.cart.setCoupon(coupon);

                    this.props.controller.reRender();
                }.bind(this),
                error: function() {
                    this.$addCouponBtn.disableLoading();

                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                }.bind(this)
            });
        }
    }
});
