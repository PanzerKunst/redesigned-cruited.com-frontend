"use strict";

CR.Controllers.InterviewDateFormGroup = React.createClass({
    render: function() {
        const iti = CR.order.getInterviewTrainingInfo();
        const ddMmYyyy = iti ? iti.interviewDate : null;

        return (
            <div className="form-group" id="interview-date-form-group">
                <label>{CR.i18nMessages["order.interviewTraining.assessmentInfo.basicInfoSection.dateSelection.label"]}</label>

                <div className="input-group date">
                    <input type="text" className="form-control" defaultValue={ddMmYyyy} />
                    <div className="input-group-addon">
                        <i className="fa fa-calendar" aria-hidden="true" />
                    </div>
                </div>
            </div>);
    },

    componentDidMount: function() {
        this._initElements();

        this.$datePicker.datepicker({
            format: "dd-mm-yyyy",
            autoclose: true
        });
    },

    _initElements: function() {
        const $formGroup = $("#interview-date-form-group");

        this.$datePicker = $formGroup.find(".input-group.date");
    }
});
