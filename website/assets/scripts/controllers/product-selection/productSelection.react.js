"use strict";

CR.Controllers.ProductSelection = P(function(c) {
    c.$el = $(document.getElementById("content"));

    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                i18nMessages: null,
                products: [],
                controller: null
            };
        },

        render: function() {
            if (!this.state.i18nMessages) {
                return null;
            }

            return (
                <div>
                    <div className="page-header-bar">
                        <h1>{this.state.i18nMessages["productSelection.title"]}</h1>
                    </div>
                    <div>
                        <span>{this.state.i18nMessages["productSelection.subtitle"]}</span>
                        <section>
                            <h2>{this.state.i18nMessages["productSelection.productsSection.title"]}</h2>
                            <ul className="styleless">
                            {this.state.products.map(function(item, index) {
                                var reactItemId = "product-" + index;

                                return <CR.Controllers.ProductListItem key={reactItemId} product={item} i18nMessages={this.state.i18nMessages} controller={this.state.controller} />;
                            }.bind(this))}
                            </ul>
                        </section>
                    </div>
                </div>
                );
        }
    });

    c.init = function(i18nMessages, products, reductions) {
        this.i18nMessages = i18nMessages;
        this.products = products;

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
            products: this._getProductsWithReductions(),
            controller: this
        });
    };

    c._getProductsWithReductions = function() {
        var productsWithReductions = this._initProductsWithReductions();
        var cartProducts = CR.cart.getProducts();

        for (var i = 0; i < productsWithReductions.length; i++) {
            var sameProductInCart = _.find(cartProducts, function(cartProduct) {
                return productsWithReductions[i].id === cartProduct.id;
            });

            if (sameProductInCart) {
                productsWithReductions[i] = _.cloneDeep(sameProductInCart);
            }
        }

        return productsWithReductions;
    };

    c._initProductsWithReductions = function() {
        var productsWithReductions = this.products ? _.cloneDeep(this.products) : [];

        productsWithReductions.forEach(function(product) {
            product.defaultPrice = product.price;
            product.currentPrice = product.defaultPrice;
            delete product.price;
        });

        return productsWithReductions;
    };
});
