import {httpStatusCodes} from "../../global";
import String from "../../services/string";
import Browser from "../../services/browser";
import Account from "../../models/account";
import Order from "../../models/order";
import Assessment from "../../models/assessment";
import Category from "../../models/category";
import Product from "../../models/product";
import Comment from "../../models/comment";
import Edition from "../../models/edition";
import Language from "../../models/language";

const store = {
    reactComponent: null,
    account: _.assign(Object.create(Account), CR.ControllerData.account),
    config: CR.ControllerData.config,
    order: _.assign(Object.create(Order), CR.ControllerData.order),
    i18nMessages: CR.ControllerData.i18nMessages,
    allDefaultComments: CR.ControllerData.allDefaultComments,
    allCommentVariations: CR.ControllerData.allCommentVariations,
    backendAssessment: CR.ControllerData.assessment,

    init() {
        this._fetchScoresOfAllOrders();

        this.assessment = Object.create(Assessment);
        this.assessment.order = this.order;
        this.assessment.allDefaultComments = this.allDefaultComments;
        this.assessment.allCommentVariations = this.allCommentVariations;

        this.assessment.init();

        if (!this.assessment.isReportStarted()) {
            if (this.order.languageCode !== Language.codes.sv || this.order.editionCode !== Edition.codes.pro) {
                this.assessment.initListCommentsWithCorrectVariations();
            }

            if (this.backendAssessment) {
                this.assessment.initListComments(Category.productCodes.cv, this.backendAssessment.cvCommentList);
                this.assessment.initListComments(Category.productCodes.coverLetter, this.backendAssessment.coverLetterCommentList);
                this.assessment.initListComments(Category.productCodes.linkedinProfile, this.backendAssessment.linkedinProfileCommentList);

                this.assessment.initReport(
                    this._docReportFromBackend(this.backendAssessment.cvReport),
                    this._docReportFromBackend(this.backendAssessment.coverLetterReport),
                    this._docReportFromBackend(this.backendAssessment.linkedinProfileReport)
                );
            }
        }

        this.reactComponent.forceUpdate();
    },

    updateOrderStatus(status) {
        this.order.updateStatus(status);
        this.reactComponent.forceUpdate();
    },

    resetCommentInListAndReport() {
        this.assessment.resetListComment(this.commentToReset);
        this.assessment.resetReportComment(this.commentToReset);
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

    variationSelected(comment) {
        this.assessment.variationSelected(comment);
        this.reactComponent.forceUpdate();
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
        const commentToRemove = comment || this.commentToRemove;

        this.assessment.removeReportComment(commentToRemove);
        this.reactComponent.forceUpdate();
    },

    handleReportCommentsReorder(categoryId, oldIndex, newIndex) {
        this.assessment.reorderReportComment(categoryId, oldIndex, newIndex);
    },

    isOrderReadOnly() {
        return this.order.isReadOnly(this.account);
    },

    isOrderStartable() {
        return this.order.rater && this.order.rater.id === this.account.id && this.order.status === Order.statuses.paid;
    },

    areAllListCommentsSelected() {
        return this.assessment && (this.assessment.areAllListCommentsSelected(Category.productCodes.cv) ||
            this.assessment.areAllListCommentsSelected(Category.productCodes.coverLetter) ||
            this.assessment.areAllListCommentsSelected(Category.productCodes.linkedinProfile));
    },

    selectNextCommentAsRedIfGrouped(commentId) {
        let categoryProductCode = null;
        let indexOfNextComment = -1;

        _.keys(this.allDefaultComments).forEach(categoryProductCd => {
            const docDefaultComments = this.allDefaultComments[categoryProductCd];

            for (let i = 0; i < docDefaultComments.length; i++) {
                if (docDefaultComments[i].id === commentId) {
                    categoryProductCode = categoryProductCd;
                    indexOfNextComment = i + 1;
                    break;
                }
            }
        });

        const nextComment = indexOfNextComment > -1 ? this.allDefaultComments[categoryProductCode][indexOfNextComment] : null;

        if (nextComment && nextComment.isGrouped && nextComment.isGreenSelected === undefined && nextComment.isRedSelected === undefined) { // eslint-disable-line no-undefined
            nextComment.isGreenSelected = false;
            nextComment.isRedSelected = true;

            this.updateListComment(nextComment);
        }
    },

    setVariationsModalForComment(comment) {
        this.currentDefaultComment = this.assessment.originalDefaultComment(comment);
        this.reactComponent.forceUpdate();
    },

    setConfirmResetCommentModal(comment) {
        this.commentToReset = comment;
        this.reactComponent.forceUpdate();
    },

    setConfirmRemoveReportCommentModal(comment) {
        this.commentToRemove = comment;
        this.reactComponent.forceUpdate();
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
                    Browser.clearLocalStorage();
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
                        areBracketsRemaining: !Comment.isTextValidForReport(comment.redText)
                    };

                    if (commentErrors.areBracketsRemaining) {
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

    _fetchScoresOfAllOrders() {
        const type = "POST";
        const url = "/api/assessments/scores-of-customers";
        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {

                    /*
                     * {
                     *   646: [
                     *   {
                     *     order: {},
                     *     scores: {
                     *       cvReportScores: {},
                     *       coverLetterReportScores: {},
                     *       linkedinProfileReportScores: {}
                     *     }
                     *   }, {
                     *     order: {},
                     *     scores: {
                     *       cvReportScores: {}
                     *     }
                     *   }],
                     *   886: [...]
                     * }
                     */
                    const scoresOfOtherOrders = _.values(JSON.parse(httpRequest.responseText))[0];

                    _.remove(scoresOfOtherOrders, orderAndScores => orderAndScores.order.id === this.order.id);

                    this.scoresOfOtherOrders = scoresOfOtherOrders.map(orderAndScores => {
                        const smartOrder = _.assign(Object.create(Order), orderAndScores.order);

                        return {
                            order: smartOrder,
                            scores: orderAndScores.scores
                        };
                    });

                    this.reactComponent.forceUpdate();
                } else {
                    alert(`AJAX failure doing a ${type} request to "${url}"`);
                }
            }
        };
        httpRequest.open(type, url);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(JSON.stringify([this.order.customer.id]));
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
                    defaultCommentId: Comment.isCustom(c) ? null : c.id, // Custom comments have UUID as ID on the frontend side
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
                        points: c.points
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
