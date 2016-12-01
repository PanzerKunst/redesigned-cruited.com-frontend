import {httpStatusCodes} from "../../global";
import String from "../../services/string";
import Account from "../../models/account";
import Order from "../../models/order";
import Assessment from "../../models/assessment";
import Category from "../../models/category";
import Product from "../../models/product";
import Comment from "../../models/comment";

const store = {
    reactComponent: null,
    account: Object.assign(Object.create(Account), CR.ControllerData.account),
    config: CR.ControllerData.config,
    order: Object.assign(Object.create(Order), CR.ControllerData.order),
    i18nMessages: CR.ControllerData.i18nMessages,
    allDefaultComments: CR.ControllerData.allDefaultComments,
    allCommentVariations: CR.ControllerData.allCommentVariations,
    backendAssessment: CR.ControllerData.assessment,

    init() {
        this.assessment = Object.assign(Object.create(Assessment), {
            orderId: this.order.id,
            allDefaultComments: this.allDefaultComments
        });

        this.assessment.init();

        if (!this.assessment.isReportStarted() && this.backendAssessment) {

            // TODO: remove
            console.log("!this.assessment.isReportStarted() && this.backendAssessment", this.backendAssessment);

            this.assessment.initListCommentsAndReport({
                cvListComments: this._listCommentFromBackend(this.backendAssessment.cvCommentList),
                coverLetterListComments: this._listCommentFromBackend(this.backendAssessment.coverLetterCommentList),
                linkedinProfileListComments: this._listCommentFromBackend(this.backendAssessment.linkedinProfileCommentList),

                cvReport: this._docReportFromBackend(this.backendAssessment.cvReport),
                coverLetterReport: this._docReportFromBackend(this.backendAssessment.coverLetterReport),
                linkedinProfileReport: this._docReportFromBackend(this.backendAssessment.linkedinProfileReport)
            });
        }

        this.reactComponent.forceUpdate();
    },

    updateOrderStatus(status) {
        this.order.updateStatus(status);
        this.reactComponent.forceUpdate();
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

    isOrderReadOnly() {
        return (this.order.rater.id !== this.account.id && this.order.status !== Order.statuses.awaitingFeedback) ||
            this.order.status < Order.statuses.inProgress ||
            this.order.status === Order.statuses.scheduled ||
            this.order.status === Order.statuses.completed;
    },

    isOrderStartable() {
        return this.order.rater.id === this.account.id && this.order.status === Order.statuses.paid;
    },

    areAllReportCommentsCheckedForAtLeastOneCategory() {
        return this.assessment && (this.assessment.areAllReportCommentsChecked(Category.productCodes.cv) ||
            this.assessment.areAllReportCommentsChecked(Category.productCodes.coverLetter) ||
            this.assessment.areAllReportCommentsChecked(Category.productCodes.linkedinProfile));
    },

    saveCurrentReport() {

        /*
         Assessment(orderId: Long,

         cvCommentList: List[AssessmentComment(defaultComment: DefaultComment,
         isGreenSelected: Boolean,
         redText: Option[String])],
         coverLetterCommentList: List[AssessmentComment],
         linkedinProfileCommentList: List[AssessmentComment],

         cvReport: Option[DocumentReport],
         coverLetterReport: Option[DocumentReport],
         linkedinProfileReport: Option[DocumentReport])
         */
        const assessment = {
            orderId: this.order.id,

            cvCommentList: this._docCommentListForBackend(Category.productCodes.cv),
            coverLetterCommentList: this._docCommentListForBackend(Category.productCodes.coverLetter),
            linkedinProfileCommentList: this._docCommentListForBackend(Category.productCodes.linkedinProfile)
        };

        if (_.includes(this.order.containedProductCodes, Product.codes.cv)) {
            assessment.cvReport = this._docReportForBackend(Category.productCodes.cv);
        }

        if (_.includes(this.order.containedProductCodes, Product.codes.coverLetter)) {
            assessment.coverLetterReport = this._docReportForBackend(Category.productCodes.coverLetter);
        }

        if (_.includes(this.order.containedProductCodes, Product.codes.linkedinProfile)) {
            assessment.linkedinProfileReport = this._docReportForBackend(Category.productCodes.linkedinProfile);
        }

        const type = "POST";
        const url = "/api/assessments";
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
        httpRequest.send(JSON.stringify(assessment));
    },

    validateReportForm() {

        /*
         * {
         *   cv: {
         *     12: {
         *       233: {
         *         areBracketsRemaining: true,
         *         isUnChecked: true
         *       },
         *       95: {
         *         areBracketsRemaining: true
         *       }
         *     },
         *     13: {...}
         *   },
         *
         *   coverLetter: {...},
         *
         *   linkedinProfile: {...}
         * }
         */
        const errors = {};

        _.values(Category.productCodes).forEach(categoryProductCode => {
            const docErrors = {};

            store.assessment.categoryIds(categoryProductCode).forEach(categoryId => {
                const categoryErrors = {};

                store.assessment.reportCategory(categoryProductCode, categoryId).comments.forEach(comment => {
                    const commentErrors = {
                        areBracketsRemaining: !Comment.isTextValidForReport(comment.redText),
                        isUnChecked: !comment.isChecked
                    };

                    if (commentErrors.areBracketsRemaining || commentErrors.isUnChecked) {
                        categoryErrors[comment.id] = commentErrors;
                    }
                });

                if (!_.isEmpty(categoryErrors)) {
                    docErrors[categoryId] = categoryErrors;
                }
            });

            if (!_.isEmpty(docErrors)) {
                errors[categoryProductCode] = docErrors;
            }
        });

        this.reportFormValidationErrors = _.isEmpty(errors) ? null : errors;
        this.reactComponent.forceUpdate();
    },

    _docCommentListForBackend(categoryProductCode) {

        /* List[AssessmentComment(defaultComment: DefaultComment,
         * isGreenSelected: Boolean,
         * redText: Option[String])]
         */
        return this.assessment.listComments(categoryProductCode).map(c => {
            const defaultComment = _.find(this.allDefaultComments[categoryProductCode], ["id", c.id]);

            return {
                defaultComment,
                isGreenSelected: c.isGreenSelected || false,
                redText: c.redText === defaultComment.redText ? null : c.redText
            };
        });
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

    /* backendListCommentsForDoc List[
     * defaultComment: [
     *   id: Long,
     *   categoryId: Long,
     *   greenText: String,
     *   redText: String,
     *   points: Int,
     *   isGrouped: Boolean],
     * isGreenSelected: Boolean,
     * redText: Option[String]
     * ]
     */
    _listCommentFromBackend(backendListCommentsForDoc) {

        /* Frontend list comment:
         * {
         *   id: 1,
         *   categoryId: 13,
         *   greenText: "string",
         *   redText: "string",
         *   points: 5,
         *   isGrouped: false,
         *   isGreenSelected: true,
         *   isRedSelected: false
         * }
         */
        return backendListCommentsForDoc.map(c => Object.assign(c.defaultComment, {
            redText: c.redText || c.defaultComment.redText,
            isGreenSelected: c.isGreenSelected,
            isRedSelected: !c.isGreenSelected
        }));
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
                        points: c.points,
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
