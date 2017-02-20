"use strict";

CR.Controllers.EditOrder = P(function(c) {
    c.reactClass = React.createClass({
        render: function() {
            if (!window.FormData) {
                return (<p style="color: red">Your browser is too old, it's not supported by our website</p>);
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
                                    <CR.Controllers.PositionSoughtFormGroup />
                                    <CR.Controllers.EmployerSoughtFormGroup />
                                    <CR.Controllers.JobAdFormGroups controller={this} />
                                </div>
                            </section>
                            <CR.Controllers.CustomerCommentFormGroup />
                            <div className="centered-contents">
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.edit.saveBtn.text"]}</button>
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

        _initElements: function() {
            this.$form = $("#content").find("form");

            this.$cvFormGroup = this.$form.find("#cv-form-group");
            this.$coverLetterFormGroup = this.$form.find("#cover-letter-form-group");

            this.$requestEntityTooLargeError = this.$form.find("#request-entity-too-large-error");  // TODO: handle

            this.$positionSoughtField = this.$form.find("#position-sought");
            this.$employerSoughtField = this.$form.find("#employer-sought");

            this.$jobAdUrlField = this.$form.find("#job-ad-url");

            this.$customerCommentField = this.$form.find("#customer-comment");

            this.$submitBtn = this.$form.find("button[type=submit]");
        },

        _initValidation: function() {
            this.validator = CR.Services.Validator([
                "cv-file-name",
                "cover-letter-file-name",
                "job-ad-url",
                "customer-comment"
            ]);
        },

        _getDocumentsSection: function() {
            this.orderedCv = _.find(CR.order.getProducts(), function(product) {
                return product.code === CR.Models.Product.codes.CV_REVIEW;
            });

            this.orderedCoverLetter = _.find(CR.order.getProducts(), function(product) {
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
                        <CR.Controllers.CvFormGroup orderedCv={this.orderedCv} controller={this} />
                        <CR.Controllers.CoverLetterFormGroup orderedCoverLetter={this.orderedCoverLetter} controller={this} />
                        <p className="other-form-error" id="request-entity-too-large-error">{CR.i18nMessages["order.assessmentInfo.validation.requestEntityTooLarge"]}</p>
                    </div>
                </section>
            );
        },

        _handleSubmit: function(e) {
            e.preventDefault();

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
        CR.order = CR.Models.Order(order);

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );
    };
});
