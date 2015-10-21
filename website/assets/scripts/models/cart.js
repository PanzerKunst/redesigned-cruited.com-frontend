"use strict";

CR.Models.Cart = P(function(c) {
    c.init = function(cart) {
        this._products = cart ? _.cloneDeep(cart.products) : [];
    };

    c.getProducts = function() {
        return this._products;
    };

    c.addProduct = function(product) {
        var foundProduct = _.find(this._products, function(cartProduct) {
            return cartProduct.id === product.id;
        });

        if (!foundProduct) {
            this._products.push(product);
            this._calculateReductions();
            CR.Services.Browser.saveInLocalStorage(CR.localStorageKeys.cart, {products: this._products});
        }
    };

    c.removeProduct = function(product) {
        var productIndex = null;

        for (var i = 0; i < this._products.length; i++) {
            if (this._products[i].id === product.id) {
                productIndex = i;
                break;
            }
        }

        if (!_.isNull(productIndex)) {
            this._products.splice(productIndex, 1);
            this._calculateReductions();
            CR.Services.Browser.saveInLocalStorage(CR.localStorageKeys.cart, {products: this._products});
        }
    };

    c._calculateReductions = function() {
        this._resetReductions();

        var reductionFor2ProductsSameOrder = _.find(CR.reductions, function(reduction) {
            return reduction.code === CR.Models.Reduction.codes.TWO_PRODUCTS_SAME_ORDER;
        });

        var reductionFor3ProductsSameOrder = _.find(CR.reductions, function(reduction) {
            return reduction.code === CR.Models.Reduction.codes.THREE_PRODUCTS_SAME_ORDER;
        });

        if (this._products.length === 2 && reductionFor2ProductsSameOrder) {
            this._products[1].currentPrice.amount = this._products[1].defaultPrice.amount - reductionFor2ProductsSameOrder.price.amount;
        } else if (this._products.length === 3 && reductionFor3ProductsSameOrder) {
            this._products[1].currentPrice.amount = this._products[1].defaultPrice.amount - reductionFor3ProductsSameOrder.price.amount / 2;
            this._products[2].currentPrice.amount = this._products[2].defaultPrice.amount - reductionFor3ProductsSameOrder.price.amount / 2;
        }
    };

    c._resetReductions = function() {
        this._products.forEach(function(product) {
            product.currentPrice = _.cloneDeep(product.defaultPrice);
        });
    };
});
