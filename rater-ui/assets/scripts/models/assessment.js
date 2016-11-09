import {localStorageKeys} from "../global";
import Category from "./category";
import Browser from "../services/browser";
import ArrayUtils from "../services/array";
import store from "../controllers/assessment/store";

const Assessment = {

    // Static
    nbReportComments: 3,
    minScoreForWellDoneComment: 80,

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

    listComments(categoryProductCode) {
        let listComments = this._listCommentsFromLocalStorage();

        if (!listComments) {
            listComments = _.cloneDeep(store.allDefaultComments);
            this._saveListCommentsInLocalStorage(listComments);
        }

        return listComments[categoryProductCode];
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

    reportCategory(categoryProductCode, categoryId) {
        const orderId = store.order.id;
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        if (myAssessments[orderId].report &&
            myAssessments[orderId].report[categoryProductCode] &&
            myAssessments[orderId].report[categoryProductCode][categoryId]) {

            return myAssessments[orderId].report[categoryProductCode][categoryId];
        }

        const reportCategory = this._defaultReportCategory(categoryProductCode, categoryId);

        this._saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory);

        return reportCategory;
    },

    resetReportCategory(categoryId) {
        const categoryProductCode = Category.productCodeFromCategoryId(categoryId);
        const reportCategory = this._defaultReportCategory(categoryProductCode, categoryId);

        this._saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory);
    },

    updateReportCategory(category) {
        const categoryProductCode = Category.productCodeFromCategoryId(category.id);

        this._saveReportCategoryInLocalStorage(categoryProductCode, category.id, category);
    },

    addOrUpdateReportComment(comment) {
        const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);

        this._saveReportCommentInLocalStorage(categoryProductCode, comment);
    },

    removeReportComment(comment) {
        const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);

        this._removeReportCommentFromLocalStorage(categoryProductCode, comment);
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
        const reportCategory = this.reportCategory(categoryProductCode, categoryId);

        let sumOfAllPoints = 0;

        for (let i = 0; i < listCommentsForCategory.length; i++) {
            sumOfAllPoints += listCommentsForCategory[i].points;
        }

        let sumOfRedPoints = 0;

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

    /*
     * Structure of the report object:
     * {
     *   cv: {
     *     12: {
     *       comments: [],
     *       wellDoneComment: null
     *     }
     *     13: {
     *       comments: [],
     *       wellDoneComment: null
     *     }
     *     14: {
     *       comments: [],
     *       wellDoneComment: null
     *     }
     *   },
     *   coverLetter: {
     *     7: {
     *       comments: [],
     *       wellDoneComment: null
     *     }
     *   },
     *   linkedinProfile: {
     *     16: {
     *       comments: [],
     *       wellDoneComment: null
     *     }
     *   }
     * }
     */
    _saveReportCategoryInLocalStorage(categoryProductCode, categoryId, reportCategory) {
        const orderId = store.order.id;
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        myAssessments[orderId].report = myAssessments[orderId].report || {};
        myAssessments[orderId].report[categoryProductCode] = myAssessments[orderId].report[categoryProductCode] || {};
        myAssessments[orderId].report[categoryProductCode][categoryId] = reportCategory;

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    _saveReportCommentInLocalStorage(categoryProductCode, comment) {
        const orderId = store.order.id;
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);
        const commentToUpdate = _.find(myAssessments[orderId].report[categoryProductCode][comment.categoryId].comments, c => c.id === comment.id);

        if (commentToUpdate) {
            Object.assign(commentToUpdate, comment);
        } else {
            myAssessments[orderId].report[categoryProductCode][comment.categoryId].comments.push(comment);
        }

        myAssessments[orderId].report.hasBeenEdited = true;

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    _removeReportCommentFromLocalStorage(categoryProductCode, comment) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);
        const orderId = store.order.id;

        _.remove(myAssessments[orderId].report[categoryProductCode][comment.categoryId].comments, c => c.id === comment.id);

        myAssessments[orderId].report.hasBeenEdited = true;

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
