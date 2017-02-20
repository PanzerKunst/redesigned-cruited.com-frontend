"use strict";

CR.Controllers.JobAdFormGroups = React.createClass({
    render: function() {
        // To avoid losing value if the page is reloaded, for example by a Sign in with LI
        const jobAdUrl = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.jobAdUrl) || CR.order.getJobAdUrl();

        return (
            <div>
                <div className="form-group" id="job-ad-url-form-group">
                    <label htmlFor="job-ad-url">{CR.i18nMessages["order.assessmentInfo.form.jobAdUrl.label"]}</label>
                    <input type="text" className="form-control" id="job-ad-url" maxLength="255" defaultValue={jobAdUrl} />
                    <p className="field-error" data-check="url">{CR.i18nMessages["order.assessmentInfo.validation.jobAdUrlIncorrect"]}</p>
                    <a onClick={this._handleJobAdAlternativeClicked}>{CR.i18nMessages["order.assessmentInfo.form.jobAdUrl.uploadInstead.text"]}</a>
                </div>
                <div className="form-group fg-file-upload" id="job-ad-file-upload-form-group">
                    <label>{CR.i18nMessages["order.assessmentInfo.form.jobAdFile.label"]}</label>

                    <div>
                        <label className={CR.Controllers.OrderCommon.getUploadLabelClasses()} htmlFor="job-ad-file">
                            <input type="file" id="job-ad-file" accept=".doc, .docx, .pdf, .odt, .rtf" onChange={this._handleJobAdFileSelected} />
                            {CR.i18nMessages["order.assessmentInfo.form.browseBtn.text"]}
                        </label>
                        <input type="text" className="form-control" id="job-ad-file-name" placeholder={CR.i18nMessages["order.assessmentInfo.form.jobAdFile.placeHolder"]} defaultValue={CR.order.getJobAdFileName()} disabled />
                    </div>
                    <a onClick={this._handleJobAdAlternativeClicked}>{CR.i18nMessages["order.assessmentInfo.form.jobAdFile.urlInstead.text"]}</a>
                </div>
            </div>);
    },

    componentDidMount: function() {
        this._initElements();

        if (CR.order.getJobAdFileName()) {
            this.$jobAdUrlFormGroup.hide();
            this.$jobAdFileUploadFormGroup.show();
        }
    },

    _initElements: function() {
        this.$jobAdUrlFormGroup = $("#job-ad-url-form-group");
        this.$jobAdUrlField = this.$jobAdUrlFormGroup.children("#job-ad-url");

        this.$jobAdFileUploadFormGroup = $("#job-ad-file-upload-form-group");
        this.$jobAdFileField = this.$jobAdFileUploadFormGroup.find("#job-ad-file");
        this.$jobAdFileNameField = this.$jobAdFileUploadFormGroup.find("#job-ad-file-name");
    },

    _handleJobAdFileSelected: function() {
        this.props.controller.jobAdFile = this.$jobAdFileField[0].files[0];
        this.$jobAdFileNameField.val(this.props.controller.jobAdFile.name);
    },

    _handleJobAdAlternativeClicked: function() {
        let $formGroupToFadeOut = this.$jobAdUrlFormGroup;
        let $formGroupToFadeIn = this.$jobAdFileUploadFormGroup;

        if (this.$jobAdFileUploadFormGroup.is(":visible")) {
            $formGroupToFadeOut = this.$jobAdFileUploadFormGroup;
            $formGroupToFadeIn = this.$jobAdUrlFormGroup;

            this.props.controller.jobAdFile = null;
            this.$jobAdFileNameField.val(null);
        } else {
            this.$jobAdUrlField.val(null);
        }

        $formGroupToFadeOut.fadeOut({
            animationDuration: CR.animationDurations.short,
            onComplete: function() {
                $formGroupToFadeIn.fadeIn({
                    animationDuration: CR.animationDurations.short
                });
            }
        });
    }
});
