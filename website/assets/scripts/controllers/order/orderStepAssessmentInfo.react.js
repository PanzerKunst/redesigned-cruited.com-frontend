"use strict";

CR.Controllers.OrderStepAssessmentInfo = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                linkedinAuthCodeRequestUrl: null,
                linkedinProfile: null,
                linkedinErrorMessage: null
            };
        },

        render: function() {
            if (!window.FormData) {
                return (<p style="color: red">Your browser is too old, it's not supported by our website</p>);  // TODO
            }

            return (
                <div id="content">
                    <div id="page-header-bar">
                        <h1>{CR.i18nMessages["order.assessmentInfo.title"]}</h1>
                    </div>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.assessmentInfo.subtitle"]}</span>

                        <CR.Controllers.OrderStepBreadcrumbs step={CR.Controllers.OrderCommon.steps.assessmentInfo} />

                        <form onSubmit={this._handleSubmit}>
                            {this._getSignInWithLinkedinFormGroup()}
                            {this._getCvFormGroup()}
                            {this._getCoverLetterFormGroup()}
                            {this._getOptionalInfoFormGroup()}
                            <div>
                                <div className="checkbox checkbox-primary">
                                    <input type="checkbox" id="accept-tos" />
                                    <label htmlFor="accept-tos" dangerouslySetInnerHTML={{__html: CR.i18nMessages["order.assessmentInfo.form.tos.text"]}} />
                                </div>
                                <p className="field-error" data-check="empty" />
                            </div>
                            <div className="centered-contents">
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.assessmentInfo.nextStepBtn.text"]}</button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        },

        componentDidUpdate: function() {
            this._initElements();
            this._initValidation();
        },

        _getSignInWithLinkedinFormGroup: function() {
            if (this.state.linkedinErrorMessage) {
                return (<p className="other-form-error shown-by-default">{this.state.linkedinErrorMessage}</p>);
            } else {
                let orderedLinkedin = _.find(CR.order.getProducts(), function(product) {
                    return product.code === CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW;
                });

                if (!this.state.linkedinAuthCodeRequestUrl || !orderedLinkedin) {
                    return null;
                }

                let formGroupContents = null;

                if (this.state.linkedinProfile) {
                    formGroupContents = (
                        <div>
                            <article className="linkedin-profile-sneak-peek">
                                <img src={this.state.linkedinProfile.pictureUrl} />
                                <span>{this.state.linkedinProfile.firstName} {this.state.linkedinProfile.lastName}</span>
                            </article>
                            <ol>
                                <li dangerouslySetInnerHTML={{__html: CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.check.step1.text"]}} />
                                <li dangerouslySetInnerHTML={{__html: CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.check.step2.text"]}} />
                            </ol>
                            <div className="checkbox checkbox-primary">
                                <input type="checkbox" id="linkedin-profile-checked" />
                                <label htmlFor="linkedin-profile-checked">{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.check.checkbox.label"]}</label>
                            </div>
                            <p className="field-error" data-check="empty" />
                        </div>
                    );
                } else {
                    formGroupContents = (
                        <div>
                            <a className="btn sign-in-with-linkedin" href={this.state.linkedinAuthCodeRequestUrl}>
                                <span>{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.signInBtn.text"]}</span>
                            </a>
                        </div>
                    );
                }

                return (
                    <div className="form-group" id="linkedin-profile-form-group">
                        <label className="for-required-field">{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.label"]}</label>

                        {formGroupContents}
                        <p className="other-form-error" id="not-signed-in-with-linkedin">{CR.i18nMessages["order.assessmentInfo.validation.notSignedIn"]}</p>
                    </div>
                );
            }
        },

        _getCvFormGroup: function() {
            let orderedCv = _.find(CR.order.getProducts(), function(product) {
                return product.code === CR.Models.Product.codes.CV_REVIEW;
            });

            if (!orderedCv) {
                return null;
            }

            let inputValue = CR.order ? CR.order.getCvFileName() : null;

            return (
                <div className="form-group fg-file-upload" id="cv-form-group">
                    <label className="for-required-field">{CR.i18nMessages["order.assessmentInfo.form.cvFile.label"]}</label>

                    <div>
                        <label className="btn btn-default btn-file-upload" htmlFor="cv">
                            <input type="file" id="cv" accept=".doc, .docx, .pdf, .odt, .rtf" onChange={this._handleCvFileSelected} />
                            {CR.i18nMessages["order.assessmentInfo.form.browseBtn.text"]}
                        </label>
                        <input type="text" className="form-control" id="cv-file-name" placeholder={CR.i18nMessages["order.assessmentInfo.form.cvFile.placeHolder"]} defaultValue={inputValue} disabled />
                    </div>
                    <p className="field-error" data-check="empty" />
                </div>
            );
        },

        _getCoverLetterFormGroup: function() {
            let orderedCoverLetter = _.find(CR.order.getProducts(), function(product) {
                return product.code === CR.Models.Product.codes.COVER_LETTER_REVIEW;
            });

            if (!orderedCoverLetter) {
                return null;
            }

            let inputValue = CR.order ? CR.order.getCoverLetterFileName() : null;

            return (
                <div className="form-group fg-file-upload" id="cover-letter-form-group">
                    <label className="for-required-field">{CR.i18nMessages["order.assessmentInfo.form.coverLetterFile.label"]}</label>

                    <div>
                        <label className="btn btn-default btn-file-upload" htmlFor="cover-letter">
                            <input type="file" id="cover-letter" accept=".doc, .docx, .pdf, .odt, .rtf" onChange={this._handleCoverLetterFileSelected} />
                            {CR.i18nMessages["order.assessmentInfo.form.browseBtn.text"]}
                        </label>
                        <input type="text" className="form-control" id="cover-letter-file-name" placeholder={CR.i18nMessages["order.assessmentInfo.form.coverLetterFile.placeHolder"]} defaultValue={inputValue} disabled />
                    </div>
                    <p className="field-error" data-check="empty" />
                </div>
            );
        },

        _getOptionalInfoFormGroup: function() {
            let positionSoughtFieldValue = CR.order ? CR.order.getSoughtPosition() : null;
            let employerSoughtFieldValue = CR.order ? CR.order.getSoughtEmployer() : null;
            let jobAdUrlFieldValue = CR.order ? CR.order.getJobAdUrl() : null;

            return (
                <fieldset>
                    <div className="form-group">
                        <label htmlFor="position-sought">{CR.i18nMessages["order.assessmentInfo.form.positionSought.label"]}</label>
                        <input type="text" className="form-control" id="position-sought" defaultValue={positionSoughtFieldValue} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="employer-sought">{CR.i18nMessages["order.assessmentInfo.form.employerSought.label"]}</label>
                        <input type="text" className="form-control" id="employer-sought" defaultValue={employerSoughtFieldValue} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="job-ad-url">{CR.i18nMessages["order.assessmentInfo.form.jobAdUrl.label"]}</label>
                        <input type="text" className="form-control" id="job-ad-url" defaultValue={jobAdUrlFieldValue} />
                        <p className="field-error" data-check="url">{CR.i18nMessages["order.assessmentInfo.validation.jobAdUrlIncorrect"]}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="customer-comment">{CR.i18nMessages["order.assessmentInfo.form.customerComment.label"]}</label>
                        <textarea className="form-control" id="customer-comment" maxLength="512" />
                        <p className="field-error" data-check="max-length">{CR.i18nMessages["order.assessmentInfo.validation.customerCommentTooLong"]}</p>
                    </div>
                </fieldset>
            );
        },

        _initElements: function() {
            this.$form = $("#content").find("form");

            this.$linkedinProfileFormGroup = this.$form.children("#linkedin-profile-form-group");
            this.$signInWithLinkedinBtn = this.$linkedinProfileFormGroup.find(".sign-in-with-linkedin");
            this.$notSignedInWithLinkedinError = this.$linkedinProfileFormGroup.find("#not-signed-in-with-linkedin");

            this.$cvFormGroup = this.$form.children("#cv-form-group");
            this.$cvFileField = this.$cvFormGroup.find("#cv");
            this.$cvFileNameField = this.$cvFormGroup.find("#cv-file-name");

            this.$coverLetterFormGroup = this.$form.children("#cover-letter-form-group");
            this.$coverLetterFileField = this.$coverLetterFormGroup.find("#cover-letter");
            this.$coverLetterFileNameField = this.$coverLetterFormGroup.find("#cover-letter-file-name");

            this.$positionSoughtField = this.$form.find("#position-sought");
            this.$employerSoughtField = this.$form.find("#employer-sought");
            this.$jobAdUrlField = this.$form.find("#job-ad-url");
            this.$customerCommentField = this.$form.find("#customer-comment");

            this.$submitBtn = this.$form.find("button[type=submit]");
        },

        _initValidation: function() {
            this.validator = CR.Services.Validator([
                "linkedin-profile-checked",
                "cv-file-name",
                "cover-letter-file-name",
                "job-ad-url",
                "customer-comment",
                "accept-tos"
            ]);
        },

        _handleCvFileSelected: function() {
            this.cvFile = this.$cvFileField[0].files[0];
            this.$cvFileNameField.val(this.cvFile.name);
            this.$cvFormGroup.removeClass("has-error");
        },

        _handleCoverLetterFileSelected: function() {
            this.coverLetterFile = this.$coverLetterFileField[0].files[0];
            this.$coverLetterFileNameField.val(this.coverLetterFile.name);
            this.$coverLetterFormGroup.removeClass("has-error");
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            this.validator.hideErrorMessage(this.$notSignedInWithLinkedinError);

            if (this._isSignInWithLinkedinBtnThere()) {
                if (this.validator.isValid()) {
                    this.$submitBtn.enableLoading();

                    let formData = new FormData();
                    formData.append("editionId", CR.order.getEdition().id);
                    formData.append("containedProductCodes", _.map(CR.order.getProducts(), "code"));
                    if (CR.order.getCoupon()) {
                        formData.append("couponCode", CR.order.getCoupon().code);
                    }
                    if (this.cvFile) {
                        formData.append("cvFile", this.cvFile, this.cvFile.name);
                    }
                    if (this.coverLetterFile) {
                        formData.append("coverLetterFile", this.coverLetterFile, this.coverLetterFile.name);
                    }

                    let positionSought = this.$positionSoughtField.val();
                    let employerSought = this.$employerSoughtField.val();
                    let jobAdUrl = this.$jobAdUrlField.val();
                    let customerComment = this.$customerCommentField.val();

                    if (positionSought) {
                        formData.append("positionSought", positionSought);
                    }
                    if (employerSought) {
                        formData.append("employerSought", employerSought);
                    }
                    if (jobAdUrl) {
                        formData.append("jobAdUrl", jobAdUrl);
                    }
                    if (customerComment) {
                        formData.append("customerComment", customerComment);
                    }

                    let type = "POST";
                    let url = "/api/orders";

                    let httpRequest = new XMLHttpRequest();
                    httpRequest.onreadystatechange = function() {
                        if (httpRequest.readyState === XMLHttpRequest.DONE) {
                            if (httpRequest.status === CR.httpStatusCodes.created) {
                                let order = JSON.parse(httpRequest.responseText);
                                CR.order.setId(order.id);
                                CR.order.setCvFileName(order.cvFileName);
                                CR.order.setCoverLetterFileName(order.coverLetterFileName);
                                CR.order.setSoughtPosition(order.positionSought);
                                CR.order.setSoughtEmployer(order.employerSought);
                                CR.order.setJobAdUrl(order.jobAdUrl);

                                location.href = "/order/create-account";
                            } else {
                                this.$submitBtn.disableLoading();
                                alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                            }
                        }
                    }.bind(this);
                    httpRequest.open(type, url);
                    httpRequest.send(formData);
                }
            } else {
                this.validator.showErrorMessage(this.$notSignedInWithLinkedinError);

                // We want to display other potential validation messages too
                this.validator.isValid();
            }
        },

        _isSignInWithLinkedinBtnThere: function() {
            return this.$signInWithLinkedinBtn.length === 0;
        }
    });

    c.init = function(i18nMessages, linkedinAuthCodeRequestUrl, linkedinProfile, linkedinErrorMessage) {
        CR.i18nMessages = i18nMessages;
        this.linkedinAuthCodeRequestUrl = linkedinAuthCodeRequestUrl;
        this.linkedinProfile = linkedinProfile;

        this.linkedinErrorMessage = linkedinErrorMessage;
        CR.order = CR.Models.Order(CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.order));

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            linkedinAuthCodeRequestUrl: this.linkedinAuthCodeRequestUrl,
            linkedinProfile: this.linkedinProfile,
            linkedinErrorMessage: this.linkedinErrorMessage
        });
    };
});
