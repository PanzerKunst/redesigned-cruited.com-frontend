"use strict";

CR.Models.Order = P(function(c) {
    c.init = function(order) {
        this._products = order && order.products ? _.cloneDeep(order.products) : [];
        this._reductions = order && order.reductions ? _.cloneDeep(order.reductions) : [];
        this._coupon = order && order.coupon ? _.cloneDeep(order.coupon) : null;

        if (order && order.edition) {
            this._edition = _.cloneDeep(order.edition);
        } else if (!_.isEmpty(CR.editions)) {
            this._edition = CR.editions[0];
        }

        this._saveOrderInLocalStorage();
    };

    c.getProducts = function() {
        return this._products;
    };

    c.addProduct = function(product) {
        var foundProduct = _.find(this._products, function(orderProduct) {
            return orderProduct.id === product.id;
        });

        if (!foundProduct) {
            this._products.push(product);
            this._calculateReductions();
            this._saveOrderInLocalStorage();
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
            this._saveOrderInLocalStorage();
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
        this._saveOrderInLocalStorage();
    };

    c.getCoupon = function() {
        return this._coupon;
    };

    c.setCoupon = function(coupon) {
        this._coupon = coupon;
        this._saveOrderInLocalStorage();
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

    c._saveOrderInLocalStorage = function() {
        CR.Services.Browser.saveInLocalStorage(CR.localStorageKeys.order, {
            products: this._products,
            reductions: this._reductions,
            edition: this._edition,
            coupon: this._coupon
        });
    };
});
