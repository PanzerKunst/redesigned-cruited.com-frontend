CR.Controllers.OrderStepAssessmentInfo = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState() {
            return {
                linkedinAuthCodeRequestUrl: null,
                linkedinProfile: null,
                linkedinErrorMessage: null
            };
        },

        render() {
            if (!window.FormData) {
                return (<p style="color: red">Your browser is too old, it's not supported by our website</p>);
            }

            if (!CR.order) {
                return null;
            }

            this.state.orderedLinkedin = _.find(CR.order.getProducts(), p => p.code === CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW);
            this.state.orderedCv = _.find(CR.order.getProducts(), p => p.code === CR.Models.Product.codes.CV_REVIEW);
            this.state.orderedCoverLetter = _.find(CR.order.getProducts(), p => p.code === CR.Models.Product.codes.COVER_LETTER_REVIEW);

            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["order.assessmentInfo.title"]}</h1>
                        </div>
                    </header>

                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.assessmentInfo.subtitle"]}</span>

                        <CR.Controllers.OrderStepBreadcrumbs step={CR.Controllers.OrderCommon.steps.assessmentInfo}/>

                        <form onSubmit={this._handleSubmit}>
                            <section id="documents-section" className="two-columns">
                                <h2>{CR.i18nMessages["order.assessmentInfo.documentsSection.title"]}</h2>
                                <div>
                                    <header>
                                        <p className="light-font">{CR.i18nMessages["order.assessmentInfo.documentsSection.subtitle"]}</p>
                                    </header>
                                    <div>
                                        {this._getSignInWithLinkedinFormGroup()}

                                        <CR.Controllers.CvFormGroup orderedCv={this.state.orderedCv} orderedLinkedin={this.state.orderedLinkedin} linkedinProfile={this.state.linkedinProfile} controller={this}/>
                                        <CR.Controllers.CoverLetterFormGroup orderedCoverLetter={this.state.orderedCoverLetter} orderedLinkedin={this.state.orderedLinkedin} linkedinProfile={this.state.linkedinProfile} controller={this}/>
                                        <p className="other-form-error" id="request-entity-too-large-error">{CR.i18nMessages["order.assessmentInfo.validation.requestEntityTooLarge"]}</p>
                                    </div>
                                </div>
                            </section>

                            <section id="job-you-search-section" className="two-columns">
                                <h2>{CR.i18nMessages["order.assessmentInfo.jobYouSearchSection.title"]}</h2>
                                <div>
                                    <header>
                                        <p className="light-font">{CR.i18nMessages["order.assessmentInfo.jobYouSearchSection.subtitle"]}</p>
                                    </header>
                                    <div>
                                        <CR.Controllers.PositionSoughtFormGroup />
                                        <CR.Controllers.EmployerSoughtFormGroup />
                                        <CR.Controllers.JobAdFormGroups controller={this}/>
                                    </div>
                                </div>
                            </section>

                            <CR.Controllers.CustomerCommentFormGroup />
                            <CR.Controllers.TermsOfServiceFormSection />

                            <div className="centered-contents">
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.assessmentInfo.submitBtn.text"]}</button>
                            </div>
                        </form>
                    </div>
                </div>);
        },

        componentDidUpdate() {
            this._initElements();
            this._initValidation();
        },

        _initElements() {
            this.$form = $("#content").find("form");

            this.$linkedinProfileFormGroup = this.$form.find("#linkedin-profile-form-group");
            this.$linkedinPreviewWrapper = this.$linkedinProfileFormGroup.children("div");
            this.$signInWithLinkedinBtn = this.$linkedinProfileFormGroup.find(".sign-in-with-linkedin").not(".btn-xs");

            const $multiLanguageLinkedinProfileSection = this.$linkedinProfileFormGroup.find("#multi-language-linkedin-profile-section");

            this.$linkedinProfileLanguageSelectionPanel = $multiLanguageLinkedinProfileSection.children("div");
            this.$linkedinProfileLanguagePills = this.$linkedinProfileLanguageSelectionPanel.find("li");

            this.$notSignedInWithLinkedinError = this.$linkedinProfileFormGroup.find("#not-signed-in-with-linkedin");
            this.$linkedinProfileCheckedCheckboxWrapper = this.$linkedinPreviewWrapper.children(".checkbox");

            this.$cvFormGroup = this.$form.find("#cv-form-group");
            this.$coverLetterFormGroup = this.$form.find("#cover-letter-form-group");

            this.$requestEntityTooLargeError = this.$form.find("#request-entity-too-large-error");

            this.$positionSoughtField = this.$form.find("#position-sought");
            this.$employerSoughtField = this.$form.find("#employer-sought");

            this.$jobAdUrlField = this.$form.find("#job-ad-url");

            this.$customerCommentField = this.$form.find("#customer-comment");

            this.$submitBtn = this.$form.find("button[type=submit]");

            this.$headerBar = $("#container").children("header");
        },

        _initValidation() {
            this.validator = CR.Services.Validator([
                "linkedin-profile-checked",
                "cv-file-name",
                "cover-letter-file-name",
                "job-ad-url",
                "customer-comment",
                "accept-tos"
            ]);
        },

        _getSignInWithLinkedinFormGroup() {
            if (!this.state.linkedinAuthCodeRequestUrl || !this.state.orderedLinkedin) {
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
                                    <div className="profile-picture" style={{backgroundImage: "url(" + linkedinProfile.pictureUrl + ")"}}/>
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
                                <a className="btn btn-xs sign-in-with-linkedin" href={linkedinAuthCodeRequestUrl} onClick={this._saveTextFieldsInLocalStorage}>
                                    <span>{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.check.incompleteProfile.rereadBtn.text"]}</span>
                                </a>
                                <div className="checkbox checkbox-primary">
                                    <input type="checkbox" id="linkedin-profile-checked"/>
                                    <label htmlFor="linkedin-profile-checked">{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.check.incompleteProfile.checkbox.label"]}</label>
                                </div>
                                <p className="field-error" data-check="empty"/>
                            </div>);
                    } else {
                        formGroupContents = (
                            <div>
                                <article id="linkedin-preview">
                                    <div className="profile-picture" style={{backgroundImage: "url(" + linkedinProfile.pictureUrl + ")"}}/>
                                    <span>{linkedinProfile.firstName} {linkedinProfile.lastName}</span>
                                </article>

                                <ol>
                                    <li className="light-font" dangerouslySetInnerHTML={{__html: CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.check.step1.text"]}}/>
                                    <li className="light-font" dangerouslySetInnerHTML={{__html: CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.check.step2.text"]}}/>
                                </ol>

                                <div className="checkbox checkbox-primary">
                                    <input type="checkbox" id="linkedin-profile-checked"/>
                                    <label htmlFor="linkedin-profile-checked">{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.check.checkbox.label"]}</label>
                                </div>

                                <section id="multi-language-linkedin-profile-section">
                                    <a onClick={this._handleMultiLanguageLinkedinClick}>{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.multiLanguage.link.text"]}</a>
                                    <div>
                                        <p>{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.multiLanguage.selection.label"]}</p>
                                        <ul className="nav nav-pills">
                                            <li data-lang={CR.languageCodes.en}><a onClick={this._handleLinkedinProfileLanguageClick}>{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.multiLanguage.langBtn.en"]}</a></li>
                                            <li data-lang={CR.languageCodes.sv}><a onClick={this._handleLinkedinProfileLanguageClick}>{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.multiLanguage.langBtn.sv"]}</a></li>
                                        </ul>
                                    </div>
                                </section>

                                <p className="field-error" data-check="empty"/>
                            </div>);
                    }
                } else {
                    formGroupContents = (
                        <div>
                            <a className="btn sign-in-with-linkedin" href={linkedinAuthCodeRequestUrl} onClick={this._saveTextFieldsInLocalStorage}>
                                <span>{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.signInBtn.text"]}</span>
                            </a>
                            <p className="other-form-error shown-by-default">{CR.i18nMessages["order.assessmentInfo.validation.linkedin.publicProfileUrlMissing"]}</p>
                        </div>);
                }
            } else {
                const signInFailedParagraph = this.state.linkedinErrorMessage ? <p className="other-form-error shown-by-default">{this.state.linkedinErrorMessage}</p> : null;

                formGroupContents = (
                    <div>
                        <a className="btn sign-in-with-linkedin" href={linkedinAuthCodeRequestUrl} onClick={this._saveTextFieldsInLocalStorage}>
                            <span>{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.signInBtn.text"]}</span>
                        </a>
                        {signInFailedParagraph}
                    </div>);
            }

            return (
                <div className="form-group" id="linkedin-profile-form-group">
                    <label className="for-required-field">{CR.i18nMessages["order.assessmentInfo.form.linkedinProfile.label"]}</label>

                    {formGroupContents}
                    <p className="other-form-error" id="not-signed-in-with-linkedin">{CR.i18nMessages["order.assessmentInfo.validation.linkedin.notSignedIn"]}</p>
                </div>);
        },

        _handleMultiLanguageLinkedinClick() {
            if (this.$linkedinProfileLanguageSelectionPanel.is(":visible")) {
                this.$linkedinProfileLanguageSelectionPanel.hide();
            } else {
                this.$linkedinProfileLanguageSelectionPanel.fadeIn();
            }
        },

        _handleLinkedinProfileLanguageClick(e) {
            const $clickedPill = $(e.currentTarget).parent();

            this.$linkedinProfileLanguagePills.removeClass("active");
            $clickedPill.addClass("active");
        },

        _handleSubmit(e) {
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

                    let selectedLinkedinProfileLanguage = null;
                    const $selectedLinkedinProfileLanguagePill = this.$linkedinProfileLanguagePills.filter(".active");

                    if (!_.isEmpty($selectedLinkedinProfileLanguagePill)) {
                        selectedLinkedinProfileLanguage = $selectedLinkedinProfileLanguagePill.data("lang");
                    }

                    if (selectedLinkedinProfileLanguage) {
                        formData.append("linkedinProfileLanguage", selectedLinkedinProfileLanguage);
                    }

                    const positionSought = this.$positionSoughtField.val();

                    if (positionSought) {
                        formData.append("positionSought", positionSought);
                    }

                    const employerSought = this.$employerSoughtField.val();

                    if (employerSought) {
                        formData.append("employerSought", employerSought);
                    }

                    const jobAdUrl = this.$jobAdUrlField.val();

                    if (jobAdUrl) {
                        formData.append("jobAdUrl", jobAdUrl);
                    }

                    if (this.jobAdFile) {
                        formData.append("jobAdFile", this.jobAdFile, this.jobAdFile.name);
                    }

                    const customerComment = this.$customerCommentField.val();

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
                                CR.order.setJobAdFileName(order.jobAdFileName);
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
                                    CR.scrollToElement(this.$cvFormGroup);
                                } else if (!_.isEmpty(this.$coverLetterFormGroup)) {
                                    CR.scrollToElement(this.$coverLetterFormGroup);
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
                        CR.scrollToElement(this.$linkedinProfileFormGroup);
                    } else if (this.$cvFormGroup.hasClass("has-error")) {
                        CR.scrollToElement(this.$cvFormGroup);
                    } else if (this.$coverLetterFormGroup.hasClass("has-error")) {
                        CR.scrollToElement(this.$coverLetterFormGroup);
                    }
                }
            } else {
                this.validator.showErrorMessage(this.$notSignedInWithLinkedinError);

                // We want to display other potential validation messages too
                this.validator.isValid();

                CR.scrollToElement(this.$linkedinProfileFormGroup);
            }
        },

        _isSignInWithLinkedinBtnThere() {
            return this.$signInWithLinkedinBtn.length === 1;
        },

        _saveTextFieldsInLocalStorage() {
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
        CR.order.setJobAdFileName(null);

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
