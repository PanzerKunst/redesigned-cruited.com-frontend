const Comment = {

    // Static
    isTextValidForReport(text) {
        return text.indexOf("[") === -1 && text.indexOf("]") === -1;
    }

    // Instance
};

export {Comment as default};
