import Order from "../../models/order";

const Component = React.createClass({
    render() {
        const order = this.props.order;

        if (order.status === Order.statuses.completed || order.status === Order.statuses.scheduled) {
            return null;
        }

        const dueMoment = moment(order.dueTimestamp);
        const timeLeft = moment.duration(dueMoment.valueOf() - moment().valueOf());

        return <p className="time-left">{timeLeft.hours()}h{timeLeft.minutes()}m left</p>;
    }
});

export {Component as default};
