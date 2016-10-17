import AssessmentModel from "../models/assessment";

const AssessmentListController = {
    init({account}) {
        this.assessment = Object.create(AssessmentModel);

        console.log("account", account);
        console.log("assessment", this.assessment);

        setInterval(() => {
            this.assessment.secondsPassed++;
            this.reRender();
        }, 1000);

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactComponent),
            document.querySelector("[role=main]")
        );

        this.reRender();
    },

    reRender() {
        this.reactInstance.replaceState({
            assessment: this.assessment
        });
    },

    reactComponent: React.createClass({
        getInitialState() {
            return {
                assessment: null
            };
        },

        render() {
            if (this.state.assessment === null) {
                return null;
            }

            return (
                <div id="content">
                    <header>
                    </header>
                    <div className="with-circles">
                        <p>Assessment List</p>
                        {this.state.assessment.secondsPassed}
                    </div>
                </div>
            );
        }
    })
};

Object.create(AssessmentListController).init(CR.ControllerData);
