import Browser from "../services/browser";
import {localStorageKeys} from "../global";

import store from "../controllers/assessment/store";

const Assessment = {
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

    getListComments(categoryProductCode) {
        let listComments = this._getListCommentsFromLocalStorage();

        if (!listComments) {
            listComments = _.cloneDeep(store.allDefaultComments);
            this._saveListCommentsInLocalStorage(listComments);
        }

        return listComments[categoryProductCode];
    },

    _getListCommentsForCategoryContainingCommentId(id, categoryProductCode) {
        const listCommentsForCategory = this.getListComments(categoryProductCode);

        if (_.find(listCommentsForCategory, c => c.id === id)) {
            return listCommentsForCategory;
        }
        return null;
    },

    _getListCommentsFromLocalStorage() {
        return Browser.getFromLocalStorage(localStorageKeys.assessmentListComments);
    },

    _saveListCommentsInLocalStorage(comments) {
        Browser.saveInLocalStorage(localStorageKeys.assessmentListComments, comments);
    }
};

export {Assessment as default};
