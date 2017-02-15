import Order from "../../models/order";

const Component = props => {
    const order = props.order;

    if (order.status === Order.statuses.completed || order.status === Order.statuses.scheduled) {
        return null;
    }

    const dueMoment = moment(order.dueTimestamp);
    const timeLeft = moment.duration(dueMoment.valueOf() - moment().valueOf());

    return <p className="time-left"><i className="fa fa-clock-o" aria-hidden="true"/><span>{timeLeft.hours()}h {timeLeft.minutes()}m</span></p>;
};

export {Component as default};
