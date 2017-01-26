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
                return "cv";
            case this.codes.coverLetter:
                return "cl";
            default:
                return "in";
        }
    }

    // Instance
};

export {Product as default};
