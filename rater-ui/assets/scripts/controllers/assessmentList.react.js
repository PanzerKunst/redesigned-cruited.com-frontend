import React from "react";
import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import AssessmentModel from "../models/assessment";

const AssessmentListController = Object.create(Object.prototype, {
    init(account) {
        const assessment = AssessmentModel.init();

        console.log("account", account);
        console.log("assessment", assessment);

        ReactDOM.render(
            React.createElement(this.reactComponent),
            document.querySelector("[role=main]")
        );
    },

    @observer
    reactComponent: React.createClass({
        getInitialState() {
            return {
                assessment: null
            };
        },

        render() {
            if (!this.state.assessment) {
                return null;
            }

            return (
                <div id="content">
                    <header>
                    </header>
                    <div className="with-circles">
                        <p>Assessment List</p>
                        {this.state.assessment.title}
                    </div>
                </div>
            );
        }
    })
});

export {AssessmentListController as default};
