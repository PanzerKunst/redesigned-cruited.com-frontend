import {localStorageKeys} from "../global";
import Category from "./category";
import Browser from "../services/browser";
import ArrayUtils from "../services/array";
import store from "../controllers/assessment/store";

const Assessment = {

    // Static
    nbReportComments: 3,
    minScoreForWellDoneComment: 80,

    listComments(categoryProductCode) {
        let listComments = this._listCommentsFromLocalStorage();

        if (!listComments) {
            listComments = _.cloneDeep(store.allDefaultComments);
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
        const originalComment = _.find(store.allDefaultComments[categoryProductCode], c => c.id === comment.id);

        this.updateListComment(originalComment);
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
        const orderId = store.order.id;
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        return _.get(myAssessments, [orderId, "report", categoryProductCode, "overallComment"]);
    },

    updateOverallComment(categoryProductCode, commentText) {
        this._saveReportOverallCommentInLocalStorage(categoryProductCode, commentText);
    },

    reportCategory(categoryProductCode, categoryId) {
        const orderId = store.order.id;
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        if (_.has(myAssessments, [orderId, "report", categoryProductCode, "categories", categoryId])) {
            return myAssessments[orderId].report[categoryProductCode].categories[categoryId];
        }

        const reportCategory = this._defaultReportCategory(categoryProductCode, categoryId);

        this._saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory);

        return reportCategory;
    },

    updateReportCategory(category) {
        const categoryProductCode = Category.productCodeFromCategoryId(category.id);

        this._saveReportCategoryInLocalStorage(categoryProductCode, category.id, category);
    },

    addOrUpdateReportComment(comment) {
        const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);

        this._saveReportCommentInLocalStorage(categoryProductCode, comment);
    },

    updateReportCommentIfExists(comment) {
        const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);
        const orderId = store.order.id;
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        if (_.has(myAssessments, [orderId, "report", categoryProductCode, "categories", comment.categoryId])) {
            const commentToUpdate = _.find(myAssessments[orderId].report[categoryProductCode].categories[comment.categoryId].comments, c => c.id === comment.id);

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
        const originalComment = _.find(store.allDefaultComments[categoryProductCode], c => c.id === comment.id);

        this.updateReportCommentIfExists(originalComment);
    },

    reorderReportComment(categoryId, oldIndex, newIndex) {
        const categoryProductCode = Category.productCodeFromCategoryId(categoryId);
        const reportCategory = this.reportCategory(categoryProductCode, categoryId);

        ArrayUtils.move(reportCategory.comments, oldIndex, newIndex);

        this._saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory);
    },

    areAllReportCommentsChecked(categoryProductCode) {
        const orderId = store.order.id;
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        const docReportCategoriesMap = _.get(myAssessments, [orderId, "report", categoryProductCode, "categories"]);

        if (!docReportCategoriesMap) {
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
            sumOfRedPoints += reportCategory.comments[i].points;
        }

        return (sumOfAllPoints - sumOfRedPoints) / sumOfAllPoints * 100;
    },

    _calculateTopComments(categoryProductCode, categoryId) {
        const redCommentsForCategory = _.filter(this.listComments(categoryProductCode), ac => ac.categoryId === categoryId && ac.isRedSelected === true);
        const topCommentsForCategory = [];

        const loopCondition = function() {
            if (redCommentsForCategory.length < this.nbReportComments) {
                return topCommentsForCategory.length < redCommentsForCategory.length;
            }
            return topCommentsForCategory.length < this.nbReportComments;
        }.bind(this);

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

        return myAssessments && myAssessments[store.order.id] ? myAssessments[store.order.id].listComments : null;
    },

    _saveListCommentsInLocalStorage(comments) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments) || {};
        const orderId = store.order.id;

        myAssessments[orderId] = myAssessments[orderId] || {};
        myAssessments[orderId].listComments = comments;

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    _defaultReportCategory(categoryProductCode, categoryId) {
        return {
            comments: this._calculateTopComments(categoryProductCode, categoryId)
        };
    },

    _saveReportOverallCommentInLocalStorage(categoryProductCode, commentText) {
        const orderId = store.order.id;
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        myAssessments[orderId].report = myAssessments[orderId].report || {};
        myAssessments[orderId].report[categoryProductCode] = myAssessments[orderId].report[categoryProductCode] || {};
        myAssessments[orderId].report[categoryProductCode].overallComment = commentText;

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
        const orderId = store.order.id;
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        myAssessments[orderId].report = myAssessments[orderId].report || {};
        myAssessments[orderId].report[categoryProductCode] = myAssessments[orderId].report[categoryProductCode] || {};
        myAssessments[orderId].report[categoryProductCode].categories = myAssessments[orderId].report[categoryProductCode].categories || {};
        myAssessments[orderId].report[categoryProductCode].categories[categoryId] = reportCategory;

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    _saveReportCommentInLocalStorage(categoryProductCode, comment) {
        const orderId = store.order.id;
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);
        const commentToUpdate = _.find(myAssessments[orderId].report[categoryProductCode].categories[comment.categoryId].comments, c => c.id === comment.id);

        if (commentToUpdate) {
            Object.assign(commentToUpdate, comment);
        } else {
            myAssessments[orderId].report[categoryProductCode].categories[comment.categoryId].comments.push(comment);
        }

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    _removeReportCommentFromLocalStorage(categoryProductCode, comment) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);
        const orderId = store.order.id;

        _.remove(myAssessments[orderId].report[categoryProductCode].categories[comment.categoryId].comments, c => c.id === comment.id);

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
    }

    // Instance
};

export {Assessment as default};
