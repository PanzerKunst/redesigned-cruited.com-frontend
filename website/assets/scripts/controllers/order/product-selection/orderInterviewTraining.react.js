"use strict";

CR.Controllers.OrderInterviewTraining = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                supportedLanguages: [],
                currentLanguageCode: null,
                controller: null
            };
        },

        render: function() {
            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["order.interviewTraining.title"]}</h1>
                            <CR.Controllers.LanguageSelectionInHeader supportedLanguages={this.state.supportedLanguages} currentLanguageCode={this.state.currentLanguageCode} url="/order/interview-training" />
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.interviewTraining.subtitle"]}</span>

                        <CR.Controllers.OrderStepBreadcrumbs step={CR.Controllers.OrderCommon.steps.productSelection} />

                        <section id="products-section" className="two-columns">
                            <h2>{CR.i18nMessages["order.interviewTraining.productsSection.title"]}</h2>
                            <p>{CR.i18nMessages["order.interviewTraining.productsSection.description"]}</p>
                            <div>
                                <header>
                                    <div className="alert alert-info guarantee-panel" role="alert">
                                        <p dangerouslySetInnerHTML={{__html: CR.i18nMessages["moneyBackGuarantee.text"]}} />
                                    </div>
                                </header>
                                <ul className="styleless">
                                    {CR.order.getProducts().map((product, index) => <CR.Controllers.ProductListItem key={index} product={product} readOnly={true} controller={this.state.controller} />)}
                                </ul>
                            </div>
                        </section>

                        <CR.Controllers.OrderLanguageSelection supportedLanguages={this.state.supportedLanguages} currentLanguageCode={this.state.currentLanguageCode} url="/order/interview-training" />
                        <CR.Controllers.CartSection products={this.state.products} controller={this.state.controller} />

                        <form onSubmit={this._handleSubmit} className="centered-contents">
                            <p className="other-form-error" id="empty-cart">{CR.i18nMessages["order.productSelection.validation.emptyCart"]}</p>
                            <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.productSelection.submitBtn.text"]}</button>
                        </form>
                    </div>
                </div>
            );
        },

        componentDidUpdate: function() {
            this._initElements();
            this._initValidation();

            if (!_.isEmpty(CR.order.getProducts())) {
                this.validator.hideErrorMessage(this.$emptyCartError);
            }
        },

        _initElements: function() {
            const $content = $("#content");
            this.$otherFormErrors = $content.find(".other-form-error");
            this.$emptyCartError = this.$otherFormErrors.filter("#empty-cart");

            // Coupon form
            this.$couponForm = $content.find("#cart-section").find("form");
            this.$couponCodeField = this.$couponForm.find("#coupon-code");
            this.$addCouponBtn = this.$couponForm.find("#add-coupon-btn");
            this.$couponNotFoundError = this.$otherFormErrors.filter("#coupon-not-found-error");
            this.$couponExpiredError = this.$otherFormErrors.filter("#coupon-expired-error");
        },

        _initValidation: function() {
            this.validator = CR.Services.Validator();
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            this.validator.hideErrorMessage(this.$otherFormErrors);

            if (_.isEmpty(CR.order.getProducts())) {
                this.validator.showErrorMessage(this.$emptyCartError);
            } else {
                const couponCodeField = this.$couponCodeField.val();

                if (couponCodeField) {
                    const type = "GET";
                    const url = "/api/coupons/" + couponCodeField;

                    const httpRequest = new XMLHttpRequest();
                    httpRequest.onreadystatechange = function() {
                        if (httpRequest.readyState === XMLHttpRequest.DONE) {
                            this.$addCouponBtn.disableLoading();
                            this.$couponCodeField.blur();

                            let coupon;

                            switch (httpRequest.status) {
                                case CR.httpStatusCodes.noContent:
                                    this.validator.showErrorMessage(this.$couponNotFoundError);
                                    break;
                                case CR.httpStatusCodes.couponExpired:
                                    coupon = JSON.parse(httpRequest.responseText);
                                    this.$couponExpiredError[0].innerText = coupon.couponExpiredMsg;
                                    this.validator.showErrorMessage(this.$couponExpiredError);
                                    break;
                                case CR.httpStatusCodes.ok:
                                    coupon = JSON.parse(httpRequest.responseText);
                                    this.$couponForm[0].reset();

                                    CR.order.setCoupon(coupon);
                                    CR.order.saveInLocalStorage();

                                    location.href = "/order/interview-training/assessment-info";
                                    break;
                                default:
                                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                            }
                        }
                    }.bind(this);
                    httpRequest.open(type, url);
                    httpRequest.setRequestHeader("Content-Type", "application/json");
                    httpRequest.send();
                } else {
                    location.href = "/order/interview-training/assessment-info";
                }
            }
        }
    });

    c.init = function(i18nMessages, loggedInAccount, interviewTrainingProduct, supportedLanguages) {
        CR.i18nMessages = i18nMessages;
        CR.loggedInAccount = loggedInAccount;
        this.supportedLanguages = supportedLanguages;

        const orderFromLocalStorage = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.order);
        CR.order = CR.Models.Order(orderFromLocalStorage);

        CR.order.removeAllProducts();
        CR.order.addProduct(interviewTrainingProduct);
        CR.order.setEdition(null);
        CR.order.saveInLocalStorage();

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            supportedLanguages: this.supportedLanguages,
            currentLanguageCode: $("html").attr("lang"),
            controller: this
        });
    };
});
