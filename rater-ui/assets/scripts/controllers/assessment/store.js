import {httpStatusCodes} from "../../global";
import String from "../../services/string";
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
        this.assessment = Object.assign(Object.create(Assessment), {
            orderId: this.order.id,
            allDefaultComments: this.allDefaultComments
        });

        this.assessment.init();

        if (!this.assessment.isReportStarted() && this.assessmentReport) {
            this.assessment.initReport({
                cv: this._docReportFromBackend(this.assessmentReport.cvReport),
                coverLetter: this._docReportFromBackend(this.assessmentReport.coverLetterReport),
                linkedinProfile: this._docReportFromBackend(this.assessmentReport.linkedinProfileReport)
            });

            this.assessment.initListCommentsFromReport();
        }

        this.reactComponent.forceUpdate();
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
        this.assessment.resetListComment(comment);
        this.assessment.resetReportComment(comment);
        this.reactComponent.forceUpdate();
    },

    updateCommentInListAndReport(comment) {
        this.assessment.updateListComment(comment);
        this.assessment.updateReportCommentIfExists(comment);
        this.reactComponent.forceUpdate();
    },

    updateListComment(comment) {
        this.assessment.updateListComment(comment);
        this.reactComponent.forceUpdate();
    },

    updateOverallComment(categoryProductCode, commentText) {
        this.assessment.updateOverallComment(categoryProductCode, commentText);
    },

    updateReportCategory(category, isRefreshRequired) {
        this.assessment.updateReportCategory(category);

        if (isRefreshRequired) {
            this.reactComponent.forceUpdate();
        }
    },

    addReportComment(comment) {
        this.assessment.addReportComment(comment);
        this.reactComponent.forceUpdate();
    },

    updateReportCommentIfExists(comment) {
        this.assessment.updateReportCommentIfExists(comment);
        this.reactComponent.forceUpdate();
    },

    removeReportComment(comment) {
        this.assessment.removeReportComment(comment);
        this.reactComponent.forceUpdate();
    },

    handleReportCommentsReorder(categoryId, oldIndex, newIndex) {
        this.assessment.reorderReportComment(categoryId, oldIndex, newIndex);
    },

    areAllReportCommentsCheckedForAtLeastOneCategory() {
        return this.assessment && (this.assessment.areAllReportCommentsChecked(Category.productCodes.cv) ||
            this.assessment.areAllReportCommentsChecked(Category.productCodes.coverLetter) ||
            this.assessment.areAllReportCommentsChecked(Category.productCodes.linkedinProfile));
    },

    saveCurrentReport() {

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
                    this.assessment.deleteAssessmentInfoFromLocalStorage();
                    location.href = `/report-preview/${store.order.id}`;
                } else {
                    alert(`AJAX failure doing a ${type} request to "${url}"`);
                }
            }
        };
        httpRequest.open(type, url);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(JSON.stringify(assessmentReport));
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
            overallComment: this.assessment.overallComment(categoryProductCode)
        };

        this.assessment.categoryIds(categoryProductCode).forEach(categoryId => {
            const reportCategory = this.assessment.reportCategory(categoryProductCode, categoryId);

            /*
             RedComment(id: Option[Long], // None when custom comment coming from frontend
             categoryId: Long,
             text: String,
             points: Option[Int])  // None when custom comment coming from frontend
             */
            reportCategory.comments.forEach(c => {
                docReport.redComments.push({
                    defaultCommentId: _.isNumber(c.id) ? c.id : null, // Custom comments have UUID as ID on the frontend side
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
    },

    /* backendDocReport DocumentReport(redComments: List[RedComment],
     *   wellDoneComments: List[WellDoneComment],
     *   overallComment: Option[String])
     */
    _docReportFromBackend(backendDocReport) {
        if (!backendDocReport) {
            return null;
        }

        /*
         * Frontend doc report:
         *   {
         *     overallComment: "something",
         *     categories: {
         *       12: {
         *         comments: [],
         *         wellDoneComment: null
         *       }
         *       13: {
         *         comments: [],
         *         wellDoneComment: null
         *       }
         *       14: {
         *         comments: [],
         *         wellDoneComment: null
         *       }
         *     }
         *   }
         */

        const docReport = {
            overallComment: backendDocReport.overallComment
        };

        const redCommentCategories = backendDocReport.redComments.map(c => c.categoryId);
        const wellDoneCommentCategories = backendDocReport.wellDoneComments.map(c => c.categoryId);
        const allDocCategoryIds = _.uniq(_.concat(redCommentCategories, wellDoneCommentCategories));

        if (allDocCategoryIds.length > 0) {
            docReport.categories = {};

            allDocCategoryIds.forEach(categoryId => {
                const comments = _.filter(backendDocReport.redComments, ["categoryId", categoryId]).map(c => {
                    const redComment = {
                        id: c.defaultCommentId || String.uuid(),
                        categoryId: c.categoryId,
                        redText: c.text,
                        isChecked: true
                    };

                    return redComment;
                });

                const wellDoneCommentFound = _.find(backendDocReport.wellDoneComments, ["categoryId", categoryId]);
                const wellDoneComment = wellDoneCommentFound ? wellDoneCommentFound.text : null;

                docReport.categories[categoryId] = {
                    comments,
                    wellDoneComment
                };
            });
        }

        return docReport;
    }
};

export {store as default};
