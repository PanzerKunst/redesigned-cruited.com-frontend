import Account from "../../models/account";
import Order from "../../models/order";

const store = {
    reactComponent: null,
    account: _.assign(Object.create(Account), CR.ControllerData.account),
    config: CR.ControllerData.config,
    order: _.assign(Object.create(Order), CR.ControllerData.order),

    cvReport: CR.ControllerData.assessment.cvReport,
    coverLetterReport: CR.ControllerData.assessment.coverLetterReport,
    linkedinProfileReport: CR.ControllerData.assessment.linkedinProfileReport,

    cvReportScores: CR.ControllerData.assessmentReportScores.cvReportScores,
    coverLetterReportScores: CR.ControllerData.assessmentReportScores.coverLetterReportScores,
    linkedinProfileReportScores: CR.ControllerData.assessmentReportScores.linkedinProfileReportScores,

    cvAverageScore: CR.ControllerData.cvAverageScore,
    coverLetterAverageScore: CR.ControllerData.coverLetterAverageScore,
    linkedinProfileAverageScore: CR.ControllerData.linkedinProfileAverageScore,

    i18nMessages: CR.ControllerData.i18nMessages,

    init() {
    },

    updateOrderStatus(status) {
        this.order.updateStatus(status, () => (location.href = "/"));
    }
};

export {store as default};
