CR.Controllers.EditOrder = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState() {
            return {
                order: null
            };
        },

        render() {
            if (!window.FormData) {
                return (<p style="color: red">Your browser is too old, it's not supported by our website</p>);
            }

            if (!this.state.order) {
                return null;
            }

            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["order.assessmentInfo.title"]}</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.assessmentInfo.subtitle"]}</span>

                        <form onSubmit={this._handleSubmit}>
                            {this._getDocumentsSection()}
                            <section id="job-you-search-section" className="two-columns">
                                <header>
                                    <h2>{CR.i18nMessages["order.assessmentInfo.jobYouSearchSection.title"]}</h2>
                                    <p className="light-font">{CR.i18nMessages["order.assessmentInfo.jobYouSearchSection.subtitle"]}</p>
                                </header>
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="position-sought">{CR.i18nMessages["order.assessmentInfo.form.positionSought.label"]}</label>
                                        <input type="text" className="form-control" id="position-sought" defaultValue={this.state.order.getSoughtPosition()} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employer-sought">{CR.i18nMessages["order.assessmentInfo.form.employerSought.label"]}</label>
                                        <input type="text" className="form-control" id="employer-sought" defaultValue={this.state.order.getSoughtEmployer()} />
                                    </div>
                                    <div className="form-group" id="job-ad-url-form-group">
                                        <label htmlFor="job-ad-url">{CR.i18nMessages["order.assessmentInfo.form.jobAdUrl.label"]}</label>
                                        <input type="text" className="form-control" id="job-ad-url" defaultValue={this.state.order.getJobAdUrl()} />
                                        <p className="field-error" data-check="url">{CR.i18nMessages["order.assessmentInfo.validation.jobAdUrlIncorrect"]}</p>
                                        <a onClick={this._handleJobAdAlternativeClicked}>{CR.i18nMessages["order.assessmentInfo.form.jobAdUrl.uploadInstead.text"]}</a>
                                    </div>
                                    <div className="form-group fg-file-upload" id="job-ad-file-upload-form-group">
                                        <label>{CR.i18nMessages["order.assessmentInfo.form.jobAdFile.label"]}</label>

                                        <div>
                                            <label className="btn btn-default btn-file-upload" htmlFor="job-ad-file">
                                                <input type="file" id="job-ad-file" accept=".doc, .docx, .pdf, .odt, .rtf" onChange={this._handleJobAdFileSelected} />
                                                {CR.i18nMessages["order.assessmentInfo.form.browseBtn.text"]}
                                            </label>
                                            <input type="text" className="form-control" id="job-ad-file-name" placeholder={CR.i18nMessages["order.assessmentInfo.form.jobAdFile.placeHolder"]} defaultValue={this.state.order.getJobAdFileName()} disabled />
                                        </div>
                                        <a onClick={this._handleJobAdAlternativeClicked}>{CR.i18nMessages["order.assessmentInfo.form.jobAdFile.urlInstead.text"]}</a>
                                    </div>
                                </div>
                            </section>
                            <div className="form-group">
                                <label htmlFor="customer-comment">{CR.i18nMessages["order.assessmentInfo.form.customerComment.label"]}</label>
                                <textarea className="form-control" id="customer-comment" maxLength="512" defaultValue={this.state.order.getCustomerComment()} />
                                <p className="field-error" data-check="max-length">{CR.i18nMessages["order.assessmentInfo.validation.customerCommentTooLong"]}</p>
                            </div>
                            <div className="centered-contents">
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.edit.saveBtn.text"]}</button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        },

        componentDidUpdate() {
            this._initElements();
            this._initValidation();

            if (this.state.order.getJobAdFileName()) {
                this.$jobAdUrlFormGroup.hide();
                this.$jobAdFileUploadFormGroup.show();
            }
        },

        _initElements() {
            this.$form = $("#content").find("form");

            this.$cvFormGroup = this.$form.find("#cv-form-group");
            this.$cvFileField = this.$cvFormGroup.find("#cv");
            this.$cvFileNameField = this.$cvFormGroup.find("#cv-file-name");

            this.$coverLetterFormGroup = this.$form.find("#cover-letter-form-group");
            this.$coverLetterFileField = this.$coverLetterFormGroup.find("#cover-letter");
            this.$coverLetterFileNameField = this.$coverLetterFormGroup.find("#cover-letter-file-name");

            this.$positionSoughtField = this.$form.find("#position-sought");
            this.$employerSoughtField = this.$form.find("#employer-sought");

            this.$jobAdUrlFormGroup = this.$form.find("#job-ad-url-form-group");
            this.$jobAdUrlField = this.$jobAdUrlFormGroup.children("#job-ad-url");

            this.$jobAdFileUploadFormGroup = this.$form.find("#job-ad-file-upload-form-group");
            this.$jobAdFileField = this.$jobAdFileUploadFormGroup.find("#job-ad-file");
            this.$jobAdFileNameField = this.$jobAdFileUploadFormGroup.find("#job-ad-file-name");

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
            this.orderedCv = _.find(this.state.order.getProducts(), function(product) {
                return product.code === CR.Models.Product.codes.CV_REVIEW;
            });

            this.orderedCoverLetter = _.find(this.state.order.getProducts(), function(product) {
                return product.code === CR.Models.Product.codes.COVER_LETTER_REVIEW;
            });

            if (!this.orderedCv && !this.orderedCoverLetter) {
                return null;
            }

            return (
                <section id="documents-section" className="two-columns">
                    <header>
                        <h2>{CR.i18nMessages["order.assessmentInfo.documentsSection.title"]}</h2>
                        <p className="light-font">{CR.i18nMessages["order.assessmentInfo.documentsSection.subtitle"]}</p>
                    </header>
                    <div>
                        {this._getCvFormGroup()}
                        {this._getCoverLetterFormGroup()}
                    </div>
                </section>
            );
        },

        _getCvFormGroup() {
            if (!this.orderedCv) {
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
                        <input type="text" className="form-control" id="cv-file-name" placeholder={CR.i18nMessages["order.assessmentInfo.form.cvFile.placeHolder"]} defaultValue={this.state.order.getCvFileName()} disabled />
                    </div>
                    <p className="field-error" data-check="empty" />
                </div>
            );
        },

        _getCoverLetterFormGroup() {
            if (!this.orderedCoverLetter) {
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
                        <input type="text" className="form-control" id="cover-letter-file-name" placeholder={CR.i18nMessages["order.assessmentInfo.form.coverLetterFile.placeHolder"]} defaultValue={this.state.order.getCoverLetterFileName()} disabled />
                    </div>
                    <p className="field-error" data-check="empty" />
                </div>
            );
        },

        _handleCvFileSelected() {
            this.cvFile = this.$cvFileField[0].files[0];
            this.$cvFileNameField.val(this.cvFile.name);
            this.$cvFormGroup.removeClass("has-error");
        },

        _handleCoverLetterFileSelected() {
            this.coverLetterFile = this.$coverLetterFileField[0].files[0];
            this.$coverLetterFileNameField.val(this.coverLetterFile.name);
            this.$coverLetterFormGroup.removeClass("has-error");
        },

        _handleJobAdFileSelected() {
            this.jobAdFile = this.$jobAdFileField[0].files[0];
            this.$jobAdFileNameField.val(this.jobAdFile.name);
        },

        _handleJobAdAlternativeClicked() {
            let $formGroupToFadeOut = this.$jobAdUrlFormGroup;
            let $formGroupToFadeIn = this.$jobAdFileUploadFormGroup;

            if (this.$jobAdFileUploadFormGroup.is(":visible")) {
                $formGroupToFadeOut = this.$jobAdFileUploadFormGroup;
                $formGroupToFadeIn = this.$jobAdUrlFormGroup;

                this.jobAdFile = null;
                this.$jobAdFileNameField.val(null);
            } else {
                this.$jobAdUrlField.val(null);
            }

            $formGroupToFadeOut.fadeOut({
                animationDuration: CR.animationDurations.short,
                onComplete() {
                    $formGroupToFadeIn.fadeIn({
                        animationDuration: CR.animationDurations.short
                    });
                }
            });
        },

        _handleSubmit(e) {
            e.preventDefault();

            if (this.validator.isValid()) {
                this.$submitBtn.enableLoading();

                const formData = new FormData();

                formData.append("id", this.state.order.getId());

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
                if (this.jobAdFile) {
                    formData.append("jobAdFile", this.jobAdFile, this.jobAdFile.name);
                }
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
                            alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
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
        this.order = CR.Models.Order(order);

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            order: this.order
        });
    };
});
