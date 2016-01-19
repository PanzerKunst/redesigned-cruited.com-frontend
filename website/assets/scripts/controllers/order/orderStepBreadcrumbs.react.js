"use strict";

CR.Controllers.OrderStepBreadcrumbs = React.createClass({
    render: function() {
        return (
            <nav id="order-steps-breadcrumbs">
                {this._getStepOneTag()}
                {this._getStepTwoTag()}
                {this._getStepThreeTag()}
                {this._getStepFourTag()}
            </nav>
        );
    },

    _getStepOneTag: function() {
        let stepOneInnerTag = "<span>1. " + CR.i18nMessages["order.productSelection.title"] + "</span>";
        let stepOneTag = <a href="/order" dangerouslySetInnerHTML={{__html: stepOneInnerTag}} />;
        if (this.props.step === CR.Controllers.OrderCommon.steps.productSelection) {
            stepOneTag = <span dangerouslySetInnerHTML={{__html: stepOneInnerTag}} className="current-step" />;
        }

        return stepOneTag;
    },

    _getStepTwoTag: function() {
        let stepTwoInnerTag = "<span>2. " + CR.i18nMessages["order.assessmentInfo.title"] + "</span>";
        let stepTwoTag = <a href="/order/assessment-info" dangerouslySetInnerHTML={{__html: stepTwoInnerTag}} />;
        if (this.props.step === CR.Controllers.OrderCommon.steps.assessmentInfo) {
            stepTwoTag = <span dangerouslySetInnerHTML={{__html: stepTwoInnerTag}} className="current-step" />;
        } else if (this.props.step < CR.Controllers.OrderCommon.steps.assessmentInfo) {
            stepTwoTag = <span dangerouslySetInnerHTML={{__html: stepTwoInnerTag}} />;
        }

        return stepTwoTag;
    },

    _getStepThreeTag: function() {
        let stepThreeInnerTag = "<span>2. " + CR.i18nMessages["order.accountCreation.title"] + "</span>";
        let stepThreeTag = <a href="/order/create-account" dangerouslySetInnerHTML={{__html: stepThreeInnerTag}} />;
        if (this.props.step === CR.Controllers.OrderCommon.steps.accountCreation) {
            stepThreeTag = <span dangerouslySetInnerHTML={{__html: stepThreeInnerTag}} className="current-step" />;
        } else if (this.props.step < CR.Controllers.OrderCommon.steps.accountCreation) {
            stepThreeTag = <span dangerouslySetInnerHTML={{__html: stepThreeInnerTag}} />;
        }

        return stepThreeTag;
    },

    _getStepFourTag: function() {
        let stepFourInnerTag = "<span>2. " + CR.i18nMessages["order.payment.title"] + "</span>";
        let stepFourTag = <span dangerouslySetInnerHTML={{__html: stepFourInnerTag}} />;
        if (this.props.step === CR.Controllers.OrderCommon.steps.payment) {
            stepFourTag = <span dangerouslySetInnerHTML={{__html: stepFourInnerTag}} className="current-step" />;
        }

        return stepFourTag;
    }
});
