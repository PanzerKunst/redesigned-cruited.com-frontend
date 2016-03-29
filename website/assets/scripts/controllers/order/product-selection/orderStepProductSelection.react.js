"use strict";

CR.Controllers.OrderStepProductSelection = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                products: [],
                controller: null
            };
        },

        render: function() {
            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["order.productSelection.title"]}</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.productSelection.subtitle"]}</span>

                        <CR.Controllers.OrderStepBreadcrumbs step={CR.Controllers.OrderCommon.steps.productSelection} />

                        <section id="products-section" className="two-columns">
                            <header>
                                <h2>{CR.i18nMessages["order.productSelection.productsSection.title"]}</h2>
                                {this._getParagraphOfferTwoProductsSameOrder()}
                                {this._getParagraphOfferThreeProductsSameOrder()}
                                {this._getParagraphAllOffersActivated()}
                                <div className="alert alert-info guarantee-panel" role="alert">
                                    <p dangerouslySetInnerHTML={{__html: CR.i18nMessages["moneyBackGuarantee.text"]}} />
                                </div>
                            </header>
                            <ul className="styleless">
                            {this.state.products.map(function(product, index) {
                                const reactItemId = "product-" + index;

                                return <CR.Controllers.ProductListItem key={reactItemId} product={product} controller={this.state.controller} />;
                            }.bind(this))}
                            </ul>
                        </section>
                        <section id="editions-section" className="two-columns">
                            <header>
                                <h2>{CR.i18nMessages["order.productSelection.editionsSection.title"]}</h2>
                                <p className="light-font">{CR.i18nMessages["order.productSelection.editionsSection.subtitle"]}</p>
                            </header>
                            <ul className="styleless">
                            {CR.editions.map(function(edition, index) {
                                const reactItemId = "edition-" + index;

                                return <CR.Controllers.EditionListItem key={reactItemId} edition={edition} controller={this.state.controller} />;
                            }.bind(this))}
                            </ul>
                        </section>
                        <section id="cart-section">
                            <header>
                                <h2>{CR.i18nMessages["order.productSelection.cartSection.title"]}</h2>
                                <span className="highlighted-number">{CR.order.getProducts().length}</span>
                            </header>
                            <div>
                                <div className="column-labels">
                                    <span>{CR.i18nMessages["order.productSelection.cartSection.productsHeader.products"]}</span>
                                    <span>{CR.i18nMessages["order.productSelection.cartSection.productsHeader.defaultPrice"]}</span>
                                </div>

                                <ul className="styleless">
                                    {CR.order.getProducts().map(function(product, index) {
                                        const reactItemId = "cart-product-" + index;

                                        return <CR.Controllers.CartProductListItem key={reactItemId} product={product} controller={this.state.controller} />;
                                    }.bind(this))}
                                </ul>

                                <CR.Controllers.CouponForm controller={this.state.controller} />

                                <div className="bottom-section">
                                    {this._getCartTable()}

                                    <div className="alert alert-info guarantee-panel" role="alert">
                                        <p dangerouslySetInnerHTML={{__html: CR.i18nMessages["moneyBackGuarantee.text"]}} />
                                    </div>
                                </div>
                            </div>
                        </section>
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

        _getParagraphOfferTwoProductsSameOrder: function() {
            if (CR.order.getProducts().length < 2) {
                const reductionTwoProductsSameOrder = CR.Models.Reduction.getOfCode(CR.Models.Reduction.codes.TWO_PRODUCTS_SAME_ORDER);
                if (reductionTwoProductsSameOrder) {
                    return <p className="light-font" dangerouslySetInnerHTML={{__html: CR.Services.String.template(CR.i18nMessages["order.productSelection.productsSection.offerTwoProductsSameOrder.text"], "reductionPrice", reductionTwoProductsSameOrder.price.amount + " " + reductionTwoProductsSameOrder.price.currencyCode)}} />;
                }
            }
            return null;
        },

        _getParagraphOfferThreeProductsSameOrder: function() {
            if (CR.order.getProducts().length === 2) {
                const reductionThreeProductsSameOrder = CR.Models.Reduction.getOfCode(CR.Models.Reduction.codes.THREE_PRODUCTS_SAME_ORDER);
                if (reductionThreeProductsSameOrder) {
                    return <p className="light-font" dangerouslySetInnerHTML={{__html: CR.Services.String.template(CR.i18nMessages["order.productSelection.productsSection.offerThreeProductsSameOrder.text"], "reductionPrice", reductionThreeProductsSameOrder.price.amount + " " + reductionThreeProductsSameOrder.price.currencyCode)}} />;
                }
            }
            return null;
        },

        _getParagraphAllOffersActivated: function() {
            if (CR.order.getProducts().length === this.state.products.length) {
                const reductionThreeProductsSameOrder = CR.Models.Reduction.getOfCode(CR.Models.Reduction.codes.THREE_PRODUCTS_SAME_ORDER);
                if (reductionThreeProductsSameOrder) {
                    return <p className="light-font" dangerouslySetInnerHTML={{__html: CR.Services.String.template(CR.i18nMessages["order.productSelection.productsSection.allOffersActivated.text"], "reductionPrice", reductionThreeProductsSameOrder.price.amount + " " + reductionThreeProductsSameOrder.price.currencyCode)}} />;
                }
            }
            return null;
        },

        _getCartTable: function() {
            if (_.isEmpty(this.state.products)) {
                return null;
            }

            return (
                <table>
                    <tbody>
                        <tr className="sub-total-row">
                            <td>{CR.i18nMessages["order.productSelection.cartSection.subTotal"]}:</td>
                            <td>{CR.order.getBasePrice()} {this.state.products[0].price.currencyCode}</td>
                        </tr>
                        {CR.order.getReductions().map(function(reduction, index) {
                            const reactItemId = "cart-reduction-" + index;

                            return (
                                <tr key={reactItemId} className="reduction-row">
                                    <td>{CR.i18nMessages["reduction.name." + reduction.code]}:</td>
                                    <td>- {reduction.price.amount} {reduction.price.currencyCode}</td>
                                </tr>
                            );
                        })}

                        {this._getCouponRow()}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>{CR.i18nMessages["order.productSelection.cartSection.total"]}:</td>
                            <td>{CR.order.getTotalPrice()} {this.state.products[0].price.currencyCode}</td>
                        </tr>
                    </tfoot>
                </table>
            );
        },

        _getCouponRow: function() {
            const orderCoupon = CR.order.getCoupon();

            if (!orderCoupon) {
                return null;
            }

            const amount = orderCoupon.discountPercentage || orderCoupon.discountPrice.amount;
            const unit = orderCoupon.discountPercentage ? "%" : " " + orderCoupon.discountPrice.currencyCode;

            return (
                <tr className="coupon-row">
                    <td>{orderCoupon.campaignName}:</td>
                    <td>- {amount}{unit}</td>
                </tr>
            );
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

                                    location.href = "/order/assessment-info";
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
                    location.href = "/order/assessment-info";
                }
            }
        }
    });

    c.init = function(i18nMessages, products, reductions, editions, loggedInAccount) {
        CR.i18nMessages = i18nMessages;
        CR.products = products;
        CR.editions = editions;
        CR.reductions = reductions;
        CR.loggedInAccount = loggedInAccount;

        const orderFromLocalStorage = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.order);
        CR.order = CR.Models.Order(orderFromLocalStorage);

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            products: this._getProducts(),
            controller: this
        });
    };

    c._getProducts = function() {
        const products = CR.products ? _.cloneDeep(CR.products) : [];
        const orderProducts = CR.order.getProducts();

        for (let i = 0; i < products.length; i++) {
            const sameProductInOrder = _.find(orderProducts, function(orderProduct) {
                return products[i].id === orderProduct.id;
            });

            if (sameProductInOrder) {
                products[i] = _.cloneDeep(sameProductInOrder);
            }
        }

        return products;
    };
});
