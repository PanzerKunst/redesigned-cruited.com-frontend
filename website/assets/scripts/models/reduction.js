"use strict";

CR.Models.Reduction = {
    codes: {
        TWO_PRODUCTS_SAME_ORDER: "2_PRODUCTS_SAME_ORDER",
        THREE_PRODUCTS_SAME_ORDER: "3_PRODUCTS_SAME_ORDER"
    },

    getOfCode: function(code) {
        if (!CR.reductions) {
            return null;
        }

        return _.find(CR.reductions, function(reduction) {
            return reduction.code === code;
        });
    }
};
