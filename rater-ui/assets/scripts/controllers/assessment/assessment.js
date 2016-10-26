import store from "./store";

const controller = {
    init() {
        store.reactComponent = ReactDOM.render(
            React.createElement(this.reactComponent),
            document.querySelector("[role=main]")
        );

        store.init();
    },

    reactComponent: React.createClass({
        getInitialState() {
            return store;
        },

        render() {
            return (
                <div id="content">
                    <header>
                        <div>
                            {this._heading()}
                        </div>
                    </header>
                    <div className="with-circles">
                    </div>
                </div>
            );
        },

        _heading() {
            const text = `Assessment #${store.order.id}`;

            return <h1>{text}</h1>;
        }
    })
};

controller.init();
