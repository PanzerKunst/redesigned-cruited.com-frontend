"use strict";

CR.Controllers.Index = React.createClass({
    render: function() {
        return (
            <div id="content">
                <div id="page-header-bar">
                    <h1>DWS Test Client</h1>
                </div>
                <div className="with-circles">
                    <form>
                        <div className="form-group fg-file-upload" id="cv-form-group">
                            <label>Your CV</label>

                            <div>
                                <label className="btn btn-default btn-file-upload" htmlFor="cv">
                                    <input id="cv" type="file" accept=".doc, .docx, .pdf, .odt, .rtf" onChange={this._handleCvFileSelected} />
                                    Browse
                                </label>
                                <input type="text" className="form-control" disabled />
                            </div>
                            <p className="field-error" data-check="empty" />
                        </div>

                        <div className="form-group fg-file-upload" id="cover-letter-form-group">
                            <label>Your cover letter</label>

                            <div>
                                <label className="btn btn-default btn-file-upload" htmlFor="cover-letter">
                                    <input id="cover-letter" type="file" accept=".doc, .docx, .pdf, .odt, .rtf" onChange={this._handleCoverLetterFileSelected} />
                                    Browse
                                </label>
                                <input type="text" className="form-control" disabled />
                            </div>
                            <p className="field-error" data-check="empty" />
                        </div>

                        <div className="centered-contents">
                            <button type="button" className="btn btn-lg btn-primary" onClick={this._addDocs}>Add</button>
                            <button type="button" className="btn btn-lg btn-primary" onClick={this._editDocs}>Edit</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    },

    componentDidMount: function() {
        this._initElements();
    },

    _initElements: function() {
        this.$form = $("#content").find("form");

        this.$cvFormGroup = this.$form.children("#cv-form-group");
        this.$cvFileInput = this.$cvFormGroup.find("#cv");
        this.$cvFileNameInput = this.$cvFormGroup.find("input[type=text]");

        this.$coverLetterFormGroup = this.$form.children("#cover-letter-form-group");
        this.$coverLetterFileInput = this.$coverLetterFormGroup.find("#cover-letter");
        this.$coverLetterFileNameInput = this.$coverLetterFormGroup.find("input[type=text]");
    },

    _handleCvFileSelected: function() {
        this.cvFile = this.$cvFileInput[0].files[0];
        this.$cvFileNameInput.val(this.cvFile.name);
    },

    _handleCoverLetterFileSelected: function() {
        this.coverLetterFile = this.$coverLetterFileInput[0].files[0];
        this.$coverLetterFileNameInput.val(this.coverLetterFile.name);
    },

    _addDocs: function() {
        this._submit("POST", CR.httpStatusCodes.created);
    },

    _editDocs: function() {
        this._submit("PUT", CR.httpStatusCodes.ok);
    },

    _submit: function(method, expectedHttpStatusCode) {
        let formData = new FormData();
        formData.append("orderId", 1698);
        if (this.cvFile) {
            formData.append("cvFile", this.cvFile, this.cvFile.name);
        }
        if (this.coverLetterFile) {
            formData.append("coverLetterFile", this.coverLetterFile, this.coverLetterFile.name);
        }

        let type = method;
        let url = "http://localhost:9001/docs";

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
});
