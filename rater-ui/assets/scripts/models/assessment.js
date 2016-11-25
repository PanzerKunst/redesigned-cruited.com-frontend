import {localStorageKeys} from "../global";
import Category from "./category";
import Browser from "../services/browser";
import ArrayUtils from "../services/array";

const Assessment = {

    // Static
    nbReportComments: 3,
    minScoreForWellDoneComment: 80,

    // Instance
    init() {
        this._initCategoryIds();
    },

    categoryIds(categoryProductCode) {
        return this.categoryIds_[categoryProductCode];
    },

    listComments(categoryProductCode) {
        let listComments = this._listCommentsFromLocalStorage();

        if (!listComments) {
            listComments = _.cloneDeep(this.allDefaultComments);
            this._saveListCommentsInLocalStorage(listComments);
        }

        return listComments[categoryProductCode];
    },

    updateListComment(comment) {
        const listComments = this._listCommentsFromLocalStorage();
        let listCommentsToUpdate = listComments.cv;

        if (!_.find(listCommentsToUpdate, c => c.id === comment.id)) {
            listCommentsToUpdate = listComments.coverLetter;
        }
        if (!_.find(listCommentsToUpdate, c => c.id === comment.id)) {
            listCommentsToUpdate = listComments.linkedinProfile;
        }

        const commentToUpdate = _.find(listCommentsToUpdate, c => c.id === comment.id);

        Object.assign(commentToUpdate, comment);

        this._saveListCommentsInLocalStorage(listComments);
    },

    resetListComment(comment) {
        const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);
        const originalComment = _.find(this.allDefaultComments[categoryProductCode], c => c.id === comment.id);

        this.updateListComment(originalComment);
    },

    /*
     * @param listCommentsAndReport {
     * cvListComments: [...],
     * coverLetterListComments: [...],
     * linkedinProfileListComments: [...],
     * cvReport: {...},
     * coverLetterReport: {...},
     * linkedinProfileReport: {...}
     * }
     */
    initListCommentsAndReport(listCommentsAndReport) {
        this._saveListCommentsInLocalStorage({
            cv: listCommentsAndReport.cvListComments,
            coverLetter: listCommentsAndReport.coverLetterListComments,
            linkedinProfile: listCommentsAndReport.linkedinProfileListComments
        });

        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        myAssessments[this.orderId].report = {
            cv: listCommentsAndReport.cvReport,
            coverLetter: listCommentsAndReport.coverLetterReport,
            linkedinProfile: listCommentsAndReport.linkedinProfileReport
        };

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    areAllListCommentsSelected(categoryProductCode) {
        const listComments = this._listCommentsFromLocalStorage();
        const listCommentsForCategory = listComments ? listComments[categoryProductCode] : null;

        if (!listCommentsForCategory) {
            return false;
        }

        for (let i = 0; i < listCommentsForCategory.length; i++) {
            const c = listCommentsForCategory[i];

            if (!c.isGreenSelected && !c.isRedSelected) {
                return false;
            }
        }

        return true;
    },

    overallComment(categoryProductCode) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        return _.get(myAssessments, [this.orderId, "report", categoryProductCode, "overallComment"]);
    },

    updateOverallComment(categoryProductCode, commentText) {
        this._saveReportOverallCommentInLocalStorage(categoryProductCode, commentText);
    },

    reportCategory(categoryProductCode, categoryId, isToSaveInLocalStorage = false) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        if (_.has(myAssessments, [this.orderId, "report", categoryProductCode, "categories", categoryId])) {
            return myAssessments[this.orderId].report[categoryProductCode].categories[categoryId];
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

        if (_.has(myAssessments, [this.orderId, "report", categoryProductCode, "categories", comment.categoryId])) {
            const commentToUpdate = _.find(myAssessments[this.orderId].report[categoryProductCode].categories[comment.categoryId].comments, c => c.id === comment.id);

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
        const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);
        const originalComment = _.find(this.allDefaultComments[categoryProductCode], c => c.id === comment.id);

        this.updateReportCommentIfExists(originalComment);
    },

    reorderReportComment(categoryId, oldIndex, newIndex) {
        const categoryProductCode = Category.productCodeFromCategoryId(categoryId);
        const reportCategory = this.reportCategory(categoryProductCode, categoryId);

        ArrayUtils.move(reportCategory.comments, oldIndex, newIndex);

        this._saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory);
    },

    areAllReportCommentsChecked(categoryProductCode) {
        if (!this.areAllListCommentsSelected(categoryProductCode)) {
            return false;
        }

        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);
        const docReportCategoriesMap = _.get(myAssessments, [this.orderId, "report", categoryProductCode, "categories"]);

        if (_.isEmpty(docReportCategoriesMap)) {
            return false;
        }

        const categories = _.values(docReportCategoriesMap);

        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];

            for (let j = 0; j < category.comments.length; j++) {
                const comment = category.comments[j];

                if (!comment.isChecked) {
                    return false;
                }
            }
        }

        return true;
    },

    // (sumOfAllPoints - sumOfRedPoints) / sumOfAllPoints * 100
    categoryScore(categoryId) {
        const categoryProductCode = Category.productCodeFromCategoryId(categoryId);
        const listCommentsForCategory = _.filter(this.listComments(categoryProductCode), ac => ac.categoryId === categoryId);
        const reportCategory = this.reportCategory(categoryProductCode, categoryId);

        let sumOfAllPoints = 0;

        for (let i = 0; i < listCommentsForCategory.length; i++) {
            sumOfAllPoints += listCommentsForCategory[i].points;
        }

        let sumOfRedPoints = 0;

        // TODO: calculate sumOfRedPoints from the red comments in the list, not in the report
        for (let i = 0; i < reportCategory.comments.length; i++) {
            const commentPoints = reportCategory.comments[i].points;

            if (commentPoints) {
                sumOfRedPoints += commentPoints;
            }
        }

        return (sumOfAllPoints - sumOfRedPoints) / sumOfAllPoints * 100;
    },

    deleteAssessmentInfoFromLocalStorage() {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments) || {};

        myAssessments[this.orderId] = null;

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    isReportStarted() {
        let allCategoriesAsArray = [];

        _.values(this.categoryIds_).forEach(categoryIdsForThatDoc => {
            allCategoriesAsArray = _.concat(allCategoriesAsArray, categoryIdsForThatDoc);
        });

        for (let i = 0; i < allCategoriesAsArray[i]; i++) {
            const categoryId = allCategoriesAsArray[i];
            const categoryProductCode = Category.productCodeFromCategoryId(categoryId);
            const reportCategory = this.reportCategory(categoryProductCode, categoryId);
            const defaultCategory = this._defaultReportCategory(categoryProductCode, categoryId);

            if (!_.isEqual(reportCategory.comments, defaultCategory.comments) || !_.isEqual(reportCategory.wellDoneComment, defaultCategory.wellDoneComment)) {
                return true;
            }
        }

        return false;
    },

    _initCategoryIds() {
        const predicate = dc => dc.categoryId;

        this.categoryIds_ = {
            cv: _.uniq(this.allDefaultComments.cv.map(predicate)),
            coverLetter: _.uniq(this.allDefaultComments.coverLetter.map(predicate)),
            linkedinProfile: _.uniq(this.allDefaultComments.linkedinProfile.map(predicate))
        };
    },

    _calculateTopComments(categoryProductCode, categoryId) {
        const redCommentsForCategory = _.filter(this.listComments(categoryProductCode), ac => ac.categoryId === categoryId && ac.isRedSelected === true);
        const topCommentsForCategory = [];

        const loopCondition = () => {
            if (redCommentsForCategory.length < this.nbReportComments) {
                return topCommentsForCategory.length < redCommentsForCategory.length;
            }
            return topCommentsForCategory.length < this.nbReportComments;
        };

        while (loopCondition()) {
            const topComment = this._findRedCommentWithMostPointsInListExcept(redCommentsForCategory, topCommentsForCategory);

            if (topComment) {
                topCommentsForCategory.push(topComment);
            }
        }

        return topCommentsForCategory;
    },

    _listCommentsFromLocalStorage() {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        return myAssessments && myAssessments[this.orderId] ? myAssessments[this.orderId].listComments : null;
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

        myAssessments[this.orderId] = myAssessments[this.orderId] || {};
        myAssessments[this.orderId].listComments = comments;

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    _defaultReportCategory(categoryProductCode, categoryId) {
        return {
            comments: this._calculateTopComments(categoryProductCode, categoryId)
        };
    },

    _saveReportOverallCommentInLocalStorage(categoryProductCode, commentText) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        myAssessments[this.orderId].report = myAssessments[this.orderId].report || {};
        myAssessments[this.orderId].report[categoryProductCode] = myAssessments[this.orderId].report[categoryProductCode] || {};
        myAssessments[this.orderId].report[categoryProductCode].overallComment = commentText;

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

        myAssessments[this.orderId].report = myAssessments[this.orderId].report || {};
        myAssessments[this.orderId].report[categoryProductCode] = myAssessments[this.orderId].report[categoryProductCode] || {};
        myAssessments[this.orderId].report[categoryProductCode].categories = myAssessments[this.orderId].report[categoryProductCode].categories || {};
        myAssessments[this.orderId].report[categoryProductCode].categories[categoryId] = reportCategory;

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    _saveReportCommentInLocalStorage(categoryProductCode, comment) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);
        const commentToUpdate = _.find(myAssessments[this.orderId].report[categoryProductCode].categories[comment.categoryId].comments, c => c.id === comment.id);

        if (commentToUpdate) {
            Object.assign(commentToUpdate, comment);
        } else {
            myAssessments[this.orderId].report[categoryProductCode].categories[comment.categoryId].comments.push(comment);
        }

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    _removeReportCommentFromLocalStorage(categoryProductCode, comment) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        _.remove(myAssessments[this.orderId].report[categoryProductCode].categories[comment.categoryId].comments, c => c.id === comment.id);

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    _findRedCommentWithMostPointsInListExcept(redCommentsForCategory, reportCommentsForCategory) {
        let commentWithMostPoints = null;

        redCommentsForCategory.forEach(redComment => {
            const isCommentAlreadyInList = _.find(reportCommentsForCategory, tc => tc.id === redComment.id);

            if (!isCommentAlreadyInList) {
                if (commentWithMostPoints === null) {
                    commentWithMostPoints = redComment;
                } else if (redComment.points > commentWithMostPoints.points) {
                    commentWithMostPoints = redComment;
                }
            }
        });

        return commentWithMostPoints;
    },

    _initListCommentsFromDocReport(categoryProductCode) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        this.listComments(categoryProductCode).forEach(listComment => {
            if (_.has(myAssessments, [this.orderId, "report", categoryProductCode, "categories", listComment.categoryId])) {
                const reportComments = myAssessments[this.orderId].report[categoryProductCode].categories[listComment.categoryId].comments;
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
    }
};

export {Assessment as default};
