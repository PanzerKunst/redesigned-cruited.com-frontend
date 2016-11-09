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

    // Instance
    documentUrl(config, productCode) {
        let urlMiddle = "cv";

        switch (productCode) {
            case Product.codes.coverLetter:
                urlMiddle = "cover-letter";
                break;
            case Product.codes.linkedinProfile:
                urlMiddle = "linkedin-profile";
                break;
            default:
        }

        return `${config.dwsRootUrl}docs/${this.id}/${urlMiddle}?token=${this.idInBase64}`;
    },

    // Raters who are not assigned should still be able to check the assessment, even before it's completed
    isReadOnlyBy(raterId) {
        return this.status === Order.statuses.completed || this.status === Order.statuses.scheduled || !this.rater || this.rater.id !== raterId;
    }
};

export {Order as default};
