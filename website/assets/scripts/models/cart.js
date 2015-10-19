"use strict";

CR.Cart = {
    products: [],

    addProduct: function(product) {
        CR.Cart.products.push(product);
    },

    removeProduct: function(product) {
        var productIndex = null;

        for (var i = 0; i < CR.Cart.products.length; i++) {
            if (CR.Cart.products[i].id === product.id) {
                productIndex = i;
                break;
            }
        }

        if (!_.isNull(productIndex)) {
            CR.Cart.products.splice(productIndex, 1);
        }
    }
};
