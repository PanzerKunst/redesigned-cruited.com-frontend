"use strict";

CR.Controllers.OrderStep1 = P(function(c) {
    c.$el = $("[role=main]");

    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                i18nMessages: null,
                products: [],
                editions: [],
                controller: null
            };
        },

        render: function() {
            if (!this.state.i18nMessages || _.isEmpty(this.state.products) || _.isEmpty(this.state.editions)) {
                return null;
            }

            return (
                <div id="content">
                    <div id="page-header-bar">
                        <h1>{this.state.i18nMessages["productSelection.title"]}</h1>
                    </div>
                    <div className="with-circles">
                        <span>{this.state.i18nMessages["productSelection.subtitle"]}</span>
                        <section id="products-section">
                            <h2>{this.state.i18nMessages["productSelection.productsSection.title"]}</h2>

                            {this._getParagraphOfferTwoProductsSameOrder()}
                            {this._getParagraphOfferThreeProductsSameOrder()}

                            <ul className="styleless">
                            {this.state.products.map(function(product, index) {
                                var reactItemId = "product-" + index;

                                return <CR.Controllers.ProductListItem key={reactItemId} product={product} i18nMessages={this.state.i18nMessages} controller={this.state.controller} />;
                            }.bind(this))}
                            </ul>
                        </section>
                        <section>
                            <h2>{this.state.i18nMessages["productSelection.editionsSection.title"]}</h2>

                            <p>{this.state.i18nMessages["productSelection.editionsSection.subtitle"]}</p>

                            <ul className="styleless">
                            {this.state.editions.map(function(edition, index) {
                                var reactItemId = "edition-" + index;

                                return <CR.Controllers.EditionListItem key={reactItemId} edition={edition} i18nMessages={this.state.i18nMessages} controller={this.state.controller} />;
                            }.bind(this))}
                            </ul>
                        </section>
                        <section id="cart-section">
                            <div>
                                <h2>{this.state.i18nMessages["productSelection.cartSection.title"]}</h2>
                                <span>{CR.cart.getProducts().length}</span>
                            </div>

                            <div>
                                <span>{this.state.i18nMessages["productSelection.cartSection.productsHeader.products"]}</span>
                                <span>{this.state.i18nMessages["productSelection.cartSection.productsHeader.defaultPrice"]}</span>
                            </div>

                            <ul className="styleless">
                            {CR.cart.getProducts().map(function(product, index) {
                                var reactItemId = "cart-product-" + index;

                                return <CR.Controllers.CartProductListItem key={reactItemId} product={product} i18nMessages={this.state.i18nMessages} controller={this.state.controller} />;
                            }.bind(this))}
                            </ul>

                            <CR.Controllers.CouponForm i18nMessages={this.state.i18nMessages} controller={this.state.controller} />

                            <table>
                                <tbody>
                                    <tr>
                                        <td>{this.state.i18nMessages["productSelection.cartSection.subTotal"]}:</td>
                                        <td>{this._getCartSubTotal()} {this.state.products[0].price.currencyCode}</td>
                                    </tr>
                                    {CR.cart.getReductions().map(function(reduction, index) {
                                        var reactItemId = "cart-reduction-" + index;

                                        return (
                                            <tr key={reactItemId}>
                                                <td>{this.state.i18nMessages["reduction.name." + reduction.code]}:</td>
                                                <td>- {reduction.price.amount} {reduction.price.currencyCode}</td>
                                            </tr>
                                            );
                                    }.bind(this))}

                                    {this._getCouponRow()}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>{this.state.i18nMessages["productSelection.cartSection.total"]}:</td>
                                        <td>{this._getCartTotal()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </section>
                        <div className="centered-contents">
                            <a className="btn btn-lg btn-primary" href="/order/2">{this.state.i18nMessages["productSelection.nextStepBtn.text"]}</a>
                        </div>
                    </div>
                </div>
                );
        },

        _getParagraphOfferTwoProductsSameOrder: function() {
            if (CR.cart.getProducts().length < 2) {
                var reductionPriceTwoProductsSameOrder = CR.Models.Reduction.getOfCode(CR.Models.Reduction.codes.TWO_PRODUCTS_SAME_ORDER);
                if (reductionPriceTwoProductsSameOrder) {
                    return (
                        <p dangerouslySetInnerHTML={{__html: CR.Services.String.template(this.state.i18nMessages["productSelection.productsSection.textOfferTwoProductsSameOrder"], "reductionPrice", reductionPriceTwoProductsSameOrder.price.amount + " " + reductionPriceTwoProductsSameOrder.price.currencyCode)}} />
                        );
                }
            }
            return null;
        },

        _getParagraphOfferThreeProductsSameOrder: function() {
            if (CR.cart.getProducts().length === 2) {
                var reductionPriceThreeProductsSameOrder = CR.Models.Reduction.getOfCode(CR.Models.Reduction.codes.THREE_PRODUCTS_SAME_ORDER);
                if (reductionPriceThreeProductsSameOrder) {
                    return (
                        <p dangerouslySetInnerHTML={{__html: CR.Services.String.template(this.state.i18nMessages["productSelection.productsSection.textOfferThreeProductsSameOrder"], "reductionPrice", reductionPriceThreeProductsSameOrder.price.amount + " " + reductionPriceThreeProductsSameOrder.price.currencyCode)}} />
                        );
                }
            }
            return null;
        },

        _getCartSubTotal: function() {
            var cartSubTotal = 0;

            CR.cart.getProducts().forEach(function(product) {
                cartSubTotal += product.price.amount;
            });

            return cartSubTotal;
        },

        _getCartTotal: function() {
            var cartTotal = this._getCartSubTotal();

            CR.cart.getReductions().forEach(function(reduction) {
                cartTotal -= reduction.price.amount;
            });

            var cartCoupon = CR.cart.getCoupon();
            if (cartCoupon) {
                if (cartCoupon.discountPercentage) {
                    cartTotal = Math.round(cartTotal - cartTotal * cartCoupon.discountPercentage / 100);
                } else {
                    cartTotal -= cartCoupon.discountPrice.amount;
                }
            }

            return cartTotal;
        },

        _getCouponRow: function() {
            var cartCoupon = CR.cart.getCoupon();

            if (!cartCoupon) {
                return null;
            }

            var amount = cartCoupon.discountPercentage || cartCoupon.discountPrice.amount;
            var unit = cartCoupon.discountPercentage ? "%" : " " + cartCoupon.discountPrice.currencyCode;

            return (
                <tr>
                    <td>{cartCoupon.campaignName}:</td>
                    <td>- {amount}{unit}</td>
                </tr>
                );
        }
    });

    c.init = function(i18nMessages, products, reductions, editions) {
        this.i18nMessages = i18nMessages;
        this.products = products;
        this.editions = editions;

        CR.reductions = reductions;

        var cartFromLocalStorage = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.cart);
        if (cartFromLocalStorage) {
            CR.cart = CR.Models.Cart(CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.cart));
        } else {
            CR.cart = CR.Models.Cart({edition: editions[0]});
        }

        this.reactInstance = React.render(
            React.createElement(this.reactClass),
            this.$el[0]
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            i18nMessages: this.i18nMessages,
            products: this._getProducts(),
            editions: this.editions,
            controller: this
        });
    };

    c._getProducts = function() {
        var products = this.products ? _.cloneDeep(this.products) : [];
        var cartProducts = CR.cart.getProducts();

        for (var i = 0; i < products.length; i++) {
            var sameProductInCart = _.find(cartProducts, function(cartProduct) {
                return products[i].id === cartProduct.id;
            });

            if (sameProductInCart) {
                products[i] = _.cloneDeep(sameProductInCart);
            }
        }

        return products;
    };
});
