CR.Models.Product = {
    codes: {
        CV_REVIEW: "CV_REVIEW",
        COVER_LETTER_REVIEW: "COVER_LETTER_REVIEW",
        LINKEDIN_PROFILE_REVIEW: "LINKEDIN_PROFILE_REVIEW",
        CV_REVIEW_CONSULT: "CV_REVIEW_CONSULT",
        LINKEDIN_PROFILE_REVIEW_CONSULT: "LINKEDIN_PROFILE_REVIEW_CONSULT",
    },

    getOfCode(code) {
        if (!CR.products) {
            return null;
        }

        return _.find(CR.products, function(product) {
            return product.code === code;
        });
    },

    codeTranslatedToClassic(code) {
        if (code === CR.Models.Product.codes.CV_REVIEW_CONSULT) {
            return CR.Models.Product.codes.CV_REVIEW;
        }

        if (code === CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW_CONSULT) {
            return CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW;
        }

        return code;
    },

    displayPrice(amount, product) { // eslint-disable-line no-unused-vars

        /* TODO if (product.code === CR.Models.Product.codes.CV_REVIEW_CONSULT || product.code === CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW_CONSULT) {
            return Math.round(amount * 0.8);    // We remove the VAT on products for consultants
        } */

        return amount;
    }
};
