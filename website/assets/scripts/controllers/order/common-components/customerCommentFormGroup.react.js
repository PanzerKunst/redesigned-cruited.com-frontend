"use strict";

CR.Controllers.CustomerCommentFormGroup = React.createClass({
    render: function() {
        // To avoid losing value if the page is reloaded, for example by a Sign in with LI
        const customerComment = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.customerComment) || CR.order.getCustomerComment();

        return (
            <div className="form-group">
                <label htmlFor="customer-comment">{CR.i18nMessages["order.assessmentInfo.form.customerComment.label"]}</label>
                <textarea className="form-control" id="customer-comment" maxLength="480" defaultValue={customerComment} />
                <p className="field-error" data-check="max-length">{CR.i18nMessages["order.assessmentInfo.validation.customerCommentTooLong"]}</p>
            </div>);
    }
});
