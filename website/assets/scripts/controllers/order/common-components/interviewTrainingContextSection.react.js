"use strict";

CR.Controllers.InterviewTrainingContextSection = React.createClass({
    render: function() {
        return (
            <section id="context-section" className="two-columns">
                <header>
                    <h2>{CR.i18nMessages["order.interviewTraining.assessmentInfo.contextSection.title"]}</h2>
                    <p className="light-font">{CR.i18nMessages["order.interviewTraining.assessmentInfo.contextSection.subtitle"]}</p>
                </header>
                <div>
                    <div className="form-group">
                        <label htmlFor="important-for-the-role">{CR.i18nMessages["order.interviewTraining.assessmentInfo.contextSection.importantForTheRole.label"]}</label>
                        <textarea className="form-control" id="important-for-the-role" maxLength="1900" />
                        <p className="field-error" data-check="max-length">{CR.i18nMessages["order.interviewTraining.assessmentInfo.contextSection.validation.textTooLong"]}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="latest-interview">{CR.i18nMessages["order.interviewTraining.assessmentInfo.contextSection.latestInterview.label"]}</label>
                        <textarea className="form-control" id="latest-interview" maxLength="1900" />
                        <p className="field-error" data-check="max-length">{CR.i18nMessages["order.interviewTraining.assessmentInfo.contextSection.validation.textTooLong"]}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="need-for-improvement">{CR.i18nMessages["order.interviewTraining.assessmentInfo.contextSection.needForImprovement.label"]}</label>
                        <textarea className="form-control" id="need-for-improvement" maxLength="1900" />
                        <p className="field-error" data-check="max-length">{CR.i18nMessages["order.interviewTraining.assessmentInfo.contextSection.validation.textTooLong"]}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="challenging-questions">{CR.i18nMessages["order.interviewTraining.assessmentInfo.contextSection.challengingQuestions.label"]}</label>
                        <textarea className="form-control" id="challenging-questions" maxLength="1900" />
                        <p className="field-error" data-check="max-length">{CR.i18nMessages["order.interviewTraining.assessmentInfo.contextSection.validation.textTooLong"]}</p>
                    </div>
                </div>
            </section>);
    }
});
