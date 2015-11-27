"use strict";

CR.Controllers.Index = React.createClass({
    dwsUrlRoot: "http://localhost:9001/",

    render: function() {
        return (
            <div id="content">
                <div id="page-header-bar">
                    <h1>DWS Test Client</h1>
                </div>
                <div className="with-circles">
                    {this._getCreateOrderForm()}
                    {this._getFileUploadForm()}
                    {this._getDocLinksAndThumbs()}
                </div>
            </div>
        );
    },

    componentDidMount: function() {
        this._initElements();
        this._initValidation();
        this._initLinksAndThumbs();
    },

    _getCreateOrderForm: function() {
        return (
            <form id="create-order-form" onSubmit={this._cofSubmit}>
                <div className="form-group">
                    <label htmlFor="doc-types">Doc types</label>
                    <input type="text" id="doc-types" className="form-control" />
                    <p className="field-error" data-check="empty" />
                </div>

                <div className="form-group">
                    <label htmlFor="edition-id">Edition ID</label>
                    <input type="text" id="edition-id" className="form-control" />
                    <p className="field-error" data-check="empty" />
                </div>

                <div className="form-group">
                    <label htmlFor="session-id">Session ID</label>
                    <input type="text" id="session-id" className="form-control" />
                    <p className="field-error" data-check="empty" />
                </div>

                <div className="form-group">
                    <label htmlFor="position-sought">Position sought</label>
                    <input type="text" id="position-sought" className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="employer-sought">Employer sought</label>
                    <input type="text" id="employer-sought" className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="user-id">User Id</label>
                    <input type="text" id="user-id" className="form-control" />
                </div>

                <div className="form-group">
                    <label htmlFor="coupon-code">Coupon</label>
                    <input type="text" id="coupon-code" className="form-control" />
                </div>

                <div className="form-group fg-file-upload" data-id="cv-form-group">
                    <label>Your CV</label>

                    <div>
                        <label className="btn btn-default btn-file-upload">
                            <input type="file" accept=".doc, .docx, .pdf, .odt, .rtf" onChange={this._handleCofCvFileSelected} />
                        Browse
                        </label>
                        <input type="text" className="form-control" disabled />
                    </div>
                </div>

                <div className="form-group fg-file-upload" data-id="cover-letter-form-group">
                    <label>Your cover letter</label>

                    <div>
                        <label className="btn btn-default btn-file-upload">
                            <input type="file" accept=".doc, .docx, .pdf, .odt, .rtf" onChange={this._handleCofCoverLetterFileSelected} />
                        Browse
                        </label>
                        <input type="text" className="form-control" disabled />
                    </div>
                </div>

                <div className="centered-contents">
                    <button type="submit" className="btn btn-lg btn-primary">Create order</button>
                </div>
            </form>
        );
    },

    _getFileUploadForm: function() {
        return (
            <form id="file-upload-form">
                <div className="form-group">
                    <label htmlFor="order-id">Order ID</label>
                    <input type="text" id="order-id" className="form-control" defaultValue="1711" onChange={this._initLinksAndThumbs} />
                </div>

                <div className="form-group fg-file-upload" data-id="cv-form-group">
                    <label>Your CV</label>

                    <div>
                        <label className="btn btn-default btn-file-upload">
                            <input type="file" accept=".doc, .docx, .pdf, .odt, .rtf" onChange={this._handleFufCvFileSelected} />
                        Browse
                        </label>
                        <input type="text" className="form-control" disabled />
                    </div>
                </div>

                <div className="form-group fg-file-upload" data-id="cover-letter-form-group">
                    <label>Your cover letter</label>

                    <div>
                        <label className="btn btn-default btn-file-upload">
                            <input type="file" accept=".doc, .docx, .pdf, .odt, .rtf" onChange={this._handleFufCoverLetterFileSelected} />
                        Browse
                        </label>
                        <input type="text" className="form-control" disabled />
                    </div>
                </div>

                <div className="centered-contents">
                    <button type="button" className="btn btn-lg btn-primary" onClick={this._addDocs}>Add</button>
                    <button type="button" className="btn btn-lg btn-primary" onClick={this._editDocs}>Edit</button>
                </div>
            </form>
        );
    },

    _getDocLinksAndThumbs: function() {
        return (
            <section>
                <div>
                    <a id="cv-link">CV</a>
                    <a id="cover-letter-link">Cover Letter</a>
                    <a id="linkedin-profile-link">Linkedin profile</a>
                </div>
                <div>
                    <img id="cv-thumb" />
                    <img id="cover-letter-thumb" />
                    <img id="linkedin-profile-thumb" />
                </div>
            </section>
        );
    },

    _initElements: function() {
        this.$createOrderForm = $("#create-order-form");

        this.$docTypesInput = $("#doc-types");
        this.$editionIdInput = $("#edition-id");
        this.$sessionIdInput = $("#session-id");
        this.$positionSoughtInput = $("#position-sought");
        this.$employerSoughtInput = $("#employer-sought");
        this.$userIdInput = $("#user-id");
        this.$couponCodeInput = $("#coupon-code");

        this.$cofCvFormGroup = this.$createOrderForm.children().filter("[data-id=\"cv-form-group\"]");
        this.$cofCvFileInput = this.$cofCvFormGroup.find("input[type=file]");
        this.$cofCvFileNameInput = this.$cofCvFormGroup.find("input[type=text]");

        this.$cofCoverLetterFormGroup = this.$createOrderForm.children().filter("[data-id=\"cover-letter-form-group\"]");
        this.$cofCoverLetterFileInput = this.$cofCoverLetterFormGroup.find("input[type=file]");
        this.$cofCoverLetterFileNameInput = this.$cofCoverLetterFormGroup.find("input[type=text]");


        this.$fileUploadForm = $("#file-upload-form");

        this.$orderIdInput = $("#order-id");

        this.$fufCvFormGroup = this.$fileUploadForm.children().filter("[data-id=\"cv-form-group\"]");
        this.$fufCvFileInput = this.$fufCvFormGroup.find("input[type=file]");
        this.$fufCvFileNameInput = this.$fufCvFormGroup.find("input[type=text]");

        this.$fufCoverLetterFormGroup = this.$fileUploadForm.children().filter("[data-id=\"cover-letter-form-group\"]");
        this.$fufCoverLetterFileInput = this.$fufCoverLetterFormGroup.find("input[type=file]");
        this.$fufCoverLetterFileNameInput = this.$fufCoverLetterFormGroup.find("input[type=text]");

        this.$cvLink = $("#cv-link");
        this.$coverLetterLink = $("#cover-letter-link");
        this.$linkedinProfileLink = $("#linkedin-profile-link");

        this.$cvImg = $("#cv-thumb");
        this.$coverLetterImg = $("#cover-letter-thumb");
        this.$linkedinProfileImg = $("#linkedin-profile-thumb");
    },

    _initValidation: function() {
        this.validator = CR.Services.Validator([
            "doc-types",
            "edition-id",
            "session-id"
        ]);
    },

    _initLinksAndThumbs: function() {
        let orderId = this.$orderIdInput.val();

        let cvUrl = this.dwsUrlRoot + "docs/" + orderId + "/cv";
        let coverLetterUrl = this.dwsUrlRoot + "docs/" + orderId + "/cover-letter";
        let linkedinProfileUrl = this.dwsUrlRoot + "docs/" + orderId + "/linkedin-profile";

        this.$cvLink.attr("href", cvUrl);
        this.$coverLetterLink.attr("href", coverLetterUrl);
        this.$linkedinProfileLink.attr("href", linkedinProfileUrl);

        this.$cvImg.attr("href", cvUrl + "/thumbnail");
        this.$coverLetterImg.attr("href", coverLetterUrl + "/thumbnail");
        this.$linkedinProfileImg.attr("href", linkedinProfileUrl + "/thumbnail");
    },

    _handleCofCvFileSelected: function() {
        this.cofCvFile = this.$cofCvFileInput[0].files[0];
        this.$cofCvFileNameInput.val(this.cofCvFile.name);
    },

    _handleFufCvFileSelected: function() {
        this.fufCvFile = this.$fufCvFileInput[0].files[0];
        this.$fufCvFileNameInput.val(this.fufCvFile.name);
    },

    _handleCofCoverLetterFileSelected: function() {
        this.cofCoverLetterFile = this.$cofCoverLetterFileInput[0].files[0];
        this.$cofCoverLetterFileNameInput.val(this.cofCoverLetterFile.name);
    },

    _handleFufCoverLetterFileSelected: function() {
        this.fufCoverLetterFile = this.$fufCoverLetterFileInput[0].files[0];
        this.$fufCoverLetterFileNameInput.val(this.fufCoverLetterFile.name);
    },

    _cofSubmit: function(e) {
        e.preventDefault();

        if (this.validator.isValid()) {
            let formData = new FormData();
            formData.append("docTypes", this.$docTypesInput.val());
            formData.append("editionId", this.$editionIdInput.val());
            formData.append("sessionId", this.$sessionIdInput.val());

            let positionSought = this.$positionSoughtInput.val();
            if (positionSought) {
                formData.append("positionSought", positionSought);
            }

            let employerSought = this.$employerSoughtInput.val();
            if (employerSought) {
                formData.append("employerSought", employerSought);
            }

            let userId = this.$userIdInput.val();
            if (userId) {
                formData.append("userId", userId);
            }

            let couponCode = this.$couponCodeInput.val();
            if (couponCode) {
                formData.append("couponCode", couponCode);
            }

            if (this.cofCvFile) {
                formData.append("cvFile", this.cofCvFile, this.cofCvFile.name);
            }
            if (this.cofCoverLetterFile) {
                formData.append("coverLetterFile", this.cofCoverLetterFile, this.cofCoverLetterFile.name);
            }

            let type = "POST";
            let url = this.dwsUrlRoot + "order";

            let httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === CR.httpStatusCodes.created) {
                        alert("success! Order ID is '" + httpRequest.responseText + "'");
                    } else {
                        alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                    }
                }
            };
            httpRequest.open(type, url);
            httpRequest.send(formData);
        }
    },

    _addDocs: function() {
        this._fufSubmit("POST", CR.httpStatusCodes.created);
    },

    _editDocs: function() {
        this._fufSubmit("PUT", CR.httpStatusCodes.ok);
    },

    _fufSubmit: function(method, expectedHttpStatusCode) {
        if (this.fufCvFile || this.fufCoverLetterFile) {
            let formData = new FormData();
            formData.append("orderId", this.$orderIdInput.val());
            if (this.fufCvFile) {
                formData.append("cvFile", this.fufCvFile, this.fufCvFile.name);
            }
            if (this.fufCoverLetterFile) {
                formData.append("coverLetterFile", this.fufCoverLetterFile, this.fufCoverLetterFile.name);
            }

            let type = method;
            let url = this.dwsUrlRoot + "docs";

            let httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === expectedHttpStatusCode) {
                        alert("success!");
                    } else {
                        alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                    }
                }
            };
            httpRequest.open(type, url);
            httpRequest.send(formData);
        }
    }
});
