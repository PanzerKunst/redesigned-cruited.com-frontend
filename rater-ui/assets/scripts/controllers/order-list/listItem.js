import Order from "../../models/order";
import store from "./store";

import DeleteModal from "./deleteModal";
import RaterProfile from "./raterProfile";  // eslint-disable-line no-unused-vars
import TimeLeft from "../common-components/timeLeft";   // eslint-disable-line no-unused-vars
import PositionSought from "../common-components/positionSought";   // eslint-disable-line no-unused-vars
import EmployerSought from "../common-components/employerSought";   // eslint-disable-line no-unused-vars
import OrderTags from "../common-components/orderTags"; // eslint-disable-line no-unused-vars
import CustomerProfile from "../common-components/customerProfile"; // eslint-disable-line no-unused-vars

const Component = React.createClass({
    render() {
        const order = this.props.order;

        return (
            <li ref="li" className={this._cssClassForStatus(order.status)}>
                <section className="order-section first">
                    <RaterProfile account={order.rater} />
                    <div className="order-id-and-status">
                        <span>#{order.id}</span>
                        <span className={`order-status ${order.statusCode()}`}>{order.statusCode()}</span>
                    </div>
                    <TimeLeft order={order} />
                    <p>{moment(order.paymentTimestamp).format("YYYY-MM-DD H:mm")}</p>
                </section>
                <section className="order-section second">
                    <div>
                        <PositionSought position={order.positionSought} />
                        <EmployerSought employer={order.employerSought} />
                    </div>
                    <CustomerProfile customer={order.customer} />
                    {this._lastRating()}
                </section>
                <section className="order-section third">
                    <OrderTags order={order} config={store.config} />
                    {this._actionBtn()}
                    {this._secondaryButtons()}
                </section>
            </li>);
    },

    componentDidMount() {
        this._initElements();
    },

    _initElements() {
        this.$assignModal = $("#assign-modal");
        this.$deleteModal = $("#delete-modal");
    },

    _cssClassForStatus(status) {
        switch (status) {
            case Order.statuses.paid:
                return "paid";
            case Order.statuses.inProgress:
                return "in-progress";
            case Order.statuses.awaitingFeedback:
                return "awaiting-feedback";
            case Order.statuses.scheduled:
                return "scheduled";
            case Order.statuses.completed:
                return "completed";
            default:
                return "not-paid";
        }
    },

    _coupon(coupon) {
        if (!coupon) {
            return null;
        }
        return <span className="order-list-item-tag coupon" data-toggle="tooltip" title={coupon.code}>{coupon.campaignName}</span>;
    },

    _lastRating() {
        const order = this.props.order;
        const customerId = order.customer.id;
        const ordersAndScores = store.customerIdsAndTheirOrdersAndScores ? store.customerIdsAndTheirOrdersAndScores[customerId] : null;

        _.remove(ordersAndScores, orderAndScores => orderAndScores.order.id === order.id);

        if (_.isEmpty(ordersAndScores)) {
            return null;
        }

        const lastOrderAndScores = ordersAndScores[0];
        const lastRater = lastOrderAndScores.order.rater;
        const lastOrderDueMoment = moment(lastOrderAndScores.order.dueTimestamp);

        return <p>{`Last rated by ${lastRater.firstName} ${lastRater.lastName} on ${lastOrderDueMoment.format("YYYY-MM-DD")}`}</p>;
    },

    _actionBtn() {
        const order = this.props.order;
        const text = store.isOrderReadOnly(order) ? "Check" : "Assess";

        return (
            <div className="action-btn">
                <a href={this._assessmentUrl(order.id)} className="btn btn-primary">{text}</a>
            </div>);
    },

    _secondaryButtons() {
        const order = this.props.order;

        const assignBtn = order.status === Order.statuses.completed || order.status === Order.statuses.scheduled ?
            null :
            <button className="styleless fa fa-user" onClick={this._handleAssignClick}>
                <i className="fa fa-check" aria-hidden="true"></i>
            </button>;

        let viewBtn = null;

        if (order.status === Order.statuses.completed || order.status === Order.statuses.scheduled) {
            viewBtn = <a href={order.reportUrl(store.config)} target="_blank" className="fa fa-eye" />;
        }

        return (
            <div className="secondary-buttons">
                {assignBtn}
                {viewBtn}
                <button className="styleless fa fa-trash" onClick={this._handleDeleteClick}></button>
            </div>);
    },

    _handleAssignClick() {
        store.currentOrder = this.props.order;
        this.$assignModal.modal();
    },

    _handleDeleteClick() {
        store.currentOrder = this.props.order;

        ReactDOM.render(
            React.createElement(DeleteModal),
            document.querySelector("#delete-modal")
        );

        this.$deleteModal.modal();
    },

    _assessmentUrl(orderId) {
        return `/assessments/${orderId}`;
    }
});

export {Component as default};
