"use strict";

CR.Controllers.OrderStep1 = P(function(c) {
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
                    <div id="page-header-bar">
                        <h1>{CR.i18nMessages["orderStep1.title"]}</h1>
                    </div>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["orderStep1.subtitle"]}</span>
                        <section id="products-section">
                            <h2>{CR.i18nMessages["orderStep1.productsSection.title"]}</h2>

                            {this._getParagraphOfferTwoProductsSameOrder()}
                            {this._getParagraphOfferThreeProductsSameOrder()}

                            <ul className="styleless">
                            {this.state.products.map(function(product, index) {
                                var reactItemId = "product-" + index;

                                return <CR.Controllers.ProductListItem key={reactItemId} product={product} controller={this.state.controller} />;
                            }.bind(this))}
                            </ul>
                        </section>
                        <section>
                            <h2>{CR.i18nMessages["orderStep1.editionsSection.title"]}</h2>

                            <p>{CR.i18nMessages["orderStep1.editionsSection.subtitle"]}</p>

                            <ul className="styleless">
                            {CR.editions.map(function(edition, index) {
                                var reactItemId = "edition-" + index;

                                return <CR.Controllers.EditionListItem key={reactItemId} edition={edition} controller={this.state.controller} />;
                            }.bind(this))}
                            </ul>
                        </section>
                        <section id="cart-section">
                            <div>
                                <h2>{CR.i18nMessages["orderStep1.cartSection.title"]}</h2>
                                <span>{CR.order.getProducts().length}</span>
                            </div>

                            <div>
                                <span>{CR.i18nMessages["orderStep1.cartSection.productsHeader.products"]}</span>
                                <span>{CR.i18nMessages["orderStep1.cartSection.productsHeader.defaultPrice"]}</span>
                            </div>

                            <ul className="styleless">
                            {CR.order.getProducts().map(function(product, index) {
                                var reactItemId = "cart-product-" + index;

                                return <CR.Controllers.CartProductListItem key={reactItemId} product={product} controller={this.state.controller} />;
                            }.bind(this))}
                            </ul>

                            <CR.Controllers.CouponForm controller={this.state.controller} />

                            {this._getCartTable()}
                        </section>
                        <div className="centered-contents">
                            <a className="btn btn-lg btn-primary" href="/order/2">{CR.i18nMessages["orderStep1.nextStepBtn.text"]}</a>
                        </div>
                    </div>
                </div>
                );
        },

        _getParagraphOfferTwoProductsSameOrder: function() {
            if (CR.order.getProducts().length < 2) {
                var reductionPriceTwoProductsSameOrder = CR.Models.Reduction.getOfCode(CR.Models.Reduction.codes.TWO_PRODUCTS_SAME_ORDER);
                if (reductionPriceTwoProductsSameOrder) {
                    return (<p dangerouslySetInnerHTML={{__html: CR.Services.String.template(CR.i18nMessages["orderStep1.productsSection.offerTwoProductsSameOrder.text"], "reductionPrice", reductionPriceTwoProductsSameOrder.price.amount + " " + reductionPriceTwoProductsSameOrder.price.currencyCode)}} />);
                }
            }
            return null;
        },

        _getParagraphOfferThreeProductsSameOrder: function() {
            if (CR.order.getProducts().length === 2) {
                var reductionPriceThreeProductsSameOrder = CR.Models.Reduction.getOfCode(CR.Models.Reduction.codes.THREE_PRODUCTS_SAME_ORDER);
                if (reductionPriceThreeProductsSameOrder) {
                    return (<p dangerouslySetInnerHTML={{__html: CR.Services.String.template(CR.i18nMessages["orderStep1.productsSection.offerThreeProductsSameOrder.text"], "reductionPrice", reductionPriceThreeProductsSameOrder.price.amount + " " + reductionPriceThreeProductsSameOrder.price.currencyCode)}} />);
                }
            }
            return null;
        },

        _getOrderSubTotal: function() {
            var orderSubTotal = 0;

            CR.order.getProducts().forEach(function(product) {
                orderSubTotal += product.price.amount;
            });

            return orderSubTotal;
        },

        _getOrderTotal: function() {
            var orderTotal = this._getOrderSubTotal();

            CR.order.getReductions().forEach(function(reduction) {
                orderTotal -= reduction.price.amount;
            });

            var orderCoupon = CR.order.getCoupon();
            if (orderCoupon) {
                if (orderCoupon.discountPercentage) {
                    orderTotal = Math.round(orderTotal - orderTotal * orderCoupon.discountPercentage / 100);
                } else {
                    orderTotal -= orderCoupon.discountPrice.amount;
                }
            }

            return orderTotal;
        },

        _getCartTable: function() {
            if (_.isEmpty(this.state.products)) {
                return null;
            }

            return (
                <table>
                    <tbody>
                        <tr>
                            <td>{CR.i18nMessages["orderStep1.cartSection.subTotal"]}:</td>
                            <td>{this._getOrderSubTotal()} {this.state.products[0].price.currencyCode}</td>
                        </tr>
                        {CR.order.getReductions().map(function(reduction, index) {
                            var reactItemId = "cart-reduction-" + index;

                            return (
                                <tr key={reactItemId}>
                                    <td>{CR.i18nMessages["reduction.name." + reduction.code]}:</td>
                                    <td>- {reduction.price.amount} {reduction.price.currencyCode}</td>
                                </tr>
                                );
                        })}

                        {this._getCouponRow()}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>{CR.i18nMessages["orderStep1.cartSection.total"]}:</td>
                            <td>{this._getOrderTotal()}</td>
                        </tr>
                    </tfoot>
                </table>
                );
        },

        _getCouponRow: function() {
            var orderCoupon = CR.order.getCoupon();

            if (!orderCoupon) {
                return null;
            }

            var amount = orderCoupon.discountPercentage || orderCoupon.discountPrice.amount;
            var unit = orderCoupon.discountPercentage ? "%" : " " + orderCoupon.discountPrice.currencyCode;

            return (
                <tr>
                    <td>{orderCoupon.campaignName}:</td>
                    <td>- {amount}{unit}</td>
                </tr>
                );
        }
    });

    c.init = function(i18nMessages, products, reductions, editions) {
        CR.i18nMessages = i18nMessages;
        CR.products = products;
        CR.editions = editions;
        CR.reductions = reductions;

        var orderFromLocalStorage = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.order);
        if (orderFromLocalStorage) {
            CR.order = CR.Models.Order(orderFromLocalStorage);
        } else {
            CR.order = CR.Models.Order({edition: editions[0]});
        }

        this.reactInstance = React.render(
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
        var products = CR.products ? _.cloneDeep(CR.products) : [];
        var orderProducts = CR.order.getProducts();

        for (var i = 0; i < products.length; i++) {
            var sameProductInOrder = _.find(orderProducts, function(orderProduct) {
                return products[i].id === orderProduct.id;
            });

            if (sameProductInOrder) {
                products[i] = _.cloneDeep(sameProductInOrder);
            }
        }

        return products;
    };
});
