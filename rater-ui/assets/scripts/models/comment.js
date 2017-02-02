const Comment = {

    // Static
    isTextValidForReport(text) {
        return text.indexOf("[") === -1 && text.indexOf("]") === -1;
    },

    isCustom(comment) {
        return _.isNaN(_.toNumber(comment.id));
    }

    // Instance
};

export {Comment as default};
