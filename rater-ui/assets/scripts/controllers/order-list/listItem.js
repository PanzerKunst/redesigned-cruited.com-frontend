import Order from "../../models/order";
import store from "./store";
import DeleteModal from "./deleteModal";

// eslint-disable-next-line no-unused-vars
import RaterProfile from "./raterProfile";

// eslint-disable-next-line no-unused-vars
import TimeLeft from "../common-components/timeLeft";

// eslint-disable-next-line no-unused-vars
import PositionSought from "../common-components/positionSought";

// eslint-disable-next-line no-unused-vars
import EmployerSought from "../common-components/employerSought";

// eslint-disable-next-line no-unused-vars
import OrderTags from "../common-components/orderTags";

const Component = React.createClass({
    render() {
        const order = this.props.order;

        return (
            <li ref="li" className={this._cssClassForStatus(order.status)}>
                <section>
                    <RaterProfile account={order.rater} />
                    <p>#{order.id}</p>
                    <TimeLeft order={order} />
                    <p>{moment(order.paymentTimestamp).format("YYYY-MM-DD H:mm")}</p>
                </section>
                <section>
                    <div>
                        <PositionSought position={order.positionSought} />
                        <EmployerSought employer={order.employerSought} />
                    </div>
                    <div>
                        <p>{order.customer.firstName}</p>
                        <p>{order.customer.emailAddress}</p>
                    </div>
                </section>
                <section>
                    <OrderTags order={order} config={store.config} />
                    {this._actionBtn(order)}
                    {this._secondaryButtons(order)}
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

    _actionBtn(order) {
        const text = order.isReadOnlyBy(store.account.id) ? "Check" : "Assess";

        return (
            <div>
                <a href={this._assessmentUrl(order.id)} className="btn btn-default">{text}</a>
            </div>);
    },

    _secondaryButtons(order) {
        const assignBtn = order.status === Order.statuses.completed || order.status === Order.statuses.scheduled ?
            null :
            <button className="styleless fa fa-user" onClick={this._handleAssignClick}>
                <i className="fa fa-check" aria-hidden="true"></i>
            </button>;

        let viewBtn = null;

        if (order.status === Order.statuses.completed || order.status === Order.statuses.scheduled) {
            const href = store.config.customerAppRootUrl + "reports/" + order.id;

            viewBtn = <a href={href} target="_blank" className="fa fa-eye" />;
        }

        const deleteBtn = store.account.isAdmin() ?
            <button className="styleless fa fa-trash" onClick={this._handleDeleteClick}></button> :
            null;

        return (
            <div className="secondary-buttons">
                {assignBtn}
                {viewBtn}
                {deleteBtn}
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
