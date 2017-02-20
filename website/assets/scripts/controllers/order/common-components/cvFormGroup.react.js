"use strict";

CR.Controllers.CvFormGroup = React.createClass({
    render: function() {
        if (!this.props.orderedCv) {
            return null;
        }

        const isBtnDisabled = this.props.orderedLinkedin && !this.props.linkedinProfile;

        return (
            <div className="form-group fg-file-upload" id="cv-form-group">
                <label className="for-required-field">{CR.i18nMessages["order.assessmentInfo.form.cvFile.label"]}</label>

                <div>
                    <label className={CR.Controllers.OrderCommon.getUploadLabelClasses(isBtnDisabled)} htmlFor="cv">
                        <input type="file" id="cv" accept=".doc, .docx, .pdf, .odt, .rtf" onChange={this._handleCvFileSelected} disabled={isBtnDisabled} />
                        {CR.i18nMessages["order.assessmentInfo.form.browseBtn.text"]}
                    </label>
                    <input type="text" className="form-control" id="cv-file-name" placeholder={CR.i18nMessages["order.assessmentInfo.form.cvFile.placeHolder"]} defaultValue={CR.order.getCvFileName()} disabled />
                </div>
                {CR.Controllers.OrderCommon.getUploadDisabledExplanationParagraph(isBtnDisabled)}
                <p className="field-error" data-check="empty" />
            </div>);
    },

    componentDidUpdate: function() {
        this._initElements();
    },

    _initElements: function() {
        this.$cvFormGroup = $("#cv-form-group");
        this.$cvFileField = this.$cvFormGroup.find("#cv");
        this.$cvFileNameField = this.$cvFormGroup.find("#cv-file-name");
    },

    _handleCvFileSelected: function() {
        this.props.controller.cvFile = this.$cvFileField[0].files[0];
        this.$cvFileNameField.val(this.props.controller.cvFile.name);
        this.$cvFormGroup.removeClass("has-error");
    }
});
