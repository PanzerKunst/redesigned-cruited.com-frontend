import Order from "../../models/order";
import store from "./store";

const Component = React.createClass({
    render() {
        if (!store.isOrderStartable()) {
            return null;
        }

        return <button className="btn btn-primary" onClick={this._handleClick}>Start assessment</button>;
    },

    _handleClick() {
        store.updateOrderStatus(Order.statuses.inProgress);
    }
});

export {Component as default};
