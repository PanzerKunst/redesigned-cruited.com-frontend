"use strict";

CR.Controllers.EditInterviewTrainingOrder = P(function(c) {
    c.reactClass = React.createClass({
        render: function() {
            if (!window.FormData) {
                return (<p style="color: red">Your browser is too old, it's not supported by our website</p>);
            }

            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["order.interviewTraining.assessmentInfo.title"]}</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.interviewTraining.assessmentInfo.subtitle"]}</span>

                        <form onSubmit={this._handleSubmit}>
                            <section id="documents-section" className="two-columns">
                                <h2>{CR.i18nMessages["order.interviewTraining.assessmentInfo.basicInfoSection.title"]}</h2>
                                <div>
                                    <header>
                                        <p className="light-font">{CR.i18nMessages["order.interviewTraining.assessmentInfo.basicInfoSection.subtitle"]}</p>
                                    </header>
                                    <div>
                                        <CR.Controllers.CvFormGroup orderedCv={true} controller={this} />
                                        <CR.Controllers.JobAdFormGroups controller={this} />
                                        <p className="other-form-error" id="request-entity-too-large-error">{CR.i18nMessages["order.assessmentInfo.validation.requestEntityTooLarge"]}</p>
                                        <CR.Controllers.InterviewDateFormGroup />
                                    </div>
                                </div>
                            </section>

                            <CR.Controllers.InterviewTrainingContextSection />

                            <div className="centered-contents">
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.edit.saveBtn.text"]}</button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        },

        componentDidMount: function() {
            this._initElements();
            this._initValidation();
        },

        _initElements: function() {
            this.$form = $("#content").find("form");

            this.$requestEntityTooLargeError = this.$form.find("#request-entity-too-large-error");

            this.$jobAdUrlField = this.$form.find("#job-ad-url");

            this.$interviewDateField = this.$form.find("#interview-date-form-group").find("input[type=text]");

            this.$importantForTheRoleField = this.$form.find("#important-for-the-role");
            this.$latestInterviewField = this.$form.find("#latest-interview");
            this.$needForImprovementField = this.$form.find("#need-for-improvement");
            this.$challengingQuestionsField = this.$form.find("#challenging-questions");

            this.$submitBtn = this.$form.find("button[type=submit]");
        },

        _initValidation: function() {
            this.validator = CR.Services.Validator([
                "cv-file-name",
                "job-ad-url",
                "important-for-the-role",
                "latest-interview",
                "need-for-improvement",
                "challenging-questions"
            ]);
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            this.validator.hideErrorMessage(this.$requestEntityTooLargeError);

            if (this.validator.isValid()) {
                this.$submitBtn.enableLoading();

                const formData = new FormData();
                formData.append("id", CR.order.getId());

                if (this.cvFile) {
                    formData.append("cvFile", this.cvFile, this.cvFile.name);
                }

                const jobAdUrl = this.$jobAdUrlField.val();
                if (jobAdUrl) {
                    formData.append("jobAdUrl", jobAdUrl);
                }

                if (this.jobAdFile) {
                    formData.append("jobAdFile", this.jobAdFile, this.jobAdFile.name);
                }

                const ddMmYyyy = this.$interviewDateField.val().trim();
                let interviewMoment = null;

                if (ddMmYyyy) {
                    interviewMoment = moment(ddMmYyyy, "DD-MM-YYYY");
                    formData.append("interviewDate", interviewMoment.format("YYYY-MM-DD"));
                }

                const answerToQuestionImportantForTheRole = this.$importantForTheRoleField.val().trim();
                if (answerToQuestionImportantForTheRole) {
                    formData.append("answerToQuestionImportantForTheRole", answerToQuestionImportantForTheRole);
                }

                const answerToQuestionLatestInterview = this.$latestInterviewField.val().trim();
                if (answerToQuestionLatestInterview) {
                    formData.append("answerToQuestionLatestInterview", answerToQuestionLatestInterview);
                }

                const answerToQuestionNeedForImprovement = this.$needForImprovementField.val().trim();
                if (answerToQuestionNeedForImprovement) {
                    formData.append("answerToQuestionNeedForImprovement", answerToQuestionNeedForImprovement);
                }

                const answerToQuestionChallengingQuestions = this.$challengingQuestionsField.val().trim();
                if (answerToQuestionChallengingQuestions) {
                    formData.append("answerToQuestionChallengingQuestions", answerToQuestionChallengingQuestions);
                }

                const type = "PUT";
                const url = "/api/orders/interview-training";

                const httpRequest = new XMLHttpRequest();
                httpRequest.onreadystatechange = function() {
                    if (httpRequest.readyState === XMLHttpRequest.DONE) {
                        if (httpRequest.status === CR.httpStatusCodes.ok) {
                            location.href = "/";
                        } else {
                            this.$submitBtn.disableLoading();

                            // Doesn't work on test server: status == 0 :(
                            // if (httpRequest.status === CR.httpStatusCodes.requestEntityTooLarge) {

                            this.validator.showErrorMessage(this.$requestEntityTooLargeError);

                            if (!_.isEmpty(this.$cvFormGroup)) {
                                this.$cvFormGroup.addClass("has-error");
                            }

                            if (!_.isEmpty(this.$cvFormGroup)) {
                                CR.scrollToElement(this.$cvFormGroup);
                            }
                            /* } else {
                             alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                             } */
                        }
                    }
                }.bind(this);
                httpRequest.open(type, url);
                httpRequest.send(formData);
            } else {
                if (this.$cvFormGroup.hasClass("has-error")) {
                    CR.scrollToElement(this.$cvFormGroup);
                }
            }
        }
    });

    c.init = function(i18nMessages, order, iti) {
        CR.i18nMessages = i18nMessages;
        CR.order = CR.Models.Order(order);

        CR.order.setInterviewTrainingInfo({
            interviewDate: iti.interviewDate ? moment(iti.interviewDate).format("DD-MM-YYYY") : null,
            importantForTheRole: iti.importantForTheRole,
            latestInterview: iti.latestInterview,
            needForImprovement: iti.needForImprovement,
            challengingQuestions: iti.challengingQuestions
        });

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );
    };
});
