"use strict";

CR.Controllers.OrderStepAssessmentInfo = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                linkedinAuthCodeRequestUrl: null,
                linkedinProfile: null,
                linkedinErrorMessage: null,
                account: null
            };
        },

        render: function() {
            if (!window.FormData) {
                return (<p style="color: red">Your browser is too old, it's not supported by our website</p>);  // TODO
            }

            if (!CR.order) {
                return null;
            }

            const positionSought = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.positionSought) || CR.order.getSoughtPosition();
            const employerSought = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.employerSought) || CR.order.getSoughtEmployer();
            const jobAdUrl = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.jobAdUrl) || CR.order.getJobAdUrl();
            const customerComment = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.customerComment) || CR.order.getCustomerComment();

            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["order.assessmentInfo.title"]}</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.assessmentInfo.subtitle"]}</span>

                        <CR.Controllers.OrderStepBreadcrumbs step={CR.Controllers.OrderCommon.steps.assessmentInfo} />

                        <form onSubmit={this._handleSubmit}>
                            <section id="documents-section" className="two-columns">
                                <header>
                                    <h2>{CR.i18nMessages["order.assessmentInfo.documentsSection.title"]}</h2>
                                    <p className="light-font">{CR.i18nMessages["order.assessmentInfo.documentsSection.subtitle"]}</p>
                                </header>
                                <div>
                                    {this._getSignInWithLinkedinFormGroup()}
                                    {this._getCvFormGroup()}
                                    {this._getCoverLetterFormGroup()}
                                    <p className="other-form-error" id="request-entity-too-large-error">{CR.i18nMessages["order.assessmentInfo.validation.requestEntityTooLarge"]}</p>
                                </div>
                            </section>
                            <section id="job-you-search-section" className="two-columns">
                                <header>
                                    <h2>{CR.i18nMessages["order.assessmentInfo.jobYouSearchSection.title"]}</h2>
                                    <p className="light-font">{CR.i18nMessages["order.assessmentInfo.jobYouSearchSection.subtitle"]}</p>
                                </header>
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="position-sought">{CR.i18nMessages["order.assessmentInfo.form.positionSought.label"]}</label>
                                        <input type="text" className="form-control" id="position-sought" maxLength="255" defaultValue={positionSought} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employer-sought">{CR.i18nMessages["order.assessmentInfo.form.employerSought.label"]}</label>
                                        <input type="text" className="form-control" id="employer-sought" maxLength="255" defaultValue={employerSought} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="job-ad-url">{CR.i18nMessages["order.assessmentInfo.form.jobAdUrl.label"]}</label>
                                        <input type="text" className="form-control" id="job-ad-url" maxLength="255" defaultValue={jobAdUrl} />
                                        <p className="field-error" data-check="url">{CR.i18nMessages["order.assessmentInfo.validation.jobAdUrlIncorrect"]}</p>
                                    </div>
                                </div>
                            </section>
                            <div className="form-group">
                                <label htmlFor="customer-comment">{CR.i18nMessages["order.assessmentInfo.form.customerComment.label"]}</label>
                                <textarea className="form-control" id="customer-comment" maxLength="512" defaultValue={customerComment} />
                                <p className="field-error" data-check="max-length">{CR.i18nMessages["order.assessmentInfo.validation.customerCommentTooLong"]}</p>
                            </div>
                            {this._getTosFormGroup()}
                            <div className="centered-contents">
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.assessmentInfo.submitBtn.text"]}</button>
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
            const orderedLinkedin = _.find(CR.order.getProducts(), function(product) {
                return product.code === CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW;
            });

            if (!this.state.linkedinAuthCodeRequestUrl || !orderedLinkedin) {
                return null;
            }

            const linkedinProfile = this.state.linkedinProfile;
            const linkedinAuthCodeRequestUrl = this.state.linkedinAuthCodeRequestUrl;
            let formGroupContents = null;

            if (linkedinProfile) {
                if (linkedinProfile.publicProfileUrl) {
                    let isLinkedinProfileIncomplete = false;
                    const errorMessages = [];

                    if (!linkedinProfile.summary) {
                        isLinkedinProfileIncomplete = true;
                        errorMessages.push(CR.i18nMessages["order.assessmentInfo.validation.linkedin.incompleteProfile.summaryMissing"]);
                    }
                    if (!linkedinProfile.positions || _.isEmpty(linkedinProfile.positions.values)) {
                        isLinkedinProfileIncomplete = true;
                        errorMessages.push(CR.i18nMessages["order.assessmentInfo.validation.linkedin.incompleteProfile.latestProfessionalExperienceMissing"]);
                    } else if (!linkedinProfile.positions.values[0].summary) {
                        isLinkedinProfileIncomplete = true;
                        errorMessages.push(CR.i18nMessages["order.assessmentInfo.validation.linkedin.incompleteProfile.latestProfessionalExperienceSummaryMissing"]);
                    }

                    if (isLinkedinProfileIncomplete) {
                        formGroupContents = (
                            <div>
                                <article id="linkedin-preview">
                                    <div className="profile-picture" style={{backgroundImage: "url(" + linkedinProfile.pictureUrl + ")"}} />
                                    <span>{linkedinProfile.firstName} {linkedinProfile.lastName}</span>
                                </article>
                                <p className="light-font">{CR.i18nMessages["order.assessmentInfo.validation.linkedin.incompleteProfile.label"]}</p>
                                <ul>
                                    {errorMessages.map(function(error) {
                                        const reactItemId = _.findIndex(errorMessages, function(e) {
                                            return e === error;
                                        });

                                        return <li key={reactItemId} className="light-font">{error}</li>;
                                    })}
                                </ul>
                                <div className="checkbox checkbox-primary">
                                    <input type="checkbox" id="linkedin-profile-checked" />
                                    <label htmlFor="linkedin-profile-checked">{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.check.incompleteProfile.checkbox.label"]}</label>
                                </div>
                                <p className="field-error" data-check="empty" />
                            </div>
                        );
                    } else {
                        formGroupContents = (
                            <div>
                                <article id="linkedin-preview">
                                    <div className="profile-picture" style={{backgroundImage: "url(" + linkedinProfile.pictureUrl + ")"}} />
                                    <span>{linkedinProfile.firstName} {linkedinProfile.lastName}</span>
                                </article>
                                <ol>
                                    <li className="light-font" dangerouslySetInnerHTML={{__html: CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.check.step1.text"]}} />
                                    <li className="light-font" dangerouslySetInnerHTML={{__html: CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.check.step2.text"]}} />
                                </ol>
                                <div className="checkbox checkbox-primary">
                                    <input type="checkbox" id="linkedin-profile-checked" />
                                    <label htmlFor="linkedin-profile-checked">{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.check.checkbox.label"]}</label>
                                </div>
                                <p className="field-error" data-check="empty" />
                            </div>
                        );
                    }
                } else {
                    formGroupContents = (
                        <div>
                            <a className="btn sign-in-with-linkedin" href={linkedinAuthCodeRequestUrl} onClick={this._saveTextFieldsInLocalStorage}>
                                <span>{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.signInBtn.text"]}</span>
                            </a>
                            <p className="other-form-error shown-by-default">{CR.i18nMessages["order.assessmentInfo.validation.linkedin.publicProfileUrlMissing"]}</p>
                        </div>
                    );
                }
            } else {
                const signInFailedParagraph = this.state.linkedinErrorMessage ? <p className="other-form-error shown-by-default">{this.state.linkedinErrorMessage}</p> : null;

                formGroupContents = (
                    <div>
                        <a className="btn sign-in-with-linkedin" href={linkedinAuthCodeRequestUrl} onClick={this._saveTextFieldsInLocalStorage}>
                            <span>{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.signInBtn.text"]}</span>
                        </a>
                        {signInFailedParagraph}
                    </div>
                );
            }

            return (
                <div className="form-group" id="linkedin-profile-form-group">
                    <label className="for-required-field">{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.label"]}</label>

                    {formGroupContents}
                    <p className="other-form-error" id="not-signed-in-with-linkedin">{CR.i18nMessages["order.assessmentInfo.validation.linkedin.notSignedIn"]}</p>
                </div>
            );
        },

        _getCvFormGroup: function() {
            const orderedCv = _.find(CR.order.getProducts(), function(product) {
                return product.code === CR.Models.Product.codes.CV_REVIEW;
            });

            if (!orderedCv) {
                return null;
            }

            return (
                <div className="form-group fg-file-upload" id="cv-form-group">
                    <label className="for-required-field">{CR.i18nMessages["order.assessmentInfo.form.cvFile.label"]}</label>

                    <div>
                        <label className="btn btn-default btn-file-upload" htmlFor="cv">
                            <input type="file" id="cv" accept=".doc, .docx, .pdf, .odt, .rtf" onChange={this._handleCvFileSelected} />
                            {CR.i18nMessages["order.assessmentInfo.form.browseBtn.text"]}
                        </label>
                        <input type="text" className="form-control" id="cv-file-name" placeholder={CR.i18nMessages["order.assessmentInfo.form.cvFile.placeHolder"]} defaultValue={CR.order.getCvFileName()} disabled />
                    </div>
                    <p className="field-error" data-check="empty" />
                </div>
            );
        },

        _getCoverLetterFormGroup: function() {
            const orderedCoverLetter = _.find(CR.order.getProducts(), function(product) {
                return product.code === CR.Models.Product.codes.COVER_LETTER_REVIEW;
            });

            if (!orderedCoverLetter) {
                return null;
            }

            return (
                <div className="form-group fg-file-upload" id="cover-letter-form-group">
                    <label className="for-required-field">{CR.i18nMessages["order.assessmentInfo.form.coverLetterFile.label"]}</label>

                    <div>
                        <label className="btn btn-default btn-file-upload" htmlFor="cover-letter">
                            <input type="file" id="cover-letter" accept=".doc, .docx, .pdf, .odt, .rtf" onChange={this._handleCoverLetterFileSelected} />
                            {CR.i18nMessages["order.assessmentInfo.form.browseBtn.text"]}
                        </label>
                        <input type="text" className="form-control" id="cover-letter-file-name" placeholder={CR.i18nMessages["order.assessmentInfo.form.coverLetterFile.placeHolder"]} defaultValue={CR.order.getCoverLetterFileName()} disabled />
                    </div>
                    <p className="field-error" data-check="empty" />
                </div>
            );
        },

        _getTosFormGroup: function() {
            if (this.state.account) {
                return null;
            }

            return (
                <div id="tos-wrapper" className="centered-contents">
                    <div className="checkbox checkbox-primary">
                        <input type="checkbox" id="accept-tos" defaultChecked={CR.order.isTosAccepted()} />
                        <label htmlFor="accept-tos" dangerouslySetInnerHTML={{__html: CR.i18nMessages["order.assessmentInfo.form.tos.text"]}} />
                    </div>
                    <p className="field-error" data-check="empty" />
                </div>
            );
        },

        _initElements: function() {
            this.$form = $("#content").find("form");

            this.$linkedinProfileFormGroup = this.$form.find("#linkedin-profile-form-group");
            this.$linkedinPreviewWrapper = this.$linkedinProfileFormGroup.children("div");
            this.$signInWithLinkedinBtn = this.$linkedinProfileFormGroup.find(".sign-in-with-linkedin");
            this.$notSignedInWithLinkedinError = this.$linkedinProfileFormGroup.find("#not-signed-in-with-linkedin");
            this.$linkedinProfileCheckedCheckboxWrapper = this.$linkedinPreviewWrapper.children(".checkbox");

            this.$cvFormGroup = this.$form.find("#cv-form-group");
            this.$cvFileField = this.$cvFormGroup.find("#cv");
            this.$cvFileNameField = this.$cvFormGroup.find("#cv-file-name");

            this.$coverLetterFormGroup = this.$form.find("#cover-letter-form-group");
            this.$coverLetterFileField = this.$coverLetterFormGroup.find("#cover-letter");
            this.$coverLetterFileNameField = this.$coverLetterFormGroup.find("#cover-letter-file-name");

            this.$requestEntityTooLargeError = this.$form.find("#request-entity-too-large-error");

            this.$positionSoughtField = this.$form.find("#position-sought");
            this.$employerSoughtField = this.$form.find("#employer-sought");
            this.$jobAdUrlField = this.$form.find("#job-ad-url");
            this.$customerCommentField = this.$form.find("#customer-comment");

            this.$submitBtn = this.$form.find("button[type=submit]");

            this.$headerBar = $("#container").children("header");
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
            this.validator.hideErrorMessage(this.$requestEntityTooLargeError);

            if (!this.state.linkedinErrorMessage && !this._isSignInWithLinkedinBtnThere()) {
                if (this.validator.isValid()) {
                    this.$submitBtn.enableLoading();

                    const formData = new FormData();
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

                    const positionSought = this.$positionSoughtField.val();
                    const employerSought = this.$employerSoughtField.val();
                    const jobAdUrl = this.$jobAdUrlField.val();
                    const customerComment = this.$customerCommentField.val();

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

                    const type = "POST";
                    const url = "/api/orders";

                    const httpRequest = new XMLHttpRequest();
                    httpRequest.onreadystatechange = function() {
                        if (httpRequest.readyState === XMLHttpRequest.DONE) {
                            if (httpRequest.status === CR.httpStatusCodes.created) {
                                const order = JSON.parse(httpRequest.responseText);
                                CR.order.setId(order.id);
                                CR.order.setIdInBase64(order.idInBase64);
                                CR.order.setCvFileName(order.cvFileName);
                                CR.order.setCoverLetterFileName(order.coverLetterFileName);
                                CR.order.setSoughtPosition(order.positionSought);
                                CR.order.setSoughtEmployer(order.employerSought);
                                CR.order.setJobAdUrl(order.jobAdUrl);
                                CR.order.setCustomerComment(order.customerComment);
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
                                if (!_.isEmpty(this.$coverLetterFormGroup)) {
                                    this.$coverLetterFormGroup.addClass("has-error");
                                }

                                if (!_.isEmpty(this.$cvFormGroup)) {
                                    this._scrollToElement(this.$cvFormGroup);
                                } else if (!_.isEmpty(this.$coverLetterFormGroup)) {
                                    this._scrollToElement(this.$coverLetterFormGroup);
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
                    if (this.$linkedinPreviewWrapper.hasClass("has-error") &&
                        this.$linkedinProfileCheckedCheckboxWrapper[0].getBoundingClientRect().top < this.$headerBar.height()) {
                        this._scrollToElement(this.$linkedinProfileFormGroup);
                    } else if (this.$cvFormGroup.hasClass("has-error")) {
                        this._scrollToElement(this.$cvFormGroup);
                    } else if (this.$coverLetterFormGroup.hasClass("has-error")) {
                        this._scrollToElement(this.$coverLetterFormGroup);
                    }
                }
            } else {
                this.validator.showErrorMessage(this.$notSignedInWithLinkedinError);

                // We want to display other potential validation messages too
                this.validator.isValid();

                this._scrollToElement(this.$linkedinProfileFormGroup);
            }
        },

        _isSignInWithLinkedinBtnThere: function() {
            return this.$signInWithLinkedinBtn.length === 1;
        },

        _scrollToElement: function($el) {
            const offset = $el[0].getBoundingClientRect().top - document.body.getBoundingClientRect().top - this.$headerBar.height();

            TweenLite.to(window, 1, {
                scrollTo: offset,
                ease: Power4.easeOut
            });
        },

        _saveTextFieldsInLocalStorage: function() {
            CR.Services.Browser.saveInLocalStorage(CR.localStorageKeys.positionSought, this.$positionSoughtField.val());
            CR.Services.Browser.saveInLocalStorage(CR.localStorageKeys.employerSought, this.$employerSoughtField.val());
            CR.Services.Browser.saveInLocalStorage(CR.localStorageKeys.jobAdUrl, this.$jobAdUrlField.val());
            CR.Services.Browser.saveInLocalStorage(CR.localStorageKeys.customerComment, this.$customerCommentField.val());
        }
    });

    c.init = function(i18nMessages, linkedinAuthCodeRequestUrl, linkedinProfile, linkedinErrorMessage, loggedInAccount) {
        CR.i18nMessages = i18nMessages;
        this.linkedinAuthCodeRequestUrl = linkedinAuthCodeRequestUrl;
        this.linkedinProfile = linkedinProfile;
        this.linkedinErrorMessage = linkedinErrorMessage;
        CR.loggedInAccount = loggedInAccount;

        const orderFromLocalStorage = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.order);
        CR.order = CR.Models.Order(orderFromLocalStorage);

        // We remove file names to avoid bugs of missing uploaded files
        CR.order.setCvFileName(null);
        CR.order.setCoverLetterFileName(null);

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
            linkedinErrorMessage: this.linkedinErrorMessage,
            account: this.account
        });
    };
});
