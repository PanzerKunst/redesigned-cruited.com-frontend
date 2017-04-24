CR.Models.Reduction = {
    codes: {
        TWO_PRODUCTS_SAME_ORDER: "2_PRODUCTS_SAME_ORDER",
        THREE_PRODUCTS_SAME_ORDER: "3_PRODUCTS_SAME_ORDER"
    },

    getOfCode(code) {
        if (!CR.reductions) {
            return null;
        }

        return _.find(CR.reductions, function(reduction) {
            return reduction.code === code;
        });
    },

    getReductionAmount(product) {

        /* TODO if (product.code === CR.Models.Product.codes.CV_REVIEW_CONSULT || product.code === CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW_CONSULT) {
            return product.price.amount * 0.8;      // We remove the VAT on products for consultants
        } */

        return product.price.amount;
    }
};
