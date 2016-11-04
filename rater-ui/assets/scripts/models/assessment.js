import {localStorageKeys} from "../global";
import Category from "./category";
import Browser from "../services/browser";
import store from "../controllers/assessment/store";

const Assessment = {

    // Static
    nbTopComments: 3,

    updateListComment(comment) {
        const listComments = this._getListCommentsFromLocalStorage();
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
        let listComments = this._getListCommentsFromLocalStorage();

        if (!listComments) {
            listComments = _.cloneDeep(store.allDefaultComments);
            this._saveListCommentsInLocalStorage(listComments);
        }

        return listComments[categoryProductCode];
    },

    reportComments(categoryProductCode, categoryId) {
        const reportCommentsFromLocalStorage = this._getReportCommentsFromLocalStorage();

        if (reportCommentsFromLocalStorage && reportCommentsFromLocalStorage.haveBeenEdited) {
            return _.filter(reportCommentsFromLocalStorage[categoryProductCode], ac => ac.categoryId === categoryId);
        }

        const reportCommentsForCategory = this._calculateTopComments(categoryProductCode, categoryId);

        this._saveAllReportCommentsInLocalStorage(categoryProductCode, reportCommentsForCategory);

        return reportCommentsForCategory;
    },

    resetCategory(categoryId) {
        const categoryProductCode = Category.productCodeFromCategoryId(categoryId);
        const reportCommentsForCategory = this._calculateTopComments(categoryProductCode, categoryId);

        this._saveAllReportCommentsInLocalStorage(categoryProductCode, reportCommentsForCategory);
    },

    addOrUpdateReportComment(comment) {
        const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);

        this._saveReportCommentInLocalStorage(categoryProductCode, comment);
    },

    removeReportComment(comment) {
        const categoryProductCode = Category.productCodeFromCategoryId(comment.categoryId);

        this._removeReportCommentFromLocalStorage(categoryProductCode, comment);
    },

    areAllListCommentsSelected(categoryProductCode) {
        const listComments = this._getListCommentsFromLocalStorage();
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

    _calculateTopComments(categoryProductCode, categoryId) {
        const redCommentsForCategory = _.filter(this.listComments(categoryProductCode), ac => ac.categoryId === categoryId && ac.isRedSelected === true);
        const topCommentsForCategory = [];

        const loopCondition = function() {
            if (redCommentsForCategory.length < this.nbTopComments) {
                return topCommentsForCategory.length < redCommentsForCategory.length;
            }
            return topCommentsForCategory.length < this.nbTopComments;
        }.bind(this);

        while (loopCondition()) {
            const topComment = this._findRedCommentWithMostPointsInListExcept(redCommentsForCategory, topCommentsForCategory);

            if (topComment) {
                topCommentsForCategory.push(topComment);
            }
        }

        return topCommentsForCategory;
    },

    _getListCommentsForCategoryContainingCommentId(id, categoryProductCode) {
        const listCommentsForCategory = this.listComments(categoryProductCode);

        return _.find(listCommentsForCategory, c => c.id === id) ? listCommentsForCategory : null;
    },

    _getListCommentsFromLocalStorage() {
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

    _getReportCommentsFromLocalStorage() {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);
        const orderId = store.order.id;

        return myAssessments && myAssessments[orderId] ? myAssessments[orderId].topComments : null;
    },

    _saveAllReportCommentsInLocalStorage(categoryProductCode, comments) {
        const orderId = store.order.id;
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);

        myAssessments[orderId].topComments = myAssessments[orderId].topComments || {};

        // We remove the comments of the same ID
        comments.forEach(comment => _.remove(myAssessments[orderId].topComments[categoryProductCode], c => c.id === comment.id));

        myAssessments[orderId].topComments[categoryProductCode] = _.concat(myAssessments[orderId].topComments[categoryProductCode] || [], comments);

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    _saveReportCommentInLocalStorage(categoryProductCode, comment) {
        const orderId = store.order.id;
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);
        const commentToUpdate = _.find(myAssessments[orderId].topComments[categoryProductCode], c => c.id === comment.id);

        if (commentToUpdate) {
            Object.assign(commentToUpdate, comment);
        } else {
            myAssessments[orderId].topComments[categoryProductCode].push(comment);
        }

        myAssessments[orderId].topComments.haveBeenEdited = true;

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    _removeReportCommentFromLocalStorage(categoryProductCode, comment) {
        const myAssessments = Browser.getFromLocalStorage(localStorageKeys.myAssessments);
        const orderId = store.order.id;

        _.remove(myAssessments[orderId].topComments[categoryProductCode], c => c.id === comment.id);

        myAssessments[orderId].topComments.haveBeenEdited = true;

        Browser.saveInLocalStorage(localStorageKeys.myAssessments, myAssessments);
    },

    _findRedCommentWithMostPointsInListExcept(redCommentsForCategory, topCommentsForCategory) {
        let commentWithMostPoints = null;

        redCommentsForCategory.forEach(redComment => {
            const isCommentAlreadyInList = _.find(topCommentsForCategory, tc => tc.id === redComment.id);

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
