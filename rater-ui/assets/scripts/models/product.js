const Product = {

    // Static
    codes: {
        cv: "CV_REVIEW",
        coverLetter: "COVER_LETTER_REVIEW",
        linkedinProfile: "LINKEDIN_PROFILE_REVIEW"
    },

    humanReadableCode(dbCode) {
        switch (dbCode) {
            case this.codes.cv:
                return "CV";
            case this.codes.coverLetter:
                return "Cover letter";
            default:
                return "Linkedin";
        }
    }

    // Instance
};

export {Product as default};
