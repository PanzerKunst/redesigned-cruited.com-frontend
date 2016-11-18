const Category = {

    // Static
    productCodes: {
        cv: "cv",
        coverLetter: "coverLetter",
        linkedinProfile: "linkedinProfile"
    },

    productCodeFromCategoryId(categoryId) {
        switch (categoryId) {
            case 12:
                return this.productCodes.cv;
            case 13:
                return this.productCodes.cv;
            case 14:
                return this.productCodes.cv;

            case 7:
                return this.productCodes.coverLetter;
            case 8:
                return this.productCodes.coverLetter;
            case 10:
                return this.productCodes.coverLetter;
            case 11:
                return this.productCodes.coverLetter;

            case 16:
                return this.productCodes.linkedinProfile;
            case 17:
                return this.productCodes.linkedinProfile;
            case 18:
                return this.productCodes.linkedinProfile;
            default:
                return this.productCodes.linkedinProfile;
        }
    }

    // Instance
};

export {Category as default};
