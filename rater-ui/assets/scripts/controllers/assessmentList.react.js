import {observer} from "mobx-react";

CR.Controllers.AssessmentList = Object.create(Object.prototype, {
    init(account) {
        const assessment = CR.Models.Assessment.init();

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
