CR.Controllers.OrderStepBreadcrumbs = React.createClass({
    render() {
        return (
            <nav id="order-steps-breadcrumbs">
                {this._getStepOneTag()}
                {this._getStepTwoTag()}
                {this._getStepThreeTag()}
                {this._getStepFourTag()}
            </nav>
        );
    },

    _getStepOneTag() {
        const tagText = this._isInterviewTrainingOrdered() ? CR.i18nMessages["order.interviewTraining.title"] : CR.i18nMessages["order.productSelection.title"];

        const stepOneInnerTag = `<span>1. ${tagText}</span>`;
        let stepOneTag = <a href={this._baseUrl()} dangerouslySetInnerHTML={{__html: stepOneInnerTag}} />;

        if (this.props.step === CR.Controllers.OrderCommon.steps.productSelection) {
            stepOneTag = <span dangerouslySetInnerHTML={{__html: stepOneInnerTag}} className="current-step" />;
        }

        return stepOneTag;
    },

    _getStepTwoTag() {
        const tagText = this._isInterviewTrainingOrdered() ? CR.i18nMessages["order.interviewTraining.assessmentInfo.title"] : CR.i18nMessages["order.assessmentInfo.title"];

        const stepTwoInnerTag = `<span>2. ${tagText}</span>`;
        let stepTwoTag = <a href={`${this._baseUrl()}/assessment-info`} dangerouslySetInnerHTML={{__html: stepTwoInnerTag}} />;

        if (this.props.step === CR.Controllers.OrderCommon.steps.assessmentInfo) {
            stepTwoTag = <span dangerouslySetInnerHTML={{__html: stepTwoInnerTag}} className="current-step" />;
        } else if (this.props.step < CR.Controllers.OrderCommon.steps.assessmentInfo) {
            stepTwoTag = <span dangerouslySetInnerHTML={{__html: stepTwoInnerTag}} />;
        }

        return stepTwoTag;
    },

    _getStepThreeTag() {
        const stepThreeInnerTag = `<span>3. ${CR.i18nMessages["order.accountCreation.title"]}</span>`;

        // If current step is after, and user not logged-in
        let stepThreeTag = <a href="/order/create-account" dangerouslySetInnerHTML={{__html: stepThreeInnerTag}} />;

        if (CR.loggedInAccount) {

            // If current step is after, and user logged-in
            stepThreeTag = <a className="disabled" dangerouslySetInnerHTML={{__html: stepThreeInnerTag}} />;

            // If current step is equals
            if (this.props.step === CR.Controllers.OrderCommon.steps.accountCreation) {
                stepThreeTag = <span dangerouslySetInnerHTML={{__html: stepThreeInnerTag}} className="current-step disabled" />;
            } else if (this.props.step < CR.Controllers.OrderCommon.steps.accountCreation) {  // If current step is before
                stepThreeTag = <span dangerouslySetInnerHTML={{__html: stepThreeInnerTag}} className="disabled" />;
            }
        } else {

            // If current step is equals
            if (this.props.step === CR.Controllers.OrderCommon.steps.accountCreation) {
                stepThreeTag = <span dangerouslySetInnerHTML={{__html: stepThreeInnerTag}} className="current-step" />;
            } else if (this.props.step < CR.Controllers.OrderCommon.steps.accountCreation) {  // If current step is before
                stepThreeTag = <span dangerouslySetInnerHTML={{__html: stepThreeInnerTag}} />;
            }
        }

        return stepThreeTag;
    },

    _getStepFourTag() {
        const stepFourInnerTag = `<span>4. ${CR.i18nMessages["order.payment.title"]}</span>`;
        let stepFourTag = <span dangerouslySetInnerHTML={{__html: stepFourInnerTag}} />;

        if (this.props.step === CR.Controllers.OrderCommon.steps.payment) {
            stepFourTag = <span dangerouslySetInnerHTML={{__html: stepFourInnerTag}} className="current-step" />;
        }

        return stepFourTag;
    },

    _baseUrl() {
        return this._isInterviewTrainingOrdered() ? "/order/interview-training" : "/order";
    },

    _isInterviewTrainingOrdered() {
        return _.find(CR.order.getProducts(), p => p.code === CR.Models.Product.codes.INTERVIEW_TRAINING) !== undefined;    // eslint-disable-line no-undefined
    }
});
