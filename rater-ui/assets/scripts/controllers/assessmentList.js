import {observer} from "mobx-react";
import AssessmentModel from "../models/assessment";

const AssessmentListController = {
    init({account}) {
        const assessment = Object.create(AssessmentModel);

        console.log("account", account);
        console.log("assessment", assessment);

        setInterval(() => {
            assessment.secondsPassed++;
        }, 1000);

        ReactDOM.render(
            React.createElement(this.reactComponent, {assessment}),
            document.querySelector("[role=main]")
        );
    },

    reactComponent: observer(React.createClass({
        render() {
            return (
                <div id="content">
                    <header>
                    </header>
                    <div className="with-circles">
                        <p>Assessment List</p>
                        {this.props.assessment.secondsPassed}
                    </div>
                </div>
            );
        }
    }))
};

Object.create(AssessmentListController).init(CR.ControllerData);
