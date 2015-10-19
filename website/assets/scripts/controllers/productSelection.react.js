"use strict";

// TODO: move to "product-selection" package
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
                                // TODO: remove
                                console.log("item", item);

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
        this.reductions = reductions;

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
            reductions: this.reductions,
            controller: this
        });
    };

    c._getProductsWithReductions = function() {
        var productsWithReductions = _.cloneDeep(this.products);

        productsWithReductions.forEach(function(product) {
            product.currentPrice = product.price;
        });

        var reductionAmountFor2ProductsSameOrder = _.find(this.reductions, function(reduction) {
            return reduction.code === CR.Models.Reduction.codes.TWO_PRODUCTS_SAME_ORDER;
        }).price.amount;

        var reductionAmountFor3ProductsSameOrder = _.find(this.reductions, function(reduction) {
            return reduction.code === CR.Models.Reduction.codes.THREE_PRODUCTS_SAME_ORDER;
        }).price.amount;

        if (CR.Cart.products.length === 2) {
            productsWithReductions[1].currentPrice = {
                amount: productsWithReductions[1].price.amount - reductionAmountFor2ProductsSameOrder,
                currencyCode: productsWithReductions[1].price.currencyCode
            };
        } else if (CR.Cart.products.length === 3) {
            productsWithReductions[1].currentPrice = {
                amount: productsWithReductions[1].price.amount - reductionAmountFor3ProductsSameOrder / 2,
                currencyCode: productsWithReductions[1].price.currencyCode
            };
            productsWithReductions[2].currentPrice = {
                amount: productsWithReductions[2].price.amount - reductionAmountFor3ProductsSameOrder / 2,
                currencyCode: productsWithReductions[2].price.currencyCode
            };
        }

        return productsWithReductions;
    };
});
