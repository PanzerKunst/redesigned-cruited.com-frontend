const Product = {

    // Static
    codes: {
        CV_REVIEW: "CV_REVIEW",
        COVER_LETTER_REVIEW: "COVER_LETTER_REVIEW",
        LINKEDIN_PROFILE_REVIEW: "LINKEDIN_PROFILE_REVIEW"
    },

    humanReadableCode(dbCode) {
        switch (dbCode) {
            case this.codes.CV_REVIEW:
                return "CV";
            case this.codes.COVER_LETTER_REVIEW:
                return "Cover letter";
            default:
                return "Linkedin";
        }
    }
};

export {Product as default};
