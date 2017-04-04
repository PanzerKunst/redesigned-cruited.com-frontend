CR.Models.Product = {
    codes: {
        CV_REVIEW: "CV_REVIEW",
        COVER_LETTER_REVIEW: "COVER_LETTER_REVIEW",
        LINKEDIN_PROFILE_REVIEW: "LINKEDIN_PROFILE_REVIEW",
        CV_REVIEW_CONSULT: "CV_REVIEW_CONSULT",
        LINKEDIN_PROFILE_REVIEW_CONSULT: "LINKEDIN_PROFILE_REVIEW_CONSULT",
        INTERVIEW_TRAINING: "INTERVIEW_TRAINING"
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
    }
};
