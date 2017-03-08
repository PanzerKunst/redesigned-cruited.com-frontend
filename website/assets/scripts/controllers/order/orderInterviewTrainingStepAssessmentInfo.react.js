"use strict";

CR.Controllers.OrderInterviewTrainingStepAssessmentInfo = P(function(c) {
    c.reactClass = React.createClass({
        render: function() {
            if (!window.FormData) {
                return (<p style="color: red">Your browser is too old, it's not supported by our website</p>);
            }

            if (!CR.order) {
                return null;
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

                        <CR.Controllers.OrderStepBreadcrumbs step={CR.Controllers.OrderCommon.steps.assessmentInfo} />

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
                            <CR.Controllers.TermsOfServiceFormSection />

                            <div className="centered-contents">
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.assessmentInfo.submitBtn.text"]}</button>
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

            this.$cvFormGroup = this.$form.find("#cv-form-group");

            this.$jobAdUrlFormGroup = this.$form.find("#job-ad-url-form-group");
            this.$jobAdUrlField = this.$jobAdUrlFormGroup.children("#job-ad-url");

            this.$jobAdFileUploadFormGroup = this.$form.find("#job-ad-file-upload-form-group");

            this.$requestEntityTooLargeError = this.$form.find("#request-entity-too-large-error");
            this.$jobAdRequiredError = this.$form.find("#job-ad-required-error");

            const $interviewDateFormGroup = this.$form.find("#interview-date-form-group");
            this.$interviewDateField = $interviewDateFormGroup.find("input[type=text]");

            this.$importantForTheRoleField = this.$form.find("#important-for-the-role");
            this.$latestInterviewField = this.$form.find("#latest-interview");
            this.$needForImprovementField = this.$form.find("#need-for-improvement");
            this.$challengingQuestionsField = this.$form.find("#challenging-questions");

            this.$submitBtn = this.$form.find("button[type=submit]");

            this.$headerBar = $("#container").children("header");
        },

        _initValidation: function() {
            this.validator = CR.Services.Validator([
                "cv-file-name",
                "job-ad-url",
                "important-for-the-role",
                "latest-interview",
                "need-for-improvement",
                "challenging-questions",
                "accept-tos"
            ]);
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            this.validator.hideErrorMessage(this.$requestEntityTooLargeError);
            this.validator.hideErrorMessage(this.$jobAdRequiredError);

            if (this.validator.isValid()) {
                const jobAdUrl = this.$jobAdUrlField.val();

                if (!jobAdUrl && !this.jobAdFile) {
                    this.validator.showErrorMessage(this.$jobAdRequiredError);

                    if (this.$jobAdUrlFormGroup.is(":visible")) {
                        CR.scrollToElement(this.$jobAdUrlFormGroup);
                    } else {
                        CR.scrollToElement(this.$jobAdFileUploadFormGroup);
                    }
                } else {
                    this.$submitBtn.enableLoading();

                    const formData = new FormData();

                    formData.append("containedProductCodes", CR.Models.Product.codes.INTERVIEW_TRAINING);

                    if (CR.order.getCoupon()) {
                        formData.append("couponCode", CR.order.getCoupon().code);
                    }

                    formData.append("cvFile", this.cvFile, this.cvFile.name);

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

                    const type = "POST";
                    const url = "/api/orders/interview-training";

                    const httpRequest = new XMLHttpRequest();
                    httpRequest.onreadystatechange = function() {
                        if (httpRequest.readyState === XMLHttpRequest.DONE) {
                            if (httpRequest.status === CR.httpStatusCodes.created) {
                                const order = JSON.parse(httpRequest.responseText);
                                CR.order.setId(order.id);
                                CR.order.setIdInBase64(order.idInBase64);
                                CR.order.setCvFileName(order.cvFileName);
                                CR.order.setJobAdUrl(order.jobAdUrl);
                                CR.order.setJobAdFileName(order.jobAdFileName);
                                CR.order.setInterviewTrainingInfo({
                                    interviewDate: interviewMoment ? interviewMoment.format("YYYY-MM-DD") : null,
                                    importantForTheRole: answerToQuestionImportantForTheRole,
                                    latestInterview: answerToQuestionLatestInterview,
                                    needForImprovement: answerToQuestionNeedForImprovement,
                                    challengingQuestions: answerToQuestionChallengingQuestions
                                });
                                CR.order.setTosAccepted();
                                CR.order.saveInLocalStorage();

                                location.href = "/order/create-account";
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
                }
            } else {
                if (this.$cvFormGroup.hasClass("has-error")) {
                    CR.scrollToElement(this.$cvFormGroup);
                }
            }
        }
    });

    c.init = function(i18nMessages, loggedInAccount) {
        CR.i18nMessages = i18nMessages;
        CR.loggedInAccount = loggedInAccount;

        const orderFromLocalStorage = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.order);
        CR.order = CR.Models.Order(orderFromLocalStorage);

        // We remove file names to avoid bugs of missing uploaded files
        CR.order.setCvFileName(null);
        CR.order.setJobAdFileName(null);

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );
    };
});
