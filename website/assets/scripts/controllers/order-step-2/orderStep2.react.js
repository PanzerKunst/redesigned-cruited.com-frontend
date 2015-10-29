"use strict";

CR.Controllers.OrderStep2 = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                linkedinAuthCodeRequestUrl: null,
                linkedinProfile: null,
                linkedinErrorMessage: null
            };
        },

        render: function() {
            // TODO
            if (!window.FormData) {
                return (<p>Your browser is too old, it's not supported by our application</p>);
            }

            return (
                <div id="content">
                    <div id="page-header-bar">
                        <h1>{CR.i18nMessages["orderStep2.title"]}</h1>
                    </div>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["orderStep2.subtitle"]}</span>
                        <form ref="form" onSubmit={this._handleSubmit}>
                            {this._getSignInWithLinkedinFormGroup()}
                            {this._getCvFormGroup()}
                            {this._getCoverLetterFormGroup()}
                            <div className="checkbox checkbox-primary">
                                <input type="checkbox" id="accept-tos" />
                                <label htmlFor="accept-tos" dangerouslySetInnerHTML={{__html: CR.i18nMessages["orderStep2.form.tos.text"]}} />
                            </div>
                            <div className="centered-contents">
                                <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["orderStep2.nextStepBtn.text"]}</button>
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
            var orderedLinkedin = _.find(CR.order.getProducts(), function(product) {
                return product.code === CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW;
            });

            if (!this.state.linkedinAuthCodeRequestUrl || !orderedLinkedin) {
                return null;
            }

            var formGroupContents = null;

            if (this.state.linkedinProfile) {
                formGroupContents = (
                    <div>
                        <article>
                            <img src={this.state.linkedinProfile.pictureUrl} />
                            <span>{this.state.linkedinProfile.firstName} {this.state.linkedinProfile.lastName}</span>
                        </article>
                        <ol>
                            <li dangerouslySetInnerHTML={{__html: CR.i18nMessages["orderStep2.form.field.linkedinProfile.check.step1.text"]}} />
                            <li dangerouslySetInnerHTML={{__html: CR.i18nMessages["orderStep2.form.field.linkedinProfile.check.step2.text"]}} />
                        </ol>
                        <div className="checkbox checkbox-primary">
                            <input type="checkbox" id="linkedin-profile-checked" />
                            <label htmlFor="linkedin-profile-checked">{CR.i18nMessages["orderStep2.form.field.linkedinProfile.check.checkbox.label"]}</label>
                        </div>
                        <p className="field-error" data-check="empty" />
                    </div>
                    );
            } else {
                formGroupContents = (
                    <div>
                        <a className="btn sign-in-with-linkedin" href={this.state.linkedinAuthCodeRequestUrl}>
                            <span>{CR.i18nMessages["orderStep2.form.field.linkedinProfile.signInBtn.text"]}</span>
                        </a>
                    </div>
                    );
            }

            return (
                <div className="form-group" id="linkedin-profile-form-group">
                    <label className="for-required-field">{CR.i18nMessages["orderStep2.form.field.linkedinProfile.label"]}</label>

                    {formGroupContents}
                    <p className="field-error" id="not-signed-in-with-linkedin">{CR.i18nMessages["orderStep2.form.field.linkedinProfile.validation.notSignedIn"]}</p>
                </div>
                );
        },

        _getCvFormGroup: function() {
            var orderedCv = _.find(CR.order.getProducts(), function(product) {
                return product.code === CR.Models.Product.codes.CV_REVIEW;
            });

            if (!orderedCv) {
                return null;
            }

            return (
                <div className="form-group fg-file-upload" id="cv-form-group">
                    <label className="for-required-field">{CR.i18nMessages["orderStep2.form.field.cvFile.label"]}</label>

                    <div>
                        <label className="btn btn-default btn-file-upload" htmlFor="cv">
                            <input id="cv" type="file" accept=".doc, .docx, .pdf, .odt" onChange={this._handleCvFileSelected} />
                            {CR.i18nMessages["orderStep2.form.field.browseBtn.text"]}
                        </label>
                        <input type="text" className="form-control" placeholder={CR.i18nMessages["orderStep2.form.field.cvFile.placeHolder"]} disabled />
                    </div>
                    <p className="field-error" data-check="empty" />
                </div>
                );
        },

        _getCoverLetterFormGroup: function() {
            var orderedCoverLetter = _.find(CR.order.getProducts(), function(product) {
                return product.code === CR.Models.Product.codes.COVER_LETTER_REVIEW;
            });

            if (!orderedCoverLetter) {
                return null;
            }

            return (
                <div className="form-group fg-file-upload" id="cover-letter-form-group">
                    <label className="for-required-field">{CR.i18nMessages["orderStep2.form.field.coverLetterFile.label"]}</label>

                    <div>
                        <label className="btn btn-default btn-file-upload" htmlFor="cover-letter">
                            <input id="cover-letter" type="file" accept=".doc, .docx, .pdf, .odt" onChange={this._handleCoverLetterFileSelected} />
                            {CR.i18nMessages["orderStep2.form.field.browseBtn.text"]}
                        </label>
                        <input type="text" className="form-control" placeholder={CR.i18nMessages["orderStep2.form.field.coverLetterFile.placeHolder"]} disabled />
                    </div>
                    <p className="field-error" data-check="empty" />
                </div>
                );
        },

        _initElements: function() {
            this.$form = $(React.findDOMNode(this.refs.form));

            this.$linkedinProfileFormGroup = this.$form.children("#linkedin-profile-form-group");
            this.$signInWithLinkedinBtn = this.$linkedinProfileFormGroup.find(".sign-in-with-linkedin");
            this.$notSignedInWithLinkedinErrorMsg = this.$linkedinProfileFormGroup.find("#not-signed-in-with-linkedin");

            this.$cvFormGroup = this.$form.children("#cv-form-group");
            this.$cvFileInput = this.$cvFormGroup.find("#cv");
            this.$cvFileNameInput = this.$cvFormGroup.find("input[type=text]");

            this.$coverLetterFormGroup = this.$form.children("#cover-letter-form-group");
            this.$coverLetterFileInput = this.$coverLetterFormGroup.find("#cover-letter");
            this.$coverLetterFileNameInput = this.$coverLetterFormGroup.find("input[type=text]");
        },

        _initValidation: function() {
            this.validator = CR.Services.Validator([
                "linkedin-profile-checked",
                "cv",
                "cover-letter"
            ]);
        },

        _handleCvFileSelected: function() {
            this.cvFile = this.$cvFileInput[0].files[0];
            this.$cvFileNameInput.val(this.cvFile.name);
        },

        _handleCoverLetterFileSelected: function() {
            this.coverLetterFile = this.$coverLetterFileInput[0].files[0];
            this.$coverLetterFileNameInput.val(this.coverLetterFile.name);
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            this.validator.hideErrorMessage(this.$notSignedInWithLinkedinErrorMsg);

            if (this.validator.isValid() && this._isSignInWithLinkedinBtnValid()) {
                var formData = new FormData();
                if (this.cvFile) {
                    formData.append("cvFile", this.cvFile, this.cvFile.name);
                }
                if (this.coverLetterFile) {
                    formData.append("coverLetterFile", this.coverLetterFile, this.coverLetterFile.name);
                }

                var type = "POST";
                var url = "/api/orders";

                var httpRequest = new XMLHttpRequest();
                httpRequest.onreadystatechange = function() {
                    if (httpRequest.readyState === XMLHttpRequest.DONE) {
                        // TODO this.$addCouponBtn.disableLoading();

                        if (httpRequest.status === CR.httpStatusCodes.ok) {
                            // TODO: remove
                            console.log("success!");
                        } else {
                            alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                        }
                    }
                };
                httpRequest.open(type, url);
                httpRequest.send(formData);

            } else if (!this._isSignInWithLinkedinBtnValid()) {
                this.validator.showErrorMessage(this.$notSignedInWithLinkedinErrorMsg);
            }
        },

        _isSignInWithLinkedinBtnValid: function() {
            return this.$signInWithLinkedinBtn.length === 0;
        }
    });

    c.init = function(i18nMessages, linkedinAuthCodeRequestUrl, linkedinProfile, linkedinErrorMessage) {
        CR.i18nMessages = i18nMessages;
        this.linkedinAuthCodeRequestUrl = linkedinAuthCodeRequestUrl;
        this.linkedinProfile = JSON.parse(linkedinProfile);

        this.linkedinErrorMessage = linkedinErrorMessage;
        CR.order = CR.Models.Order(CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.order));

        this.reactInstance = React.render(
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
