import Account from "../../models/account";
import Order from "../../models/order";
import Assessment from "../../models/assessment";

const store = {
    reactComponent: null,
    account: Object.assign(Object.create(Account), CR.ControllerData.account),
    config: CR.ControllerData.config,
    order: Object.assign(Object.create(Order), CR.ControllerData.order),
    allDefaultComments: CR.ControllerData.allDefaultComments,
    allCommentVariations: CR.ControllerData.allCommentVariations,

    init() {
        this._initCategories();
    },

    resetCommentInListAndReport(comment) {
        Assessment.resetListComment(comment);
        Assessment.resetReportComment(comment);
        this.reactComponent.forceUpdate();
    },

    updateCommentInListAndReport(comment) {
        Assessment.updateListComment(comment);
        Assessment.updateReportCommentIfExists(comment);
        this.reactComponent.forceUpdate();
    },

    updateListComment(comment) {
        Assessment.updateListComment(comment);
        this.reactComponent.forceUpdate();
    },

    updateReportCategory(category) {
        Assessment.updateReportCategory(category);
        this.reactComponent.forceUpdate();
    },

    addOrUpdateReportComment(comment) {
        Assessment.addOrUpdateReportComment(comment);
        this.reactComponent.forceUpdate();
    },

    updateReportCommentIfExists(comment) {
        Assessment.updateReportCommentIfExists(comment);
        this.reactComponent.forceUpdate();
    },

    removeReportComment(comment) {
        Assessment.removeReportComment(comment);
        this.reactComponent.forceUpdate();
    },

    handleReportCommentsReorder(categoryId, oldIndex, newIndex) {
        Assessment.reorderReportComment(categoryId, oldIndex, newIndex);
    },

    _initCategories() {
        const predicate = dc => dc.categoryId;

        this.categoryIds = {
            cv: _.uniq(this.allDefaultComments.cv.map(predicate)),
            coverLetter: _.uniq(this.allDefaultComments.coverLetter.map(predicate)),
            linkedinProfile: _.uniq(this.allDefaultComments.linkedinProfile.map(predicate))
        };

        this.reactComponent.forceUpdate();
    }
};

export {store as default};
