CR.Controllers.EditOrder = P(function(c) {
    c.reactClass = React.createClass({
        render() {
            if (!window.FormData) {
                return (<p style="color: red">Your browser is too old, it's not supported by our website</p>);
            }

            let pageTitle = null;
            let jobYouSearchSectionTitle = null;

            if (CR.order.isOfClassicProducts()) {
                pageTitle = CR.Services.Browser.isSmallScreen() ? CR.i18nMessages["order.assessmentInfo.title"] : CR.i18nMessages["order.assessmentInfo.title.largeScreen"];
                jobYouSearchSectionTitle = CR.i18nMessages["order.assessmentInfo.jobYouSearchSection.title"];
            } else if (CR.order.isForConsultant()) {
                pageTitle = CR.Services.Browser.isSmallScreen() ? CR.i18nMessages["order.assessmentInfo.title.consult"] : CR.i18nMessages["order.assessmentInfo.title.consult.largeScreen"];
                jobYouSearchSectionTitle = CR.i18nMessages["order.assessmentInfo.jobYouSearchSection.title.consult"];
            }

            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{pageTitle}</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.assessmentInfo.subtitle"]}</span>

                        <form onSubmit={this._handleSubmit}>
                            {this._getDocumentsSection()}
                            <section id="job-you-search-section" className="two-columns">
                                <h2>{jobYouSearchSectionTitle}</h2>
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
                            <div className="centered-contents">
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.edit.saveBtn.text"]}</button>
                            </div>
                        </form>
                    </div>
                </div>);
        },

        componentDidMount() {
            this._initElements();
            this._initValidation();
        },

        _initElements() {
            this.$form = $("#content").find("form");

            this.$cvFormGroup = this.$form.find("#cv-form-group");
            this.$coverLetterFormGroup = this.$form.find("#cover-letter-form-group");

            this.$jobAdUrlFormGroup = this.$form.find("#job-ad-url-form-group");
            this.$jobAdUrlField = this.$jobAdUrlFormGroup.children("#job-ad-url");

            this.$jobAdFileUploadFormGroup = this.$form.find("#job-ad-file-upload-form-group");

            this.$requestEntityTooLargeError = this.$form.find("#request-entity-too-large-error");

            this.$positionSoughtField = this.$form.find("#position-sought");
            this.$employerSoughtField = this.$form.find("#employer-sought");

            this.$jobAdUrlField = this.$form.find("#job-ad-url");

            this.$customerCommentField = this.$form.find("#customer-comment");

            this.$submitBtn = this.$form.find("button[type=submit]");
        },

        _initValidation() {
            this.validator = CR.Services.Validator([
                "cv-file-name",
                "cover-letter-file-name",
                "job-ad-url",
                "customer-comment"
            ]);
        },

        _getDocumentsSection() {
            this.orderedCv = _.find(CR.order.getProducts(), p => p.code === CR.Models.Product.codes.CV_REVIEW || p.code === CR.Models.Product.codes.CV_REVIEW_CONSULT);
            this.orderedCoverLetter = _.find(CR.order.getProducts(), p => p.code === CR.Models.Product.codes.COVER_LETTER_REVIEW);

            if (!this.orderedCv && !this.orderedCoverLetter) {
                return null;
            }

            return (
                <section id="documents-section" className="two-columns">
                    <h2>{CR.i18nMessages["order.assessmentInfo.documentsSection.title"]}</h2>
                    <div>
                        <header>
                            <p className="light-font">{CR.i18nMessages["order.assessmentInfo.documentsSection.subtitle"]}</p>
                        </header>
                        <div>
                            <CR.Controllers.CvFormGroup orderedCv={this.orderedCv} controller={this}/>
                            <CR.Controllers.CoverLetterFormGroup orderedCoverLetter={this.orderedCoverLetter} controller={this}/>
                            <p className="other-form-error" id="request-entity-too-large-error">{CR.i18nMessages["order.assessmentInfo.validation.requestEntityTooLarge"]}</p>
                        </div>
                    </div>
                </section>
            );
        },

        _handleSubmit(e) {
            e.preventDefault();

            this.validator.hideErrorMessage(this.$requestEntityTooLargeError);

            if (this.validator.isValid()) {
                this.$submitBtn.enableLoading();

                const formData = new FormData();

                formData.append("id", CR.order.getId());

                if (this.cvFile) {
                    formData.append("cvFile", this.cvFile, this.cvFile.name);
                }
                if (this.coverLetterFile) {
                    formData.append("coverLetterFile", this.coverLetterFile, this.coverLetterFile.name);
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

                const type = "PUT";
                const url = "/api/orders";
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
            }
        }
    });

    c.init = function(i18nMessages, order) {
        CR.i18nMessages = i18nMessages;
        CR.order = CR.Models.Order(order);

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );
    };
});
