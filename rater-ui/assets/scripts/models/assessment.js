import {localStorageKeys} from "../global";
import Category from "./category";
import Edition from "./edition";
import Language from "./language";
import Browser from "../services/browser";
import ArrayUtils from "../services/array";

const Assessment = {

    // Static
    nbReportComments: 3,

    // Instance
    init() {
        this._initCategoryIds();
    },

    categoryIds(categoryProductCode) {
        return this._categoryIds[categoryProductCode];
    },

    listComments(categoryProductCode) {
        let listComments = this._listCommentsFromLocalStorage();

        if (!listComments) {
            listComments = _.cloneDeep(this.allDefaultComments);
            this._saveListCommentsInLocalStorage(listComments);
        }

        return listComments[categoryProductCode];
    },

    /*
     * Called when a comment's text is updated in the list
     *
     * Structure of the comment object:
     * {
     *   id: 1,
     *   categoryId: 13,
     *   greenText: "string",
     *   redText: "string",
     *   points: 5,
     *   isGrouped: false,
     *   isGreenSelected: true,
     *   isRedSelected: false,
     *   variationId: 402
     * }
     */
    updateListComment(comment) {
        const listComments = this._listCommentsFromLocalStorage();
        const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);
        const listCommentsToUpdate = listComments[categoryProductCode];
        const commentToUpdate = _.find(listCommentsToUpdate, c => c.id === comment.id);

        if (commentToUpdate) {
            commentToUpdate.redText = comment.redText;
            commentToUpdate.isGreenSelected = comment.isGreenSelected;
            commentToUpdate.isRedSelected = comment.isRedSelected;

            this._saveListCommentsInLocalStorage(listComments);
        }
    },

    /*
     * Called when a variation is selected
     *
     * Structure of the commentVariation object:
     * {
     *   id: 238,
     *   defaultComment: {...},
     *   text: "Visa en tydligare riktning för din karriär. Formulera gärna ett mer specifikt mål eller uttryck en mer övergripande riktning eller vision för din karriär. Vart är du på väg? Var ser du dig själv om några år?",
     *   edition: {
     *     id: 4,
     *     code: "YOUNG_PRO"
     *   } [or `undefined` if variation is for an extra language]
     * }
     */
    variationSelected(comment) {
        this._applyVariationInCommentList(comment);
        this._applyVariationInReportSection(comment);
    },

    /*
     * Called when a reset button is clicked in the list
     */
    resetListComment(comment) {
        const listComments = this._listCommentsFromLocalStorage();
        const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);
        const listCommentsToUpdate = listComments[categoryProductCode];
        const commentToUpdate = _.find(listCommentsToUpdate, c => c.id === comment.id);

        if (comment.variationId) {  // The comment is a variation
            const originalVariation = _.find(this.allCommentVariations, v => v.id === comment.variationId);

            commentToUpdate.redText = originalVariation.text;
        } else {    // The comment is a default
            const originalDefault = _.find(this.allDefaultComments[categoryProductCode], c => c.id === comment.id);

            commentToUpdate.redText = originalDefault.redText;
        }

        this._saveListCommentsInLocalStorage(listComments);
    },

    initListCommentsWithCorrectVariations() {
        if (this.order.editionCode === Edition.codes.academia) {
            this._initListCommentsWithVariations(Edition.codes.academia);
        } else if (this.order.languageCode === Language.codes.en) {
            this._initListCommentsWithVariations();
        } else {
            this._initListCommentsWithVariations(this.order.editionCode);
        }
    },

    /* @backendListCommentsForDoc List[
     * defaultComment:
     *   id: Long,
     *   categoryId: Long,
     *   greenText: String,
     *   redText: String,
     *   points: Int,
     *   isGrouped: Boolean],
     *   isGreenSelected: Boolean,
     *   redText: Option[String]
     * ]
     */
    initListComments(categoryProductCode, backendListCommentsForDoc) {
        if (!_.isEmpty(backendListCommentsForDoc)) {
            const listComments = this._listCommentsFromLocalStorage() || _.cloneDeep(this.allDefaultComments);

            for (const listComment of listComments[categoryProductCode]) {
                const backendListComment = _.find(backendListCommentsForDoc, c => c.defaultComment.id === listComment.id);

                if (backendListComment.isGreenSelected) {
                    listComment.isGreenSelected = true;
                    listComment.isRedSelected = false;
                } else {
                    listComment.isGreenSelected = false;
                    listComment.isRedSelected = true;

                    if (backendListComment.redText) {
                        listComment.redText = backendListComment.redText;
                    }
                }
            }

            this._saveListCommentsInLocalStorage(listComments);
        }
    },

    initReport(cvReport, coverLetterReport, linedinProfileReport) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        myAssessments[this.order.id].report = {
            cv: cvReport,
            coverLetter: coverLetterReport,
            linkedinProfile: linedinProfileReport
        };

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    areAllListCommentsSelected(categoryProductCode) {
        const listComments = this._listCommentsFromLocalStorage();
        const listCommentsForDoc = listComments ? listComments[categoryProductCode] : null;

        if (!listCommentsForDoc) {
            return false;
        }

        for (const c of listCommentsForDoc) {
            if (!c.isGreenSelected && !c.isRedSelected) {
                return false;
            }
        }

        return true;
    },

    areListCommentsSelected(categoryProductCode, categoryId) {
        const listComments = this._listCommentsFromLocalStorage();
        const listCommentsForCategory = listComments ? _.filter(listComments[categoryProductCode], ["categoryId", categoryId]) : null;

        if (!listCommentsForCategory) {
            return false;
        }

        for (const c of listCommentsForCategory) {
            if (!c.isGreenSelected && !c.isRedSelected) {
                return false;
            }
        }

        return true;
    },

    overallComment(categoryProductCode) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        return _.get(myAssessments, [this.order.id, "report", categoryProductCode, "overallComment"]);
    },

    updateOverallComment(categoryProductCode, commentText) {
        this._saveReportOverallCommentInLocalStorage(categoryProductCode, commentText);
    },

    reportCategory(categoryProductCode, categoryId, isToSaveInLocalStorage = false) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        if (_.has(myAssessments, [this.order.id, "report", categoryProductCode, "categories", categoryId])) {
            return myAssessments[this.order.id].report[categoryProductCode].categories[categoryId];
        }

        const reportCategory = this._defaultReportCategory(categoryProductCode, categoryId);

        if (isToSaveInLocalStorage) {
            this._saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory);
        }

        return reportCategory;
    },

    updateReportCategory(category) {
        const categoryProductCode = Category.productCodeFromCategoryId(category.id);

        this._saveReportCategoryInLocalStorage(categoryProductCode, category.id, category);
    },

    addReportComment(comment) {
        const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);

        this._saveReportCommentInLocalStorage(categoryProductCode, comment);
    },

    updateReportCommentIfExists(comment) {
        const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        if (_.has(myAssessments, [this.order.id, "report", categoryProductCode, "categories", comment.categoryId])) {
            const commentToUpdate = _.find(myAssessments[this.order.id].report[categoryProductCode].categories[comment.categoryId].comments, c => c.id === comment.id);

            if (commentToUpdate) {
                this._saveReportCommentInLocalStorage(categoryProductCode, comment);
            }
        }
    },

    removeReportComment(comment) {
        const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);

        this._removeReportCommentFromLocalStorage(categoryProductCode, comment);
    },

    resetReportComment(comment) {
        this.updateReportCommentIfExists(this.originalComment(comment));
    },

    originalComment(comment) {
        const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);
        const originalComment = _.cloneDeep(_.find(this.allDefaultComments[categoryProductCode], c => c.id === comment.id));

        if (comment.variationId) {
            originalComment.variationId = comment.variationId;
            originalComment.redText = _.find(this.allCommentVariations, c => c.id === comment.variationId).text;
        }

        return originalComment;
    },

    reorderReportComment(categoryId, oldIndex, newIndex) {
        const categoryProductCode = Category.productCodeFromCategoryId(categoryId);
        const reportCategory = this.reportCategory(categoryProductCode, categoryId);

        ArrayUtils.move(reportCategory.comments, oldIndex, newIndex);

        this._saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory);
    },

    // (sumOfAllPoints - sumOfRedPoints) / sumOfAllPoints * 100
    categoryScore(categoryId) {
        const categoryProductCode = Category.productCodeFromCategoryId(categoryId);
        const listCommentsForCategory = _.filter(this.listComments(categoryProductCode), ac => ac.categoryId === categoryId);

        let sumOfAllPoints = 0;
        let sumOfRedPoints = 0;

        for (const listComment of listCommentsForCategory) {
            sumOfAllPoints += listComment.points;

            if (listComment.isRedSelected) {
                sumOfRedPoints += listComment.points;
            }
        }

        return Math.round((sumOfAllPoints - sumOfRedPoints) / sumOfAllPoints * 100);
    },

    docScore(categoryProductCode) {
        let sumOfAllPoints = 0;
        let sumOfRedPoints = 0;

        for (const listComment of this.listComments(categoryProductCode)) {
            sumOfAllPoints += listComment.points;

            if (listComment.isRedSelected) {
                sumOfRedPoints += listComment.points;
            }
        }

        return Math.round((sumOfAllPoints - sumOfRedPoints) / sumOfAllPoints * 100);
    },

    isReportStarted() {
        let allCategoriesAsArray = [];

        _.values(this._categoryIds).forEach(categoryIdsForThatDoc => {
            allCategoriesAsArray = _.concat(allCategoriesAsArray, categoryIdsForThatDoc);
        });

        for (const categoryId of allCategoriesAsArray) {
            const categoryProductCode = Category.productCodeFromCategoryId(categoryId);
            const reportCategory = this.reportCategory(categoryProductCode, categoryId);
            const defaultCategory = this._defaultReportCategory(categoryProductCode, categoryId);

            if (!_.isEqual(reportCategory.comments, defaultCategory.comments) || !_.isEqual(reportCategory.wellDoneComment, defaultCategory.wellDoneComment)) {
                return true;
            }
        }

        return false;
    },

    originalDefaultComment(comment) {
        const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);

        return _.find(this.allDefaultComments[categoryProductCode], c => c.id === comment.id);
    },

    _initCategoryIds() {
        const predicate = dc => dc.categoryId;

        this._categoryIds = {
            cv: _.uniq(this.allDefaultComments.cv.map(predicate)),
            coverLetter: _.uniq(this.allDefaultComments.coverLetter.map(predicate)),
            linkedinProfile: _.uniq(this.allDefaultComments.linkedinProfile.map(predicate))
        };
    },

    _calculateTopComments(categoryProductCode, categoryId) {
        const redCommentsForCategory = _.filter(this.listComments(categoryProductCode), ac => ac.categoryId === categoryId && ac.isRedSelected === true);

        // We initialise the top comments with all the red comments
        const topCommentsForCategory = _.cloneDeep(redCommentsForCategory);

        this._removeChildComments(topCommentsForCategory, categoryProductCode);
        this._removeCommentsUtilTopThree(topCommentsForCategory);

        return topCommentsForCategory;
    },

    // For each child comment in that report list, if the parent is also in the list, remove the child
    _removeChildComments(topCommentsForCategory, categoryProductCode) {
        for (const comment of topCommentsForCategory) {
            const parentComment = this._parentComment(comment, categoryProductCode);

            if (parentComment && _.find(topCommentsForCategory, c => c.id === parentComment.id)) {
                _.remove(topCommentsForCategory, c => c.id === comment.id);
            }
        }
    },

    _parentComment(childComment, categoryProductCode) {
        if (!childComment.isGrouped) {
            return null;
        }

        const childCommentIndex = _.findIndex(this.allDefaultComments[categoryProductCode], c => c.id === childComment.id);

        return this.allDefaultComments[categoryProductCode][childCommentIndex - 1];
    },

    // If the number of comments is > 3, remove one by one the "lightest" comment (the one with the least points) until 3 is reached
    _removeCommentsUtilTopThree(topCommentsForCategory) {
        while (topCommentsForCategory.length > this.nbReportComments) {
            let lightestComment = topCommentsForCategory[0];

            for (const comment of topCommentsForCategory) {
                if (comment.points < lightestComment.points) {
                    lightestComment = comment;
                }
            }

            _.remove(topCommentsForCategory, c => c.id === lightestComment.id);
        }
    },

    _listCommentsFromLocalStorage() {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        return myAssessments && myAssessments[this.order.id] ? myAssessments[this.order.id].listComments : null;
    },

    /*
     * Structure of the listComments object:
     * {
     *   cv: [{
     *     id: 1,
     *     categoryId: 13,
     *     greenText: "string",
     *     redText: "string",
     *     points: 5,
     *     isGrouped: false,
     *     isGreenSelected: true,
     *     isRedSelected: false
     *   },
     *   {...}
     *   ],
     *   coverLetter: [],
     *   linkedinProfile: []
     * }
     */
    _saveListCommentsInLocalStorage(comments) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments) || {};

        myAssessments[this.order.id] = myAssessments[this.order.id] || {};
        myAssessments[this.order.id].listComments = comments;

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    _defaultReportCategory(categoryProductCode, categoryId) {
        return {
            comments: this._calculateTopComments(categoryProductCode, categoryId)
        };
    },

    _saveReportOverallCommentInLocalStorage(categoryProductCode, commentText) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        myAssessments[this.order.id].report = myAssessments[this.order.id].report || {};
        myAssessments[this.order.id].report[categoryProductCode] = myAssessments[this.order.id].report[categoryProductCode] || {};
        myAssessments[this.order.id].report[categoryProductCode].overallComment = commentText;

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    /*
     * Structure of the report object:
     * {
     *   cv: {
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
     *   },
     *   coverLetter: {
     *     categories: {
     *       7: {
     *         comments: [],
     *         wellDoneComment: null
     *       }
     *     }
     *   },
     *   linkedinProfile: {
     *     categories : {
     *       16: {
     *         comments: [],
     *         wellDoneComment: null
     *       }
     *     }
     *   }
     * }
     */
    _saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        myAssessments[this.order.id].report = myAssessments[this.order.id].report || {};
        myAssessments[this.order.id].report[categoryProductCode] = myAssessments[this.order.id].report[categoryProductCode] || {};
        myAssessments[this.order.id].report[categoryProductCode].categories = myAssessments[this.order.id].report[categoryProductCode].categories || {};
        myAssessments[this.order.id].report[categoryProductCode].categories[categoryId] = reportCategory;

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    _saveReportCommentInLocalStorage(categoryProductCode, comment) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);
        const commentToUpdate = _.find(myAssessments[this.order.id].report[categoryProductCode].categories[comment.categoryId].comments, c => c.id === comment.id);

        if (commentToUpdate) {
            _.assign(commentToUpdate, comment);
        } else {
            myAssessments[this.order.id].report[categoryProductCode].categories[comment.categoryId].comments.push(comment);
        }

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    _removeReportCommentFromLocalStorage(categoryProductCode, comment) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        if (_.has(myAssessments, [this.order.id, "report", categoryProductCode, "categories", comment.categoryId])) {
            _.remove(myAssessments[this.order.id].report[categoryProductCode].categories[comment.categoryId].comments, c => c.id === comment.id);
            Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
        }
    },

    _initListCommentsFromDocReport(categoryProductCode) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        this.listComments(categoryProductCode).forEach(listComment => {
            if (_.has(myAssessments, [this.order.id, "report", categoryProductCode, "categories", listComment.categoryId])) {
                const reportComments = myAssessments[this.order.id].report[categoryProductCode].categories[listComment.categoryId].comments;
                const correspondingReportComment = _.find(reportComments, rc => rc.id === listComment.id);

                if (correspondingReportComment) {   // We set it to redSelected, and update the text
                    listComment.isGreenSelected = false;
                    listComment.isRedSelected = true;
                    listComment.redText = correspondingReportComment.redText;
                } else {    // We set it to greenSelected
                    listComment.isGreenSelected = true;
                    listComment.isRedSelected = false;
                }

                this.updateListComment(listComment);
            }
        });
    },

    _initListCommentsWithVariations(editionCode) {
        let variations = null;

        if (editionCode) {
            variations = _.filter(this.allCommentVariations, v => v.edition && v.edition.code === editionCode);
        } else {    // If `editionCode` is undefined, it means we load the variations for the English language
            variations = _.filter(this.allCommentVariations, v => v.languageCode !== undefined);    // eslint-disable-line no-undefined
        }

        if (!_.isEmpty(variations)) {
            const listComments = this._listCommentsFromLocalStorage();

            _.values(Category.productCodes).forEach(categoryProductCode => {
                for (const defaultComment of listComments[categoryProductCode]) {
                    const variation = _.find(variations, v => v.defaultComment.id === defaultComment.id);

                    if (variation) {
                        defaultComment.redText = variation.text;
                        defaultComment.variationId = variation.id;
                    }
                }
            });

            this._saveListCommentsInLocalStorage(listComments);
        }
    },

    _applyVariationInCommentList(comment) {
        const listComments = this._listCommentsFromLocalStorage();
        let commentToUpdate = null;

        if (comment.defaultComment) {   // A variation (non-default) is selected in the modal
            let listCommentsToUpdate = listComments.cv;

            if (!_.find(listCommentsToUpdate, c => c.id === comment.defaultComment.id)) {
                listCommentsToUpdate = listComments.coverLetter;
            }
            if (!_.find(listCommentsToUpdate, c => c.id === comment.defaultComment.id)) {
                listCommentsToUpdate = listComments.linkedinProfile;
            }

            commentToUpdate = _.find(listCommentsToUpdate, c => c.id === comment.defaultComment.id);

            commentToUpdate.redText = comment.text;
            commentToUpdate.variationId = comment.id;
        } else {    // The default comment is selected in the modal
            const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);
            const listCommentsToUpdate = listComments[categoryProductCode];

            commentToUpdate = _.find(listCommentsToUpdate, c => c.id === comment.id);

            commentToUpdate.redText = comment.redText;
            commentToUpdate.variationId = null;
        }

        commentToUpdate.isGreenSelected = false;
        commentToUpdate.isRedSelected = true;

        this._saveListCommentsInLocalStorage(listComments);
    },

    _applyVariationInReportSection(comment) {
        const categoryId = comment.defaultComment ? comment.defaultComment.categoryId : comment.categoryId;
        const categoryProductCode = Category.productCodeFromCategoryId(categoryId);
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        if (_.has(myAssessments, [this.order.id, "report", categoryProductCode, "categories", categoryId])) {
            let commentToUpdate = null;
            let variationId = null;

            if (comment.defaultComment) {   // Variation
                commentToUpdate = _.find(myAssessments[this.order.id].report[categoryProductCode].categories[categoryId].comments, c => c.id === comment.defaultComment.id);
                variationId = comment.id;
            } else {    // Default
                commentToUpdate = _.find(myAssessments[this.order.id].report[categoryProductCode].categories[categoryId].comments, c => c.id === comment.id);
            }

            if (commentToUpdate) {
                commentToUpdate.redText = comment.text;
                commentToUpdate.variationId = variationId;

                this._saveReportCommentInLocalStorage(categoryProductCode, commentToUpdate);
            }
        }
    }
};

export {Assessment as default};
