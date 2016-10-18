const AssessmentListController = {
    account: null,

    init() {

        // TODO: remove
        console.log("account", this.account);

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactComponent),
            document.querySelector("[role=main]")
        );

        this._reRender();
    },

    _reRender() {
        this.reactInstance.replaceState({
            account: this.account
        });
    },

    reactComponent: React.createClass({
        getInitialState() {
            return {
                account: null
            };
        },

        render() {
            if (this.state.account === null) {
                return null;
            }

            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>Assessment List</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        Hello!
                    </div>
                </div>
            );
        }
    })
};

Object.assign(Object.create(AssessmentListController), CR.ControllerData)
    .init();
