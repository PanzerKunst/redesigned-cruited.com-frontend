"use strict";

CR.Controllers.InterviewDateFormGroup = React.createClass({
    render: function() {
        return (
            <div className="form-group" ref="formGroup">
                <label>{CR.i18nMessages["order.interviewTraining.assessmentInfo.basicInfoSection.dateSelection.label"]}</label>

                <div className="input-group date">
                    <input type="text" className="form-control" />
                    <div className="input-group-addon">
                        <i className="fa fa-calendar" aria-hidden="true" />
                    </div>
                </div>
            </div>);
    },

    componentDidMount: function() {
        this._initElements();

        this.$datePicker.datepicker({
            format: "dd-mm-yyyy"
        });
    },

    _initElements: function() {
        const $formGroup = $(ReactDOM.findDOMNode(this.refs.formGroup));

        this.$datePicker = $formGroup.find(".input-group.date");
    }
});
