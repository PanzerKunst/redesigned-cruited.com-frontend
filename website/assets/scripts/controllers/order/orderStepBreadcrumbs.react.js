"use strict";

CR.Controllers.OrderStepBreadcrumbs = React.createClass({
    render: function() {
        let stepTwoInnerTag = "<span>2. " + CR.i18nMessages["order.assessmentInfo.title"] + "</span>";
        let stepTwoTag = (<span dangerouslySetInnerHTML={{__html: stepTwoInnerTag}} />);
        if (this.props.step >= CR.Controllers.OrderCommon.steps.assessmentInfo) {
            stepTwoTag = (<a href="/order/assessment-info" dangerouslySetInnerHTML={{__html: stepTwoInnerTag}} />);
        }

        let stepThreeInnerTag = "<span>3. " + CR.i18nMessages["order.accountCreation.title"] + "</span>";
        let stepThreeTag = (<span dangerouslySetInnerHTML={{__html: stepThreeInnerTag}} />);
        if (this.props.step >= CR.Controllers.OrderCommon.steps.accountCreation) {
            stepThreeTag = (<a href="/order/create-account" dangerouslySetInnerHTML={{__html: stepThreeInnerTag}} />);
        }

        let stepFourInnerTag = "<span>4. " + CR.i18nMessages["order.payment.title"] + "</span>";
        let stepFourTag = (<span dangerouslySetInnerHTML={{__html: stepFourInnerTag}} />);
        if (this.props.step >= CR.Controllers.OrderCommon.steps.payment) {
            stepFourTag = (<a href="/order/payment" dangerouslySetInnerHTML={{__html: stepFourInnerTag}} />);
        }

        return (
            <nav id="order-steps-breadcrumbs">
                <a href="/order">
                    <span>1. {CR.i18nMessages["order.productSelection.title"]}</span>
                </a>
                {stepTwoTag}
                {stepThreeTag}
                {stepFourTag}
            </nav>
        );
    }
});
