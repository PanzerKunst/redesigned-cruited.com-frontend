import {httpStatusCodes} from "../../global";
import Account from "../../models/account";
import Order from "../../models/order";
import Assessment from "../../models/assessment";
import Category from "../../models/category";
import Product from "../../models/product";

const store = {
    reactComponent: null,
    account: Object.assign(Object.create(Account), CR.ControllerData.account),
    config: CR.ControllerData.config,
    order: Object.assign(Object.create(Order), CR.ControllerData.order),
    i18nMessages: CR.ControllerData.i18nMessages,
    allDefaultComments: CR.ControllerData.allDefaultComments,
    allCommentVariations: CR.ControllerData.allCommentVariations,
    assessmentReport: CR.ControllerData.assessmentReport,

    init() {
        this._initCategories();

        // TODO: remove
        console.log("isReportStarted: ", Assessment.isReportStarted(this.categoryIds));

        if (!Assessment.isReportStarted(this.categoryIds)) {

            // TODO
            console.log("TODO: initialize report in local storage with `this.assessmentReport`");
        }
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

    updateOverallComment(categoryProductCode, commentText) {
        Assessment.updateOverallComment(categoryProductCode, commentText);
    },

    updateReportCategory(category, isRefreshRequired) {
        Assessment.updateReportCategory(category);

        if (isRefreshRequired) {
            this.reactComponent.forceUpdate();
        }
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

    saveCurrentReport(onAjaxRequestSuccess) {

        /*
         AssessmentReport(orderId: Long,
         cvReport: Option[DocumentReport],
         coverLetterReport: Option[DocumentReport],
         linkedinProfileReport: Option[DocumentReport])
         */
        const assessmentReport = {
            orderId: this.order.id
        };

        if (_.includes(this.order.containedProductCodes, Product.codes.cv)) {
            assessmentReport.cvReport = this._docReportForBackend(Category.productCodes.cv);
        }

        if (_.includes(this.order.containedProductCodes, Product.codes.coverLetter)) {
            assessmentReport.coverLetterReport = this._docReportForBackend(Category.productCodes.coverLetter);
        }

        if (_.includes(this.order.containedProductCodes, Product.codes.linkedinProfile)) {
            assessmentReport.linkedinProfileReport = this._docReportForBackend(Category.productCodes.linkedinProfile);
        }

        const type = "POST";
        const url = "/api/reports";
        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {
                    Assessment.deleteAssessmentInfoFromLocalStorage();
                    onAjaxRequestSuccess();
                } else {
                    alert(`AJAX failure doing a ${type} request to "${url}"`);
                }
            }
        };
        httpRequest.open(type, url);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(JSON.stringify(assessmentReport));
    },

    _initCategories() {
        const predicate = dc => dc.categoryId;

        this.categoryIds = {
            cv: _.uniq(this.allDefaultComments.cv.map(predicate)),
            coverLetter: _.uniq(this.allDefaultComments.coverLetter.map(predicate)),
            linkedinProfile: _.uniq(this.allDefaultComments.linkedinProfile.map(predicate))
        };

        this.reactComponent.forceUpdate();
    },

    _docReportForBackend(categoryProductCode) {

        /*
         DocumentReport(redComments: List[RedComment],
         wellDoneComments: List[WellDoneComment],
         overallComment: Option[String])
         */
        const docReport = {
            redComments: [],
            wellDoneComments: [],
            overallComment: Assessment.overallComment(categoryProductCode)
        };

        this.categoryIds[categoryProductCode].forEach(categoryId => {
            const reportCategory = Assessment.reportCategory(categoryProductCode, categoryId);

            /*
             RedComment(id: Option[Long], // None when custom comment coming from frontend
             categoryId: Long,
             text: String,
             points: Option[Int])  // None when custom comment coming from frontend
             */
            reportCategory.comments.forEach(c => {
                docReport.redComments.push({
                    id: _.isNumber(c.id) ? c.id : null, // Custom comments have UUID as ID on the frontend side
                    categoryId,
                    text: c.redText,
                    points: c.points
                });
            });

            /*
             WellDoneComment(categoryId: Long,
             text: String)
             */
            if (reportCategory.wellDoneComment) {
                docReport.wellDoneComments.push({
                    categoryId,
                    text: reportCategory.wellDoneComment
                });
            }
        });

        if (docReport.redComments.length === 0 && docReport.wellDoneComments.length === 0) {
            return null;
        }

        return docReport;
    }
};

export {store as default};
