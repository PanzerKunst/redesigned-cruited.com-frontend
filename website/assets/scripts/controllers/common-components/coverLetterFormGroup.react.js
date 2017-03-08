"use strict";

CR.Controllers.CoverLetterFormGroup = React.createClass({
    render: function() {
        if (!this.props.orderedCoverLetter) {
            return null;
        }

        const isBtnDisabled = this.props.orderedLinkedin && !this.props.linkedinProfile;

        return (
            <div className="form-group fg-file-upload" id="cover-letter-form-group">
                <label className="for-required-field">{CR.i18nMessages["order.assessmentInfo.form.coverLetterFile.label"]}</label>

                <div>
                    <label className={CR.Controllers.OrderCommon.getUploadLabelClasses(isBtnDisabled)} htmlFor="cover-letter">
                        <input type="file" id="cover-letter" accept=".doc, .docx, .pdf, .odt, .rtf" onChange={this._handleCoverLetterFileSelected} disabled={isBtnDisabled} />
                        {CR.i18nMessages["order.assessmentInfo.form.browseBtn.text"]}
                    </label>
                    <input type="text" className="form-control" id="cover-letter-file-name" placeholder={CR.i18nMessages["order.assessmentInfo.form.coverLetterFile.placeHolder"]} defaultValue={CR.order.getCoverLetterFileName()} disabled />
                </div>
                {CR.Controllers.OrderCommon.getUploadDisabledExplanationParagraph(isBtnDisabled)}
                <p className="field-error" data-check="empty" />
            </div>);
    },

    componentDidUpdate: function() {
        this._initElements();
    },

    _initElements: function() {
        this.$coverLetterFormGroup = $("#cover-letter-form-group");
        this.$coverLetterFileField = this.$coverLetterFormGroup.find("#cover-letter");
        this.$coverLetterFileNameField = this.$coverLetterFormGroup.find("#cover-letter-file-name");
    },

    _handleCoverLetterFileSelected: function() {
        this.props.controller.coverLetterFile = this.$coverLetterFileField[0].files[0];
        this.$coverLetterFileNameField.val(this.props.controller.coverLetterFile.name);
        this.$coverLetterFormGroup.removeClass("has-error");
    }
});
