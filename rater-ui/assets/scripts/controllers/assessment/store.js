import Account from "../../models/account";
import Order from "../../models/order";
import Assessment from "../../models/assessment";

const store = {
    reactComponent: null,
    account: Object.assign(Object.create(Account), CR.ControllerData.account),
    config: CR.ControllerData.config,
    order: Object.assign(Object.create(Order), CR.ControllerData.order),
    allDefaultComments: CR.ControllerData.allDefaultComments,
    allCommentVariations: CR.ControllerData.allCommentVariations,
    assessment: Object.create(Assessment),

    init() {
        this._initCategories();
    },

    updateListComment(comment) {
        this.assessment.updateListComment(comment);
        this.reactComponent.forceUpdate();
    },

    updateTopComment(comment) {
        this.assessment.updateTopComment(comment);
        this.reactComponent.forceUpdate();
    },

    resetTopComment(comment) {
        this.assessment.resetTopComment(comment);
        this.reactComponent.forceUpdate();
    },

    removeTopComment(comment) {
        this.assessment.removeTopComment(comment);
        this.reactComponent.forceUpdate();
    },

    _initCategories() {
        const predicate = dc => dc.categoryId;

        this.categoryIds = {
            cv: _.uniq(this.allDefaultComments.cv.map(predicate)),
            coverLetter: _.uniq(this.allDefaultComments.coverLetter.map(predicate)),
            linkedinProfile: _.uniq(this.allDefaultComments.linkedinProfile.map(predicate))
        };

        this.reactComponent.forceUpdate();
    }
};

export {store as default};
