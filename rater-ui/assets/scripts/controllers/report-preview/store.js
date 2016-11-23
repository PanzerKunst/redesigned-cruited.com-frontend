import Account from "../../models/account";
import Order from "../../models/order";

const store = {
    reactComponent: null,
    account: Object.assign(Object.create(Account), CR.ControllerData.account),
    config: CR.ControllerData.config,
    order: Object.assign(Object.create(Order), CR.ControllerData.order),

    cvReport: CR.ControllerData.assessmentReport.cvReport,
    coverLetterReport: CR.ControllerData.assessmentReport.coverLetterReport,
    linkedinProfileReport: CR.ControllerData.assessmentReport.linkedinProfileReport,

    cvReportScores: CR.ControllerData.assessmentReportScores.cvReportScores,
    coverLetterReportScores: CR.ControllerData.assessmentReportScores.coverLetterReportScores,
    linkedinProfileReportScores: CR.ControllerData.assessmentReportScores.linkedinProfileReportScores,

    cvAverageScore: CR.ControllerData.cvAverageScore,
    coverLetterAverageScore: CR.ControllerData.coverLetterAverageScore,
    linkedinProfileAverageScore: CR.ControllerData.linkedinProfileAverageScore,

    i18nMessages: CR.ControllerData.i18nMessages,

    init() {
    }
};

export {store as default};
