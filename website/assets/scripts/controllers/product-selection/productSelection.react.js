"use strict";

CR.Controllers.ProductSelection = P(function(c) {
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
            if (!this.state.i18nMessages) {
                return null;
            }

            var paragraphOfferTwoProductsSameOrder = null;
            var paragraphOfferThreeProductsSameOrder = null;

            if (CR.cart.getProducts().length === 2) {
                var reductionPriceThreeProductsSameOrder = CR.Models.Reduction.getOfCode(CR.Models.Reduction.codes.THREE_PRODUCTS_SAME_ORDER);
                if (reductionPriceThreeProductsSameOrder) {
                    paragraphOfferThreeProductsSameOrder = (
                        <p dangerouslySetInnerHTML={{__html: CR.Services.String.template(this.state.i18nMessages["productSelection.productsSection.textOfferThreeProductsSameOrder"], "reductionPrice", reductionPriceThreeProductsSameOrder.price.amount + " " + reductionPriceThreeProductsSameOrder.price.currencyCode)}} />
                        );
                }
            } else if (CR.cart.getProducts().length !== 3) {
                var reductionPriceTwoProductsSameOrder = CR.Models.Reduction.getOfCode(CR.Models.Reduction.codes.TWO_PRODUCTS_SAME_ORDER);
                if (reductionPriceTwoProductsSameOrder) {
                    paragraphOfferTwoProductsSameOrder = (
                        <p dangerouslySetInnerHTML={{__html: CR.Services.String.template(this.state.i18nMessages["productSelection.productsSection.textOfferTwoProductsSameOrder"], "reductionPrice", reductionPriceTwoProductsSameOrder.price.amount + " " + reductionPriceTwoProductsSameOrder.price.currencyCode)}} />
                        );
                }
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

                            {paragraphOfferTwoProductsSameOrder}
                            {paragraphOfferThreeProductsSameOrder}

                            <ul className="styleless">
                            {this.state.products.map(function(item, index) {
                                var reactItemId = "product-" + index;

                                return <CR.Controllers.ProductListItem key={reactItemId} product={item} i18nMessages={this.state.i18nMessages} controller={this.state.controller} />;
                            }.bind(this))}
                            </ul>
                        </section>
                        <section>
                            <h2>{this.state.i18nMessages["productSelection.editionsSection.title"]}</h2>

                            <p>{this.state.i18nMessages["productSelection.editionsSection.subtitle"]}</p>

                            <ul className="styleless">
                            {this.state.editions.map(function(item, index) {
                                var reactItemId = "edition-" + index;

                                return <CR.Controllers.EditionListItem key={reactItemId} edition={item} i18nMessages={this.state.i18nMessages} controller={this.state.controller} />;
                            }.bind(this))}
                            </ul>
                        </section>
                        <section id="cart-section">
                            <h2>{this.state.i18nMessages["productSelection.cartSection.title"]}</h2>

                            <div>
                                <span>{this.state.i18nMessages["productSelection.cartSection.productsHeader.products"]}</span>
                                <span>{this.state.i18nMessages["productSelection.cartSection.productsHeader.defaultPrice"]}</span>
                            </div>

                            <ul className="styleless">
                            {CR.cart.getProducts().map(function(item, index) {
                                var reactItemId = "cart-product-" + index;

                                return <CR.Controllers.CartProductListItem key={reactItemId} product={item} i18nMessages={this.state.i18nMessages} controller={this.state.controller} />;
                            }.bind(this))}
                            </ul>

                            <div>

                            </div>
                        </section>
                    </div>
                </div>
                );
        }
    });

    c.init = function(i18nMessages, products, reductions, editions) {
        this.i18nMessages = i18nMessages;
        this.products = products;
        this.editions = editions;

        CR.reductions = reductions;
        CR.cart = CR.Models.Cart(CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.cart));

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
