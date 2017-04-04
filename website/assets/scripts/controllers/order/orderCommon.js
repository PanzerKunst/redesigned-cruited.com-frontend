CR.Controllers.OrderCommon = {
    steps: {
        productSelection: 1,
        assessmentInfo: 2,
        accountCreation: 3,
        payment: 4
    },

    getUploadLabelClasses(isBtnDisabled) {
        let classes = "btn btn-default btn-file-upload";

        if (isBtnDisabled) {
            classes += " disabled";
        }

        return classes;
    },

    getUploadDisabledExplanationParagraph(isBtnDisabled) {
        return isBtnDisabled ? <p className="sign-in-with-linkedin-first">{CR.i18nMessages["order.assessmentInfo.validation.signInWithLinkedinFirst"]}</p> : null;
    }
};
