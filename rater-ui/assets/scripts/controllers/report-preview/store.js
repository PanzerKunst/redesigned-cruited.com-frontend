import Account from "../../models/account";
import Order from "../../models/order";

const store = {
    reactComponent: null,
    account: Object.assign(Object.create(Account), CR.ControllerData.account),
    config: CR.ControllerData.config,
    order: Object.assign(Object.create(Order), CR.ControllerData.order),
    assessmentReport: CR.ControllerData.assessmentReport,
    assessmentReportScores: CR.ControllerData.assessmentReportScores,
    cvAverageScore: CR.ControllerData.cvAverageScore,
    coverLetterAverageScore: CR.ControllerData.coverLetterAverageScore,
    linkedinProfileAverageScore: CR.ControllerData.linkedinProfileAverageScore,
    i18nMessages: CR.ControllerData.i18nMessages,

    init() {

        // TODO: remove
        console.log("order", this.order);
        console.log("assessmentReport", this.assessmentReport);
        console.log("assessmentReportScores", this.assessmentReportScores);
        console.log("cvAverageScore", this.cvAverageScore);
        console.log("coverLetterAverageScore", this.coverLetterAverageScore);
        console.log("linkedinProfileAverageScore", this.linkedinProfileAverageScore);
    }
};

export {store as default};
