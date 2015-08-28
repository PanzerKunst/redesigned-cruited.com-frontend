"use strict";

CR.Controllers.AddCustomTask = React.createClass({
    displayName: "AddCustomTask",

    render: function render() {
        return React.createElement(
            "div",
            { ref: "wrapper" },
            React.createElement(
                "a",
                { id: "add-custom-task-link", onClick: this._handleAddCustomTaskClick },
                "Add custom task"
            ),
            React.createElement(
                "form",
                { onSubmit: this._handleFormSubmit },
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { htmlFor: "tip" },
                        "Tip"
                    ),
                    React.createElement("textarea", { className: "form-control", id: "tip", maxLength: "512", onKeyUp: this._handleTextareaKeyUp }),
                    React.createElement(
                        "p",
                        { className: "field-error", "data-check": "max-length" },
                        "512 characters maximum"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { htmlFor: "question" },
                        "Question"
                    ),
                    React.createElement("textarea", { className: "form-control", id: "question", maxLength: "512", onKeyUp: this._handleTextareaKeyUp }),
                    React.createElement(
                        "p",
                        { className: "field-error", "data-check": "max-length" },
                        "512 characters maximum"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "centered-contents" },
                    React.createElement(
                        "button",
                        { className: "btn btn-warning" },
                        "Add task"
                    )
                )
            )
        );
    }
});
