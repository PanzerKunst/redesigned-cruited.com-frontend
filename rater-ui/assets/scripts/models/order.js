import Product from "./product";

const Order = {

    // Static
    statuses: {
        notPaid: -1,
        paid: 0,
        inProgress: 1,
        awaitingFeedback: 4,
        scheduled: 3,
        completed: 2
    },
    fileNamePrefixSeparator: "-",

    documentUrl(config, productCode) {
        let urlMiddle = "cv";

        switch (productCode) {
            case Product.codes.COVER_LETTER_REVIEW:
                urlMiddle = "cover-letter";
                break;
            case Product.codes.LINKEDIN_PROFILE_REVIEW:
                urlMiddle = "linkedin-profile";
                break;
            default:
        }

        return config.dwsRootUrl + "docs/" + this.id + "/" + urlMiddle + "?token=" + this.idInBase64;
    }
};

export {Order as default};
