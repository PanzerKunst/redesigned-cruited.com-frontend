import {httpStatusCodes} from "../global";
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
    reportUrl(config) {
        return `${config.customerAppRootUrl}reports/${this.id}`;
    },

    documentUrl(config, productCode) {
        if (productCode === Product.codes.linkedinProfile) {
            return this.customer.linkedinProfile.publicProfileUrl;
        }

        let urlMiddle = "cv";

        if (productCode === Product.codes.coverLetter) {
            urlMiddle = "cover-letter";
        }

        return `${config.dwsRootUrl}docs/${this.id}/${urlMiddle}?token=${this.idInBase64}`;
    },

    thumbnailUrl(config, productCode) {
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

        return `${config.dwsRootUrl}docs/${this.id}/${urlMiddle}/thumbnail`;
    },

    statusCode() {
        switch (this.status) {
            case this.statuses.notPaid:
                return "NOT_PAID";
            case this.statuses.paid:
                return "PAID";
            case this.statuses.inProgress:
                return "IN_PROGRESS";
            case this.statuses.awaitingFeedback:
                return "FOR_FEEDBACK";
            case this.statuses.scheduled:
                return "SCHEDULED";
            default:
                return "COMPLETED";
        }
    },

    humanReadableStatus() {
        switch (this.status) {
            case this.statuses.notPaid:
                return "NOT PAID";
            case this.statuses.paid:
                return "READY TO ASSESS";
            case this.statuses.inProgress:
                return "IN PROGRESS";
            case this.statuses.awaitingFeedback:
                return "READY FOR FEEDBACK";
            case this.statuses.scheduled:
                return "SCHEDULED";
            default:
                return "COMPLETED";
        }
    },

    updateStatus(status, onAjaxRequestSuccess) {
        this.status = status;

        const type = "PUT";
        const url = "/api/orders";
        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {
                    if (_.isFunction(onAjaxRequestSuccess)) {
                        onAjaxRequestSuccess();
                    }
                } else {
                    alert(`AJAX failure doing a ${type} request to "${url}"`);
                }
            }
        };
        httpRequest.open(type, url);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(JSON.stringify(this));
    }
};

export {Order as default};
