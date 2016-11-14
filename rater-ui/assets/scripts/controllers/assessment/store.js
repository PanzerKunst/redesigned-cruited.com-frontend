import {httpStatusCodes} from "../../global";
import Account from "../../models/account";
import Order from "../../models/order";
import Assessment from "../../models/assessment";
import Category from "../../models/category";

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

    isOrderReadOnly() {
        return this.order.isReadOnlyBy(this.account.id);
    },

    updateOrderStatus(status) {
        this.order.status = status;

        const type = "PUT";
        const url = "/api/orders";
        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {
                    this.reactComponent.forceUpdate();
                } else {
                    alert(`AJAX failure doing a ${type} request to "${url}"`);
                }
            }
        };
        httpRequest.open(type, url);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(JSON.stringify(this.order));
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

    areAllReportCommentsCheckedForAtLeastOneCategory() {
        return Assessment.areAllReportCommentsChecked(Category.productCodes.cv) ||
            Assessment.areAllReportCommentsChecked(Category.productCodes.coverLetter) ||
            Assessment.areAllReportCommentsChecked(Category.productCodes.linkedinProfile);
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
