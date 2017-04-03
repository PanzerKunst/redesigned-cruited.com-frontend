CR.Models.Product = {
    codes: {
        CV_REVIEW: "CV_REVIEW",
        COVER_LETTER_REVIEW: "COVER_LETTER_REVIEW",
        LINKEDIN_PROFILE_REVIEW: "LINKEDIN_PROFILE_REVIEW",
        INTERVIEW_TRAINING: "INTERVIEW_TRAINING"
    },

    getOfCode(code) {
        if (!CR.products) {
            return null;
        }

        return _.find(CR.products, function(product) {
            return product.code === code;
        });
    }
};
