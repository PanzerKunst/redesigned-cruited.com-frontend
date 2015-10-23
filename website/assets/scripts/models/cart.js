"use strict";

CR.Models.Cart = P(function(c) {
    c.init = function(cart) {
        this._products = cart && cart.products ? _.cloneDeep(cart.products) : [];
        this._reductions = cart && cart.reductions ? _.cloneDeep(cart.reductions) : [];
        this._edition = cart && cart.edition ? _.cloneDeep(cart.edition) : null;
        this._coupon = cart && cart.coupon ? _.cloneDeep(cart.coupon) : null;
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
            this._saveCartInLocalStorage();
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
            this._saveCartInLocalStorage();
        }
    };

    c.getReductions = function() {
        return this._reductions;
    };

    c.getEdition = function() {
        return this._edition;
    };

    c.setEdition = function(edition) {
        this._edition = edition;
        this._saveCartInLocalStorage();
    };

    c.getCoupon = function() {
        return this._coupon;
    };

    c.setCoupon = function(coupon) {
        this._coupon = coupon;
        this._saveCartInLocalStorage();
    };

    c._calculateReductions = function() {
        this._resetReductions();

        var reductionFor2ProductsSameOrder = _.find(CR.reductions, function(reduction) {
            return reduction.code === CR.Models.Reduction.codes.TWO_PRODUCTS_SAME_ORDER;
        });

        var reductionFor3ProductsSameOrder = _.find(CR.reductions, function(reduction) {
            return reduction.code === CR.Models.Reduction.codes.THREE_PRODUCTS_SAME_ORDER;
        });

        this._reductions = [];

        if (this._products.length === 2 && reductionFor2ProductsSameOrder) {
            this._products[1].reducedPrice = {
                amount: this._products[1].price.amount - reductionFor2ProductsSameOrder.price.amount,
                currencyCode: this._products[1].price.currencyCode
            };

            this._addReduction(reductionFor2ProductsSameOrder);
        } else if (this._products.length === 3 && reductionFor2ProductsSameOrder && reductionFor3ProductsSameOrder) {
            this._products[1].reducedPrice = {
                amount: this._products[1].price.amount - reductionFor2ProductsSameOrder.price.amount,
                currencyCode: this._products[1].price.currencyCode
            };

            this._products[2].reducedPrice = {
                amount: this._products[2].price.amount - (reductionFor3ProductsSameOrder.price.amount - reductionFor2ProductsSameOrder.price.amount),
                currencyCode: this._products[2].price.currencyCode
            };

            this._addReduction(reductionFor3ProductsSameOrder);
        }
    };

    c._addReduction = function(reduction) {
        this._reductions.push(reduction);
    };

    c._resetReductions = function() {
        for (var i = 0; i < this._products.length; i++) {
            delete this._products[i].reducedPrice;
        }
    };

    c._saveCartInLocalStorage = function() {
        CR.Services.Browser.saveInLocalStorage(CR.localStorageKeys.cart, {
            products: this._products,
            reductions: this._reductions,
            edition: this._edition,
            coupon: this._coupon
        });
    };
});
