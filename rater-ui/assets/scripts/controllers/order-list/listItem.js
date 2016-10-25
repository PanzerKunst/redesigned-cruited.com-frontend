import Order from "../../models/order";
import Product from "../../models/product";
import store from "./store";
import DeleteModal from "./deleteModal";

// eslint-disable-next-line no-unused-vars
import RaterProfile from "../components/raterProfile";

// eslint-disable-next-line no-unused-vars
import CouponTag from "../components/couponTag";

const ListItem = React.createClass({
    render() {
        const order = this.props.order;

        return (
            <li ref="li" className={this._cssClassForStatus(order.status)}>
                <section>
                    <RaterProfile account={order.rater} />
                    <p>#{order.id}</p>
                    {this._timeLeft(order)}
                    <p>{moment(order.paymentTimestamp).format("YYYY-MM-DD H:mm")}</p>
                </section>
                <section>
                    <div>
                        <p>{order.employerSought}</p>
                        <p>{order.positionSought}</p>
                    </div>
                    <div>
                        <p>{order.customer.firstName}</p>
                        <p>{order.customer.emailAddress}</p>
                    </div>
                </section>
                <section>
                    <div>
                        <CouponTag coupon={order.coupon}/>
                        {order.tags.map(tag => {
                            const reactKey = order.id + "-" + tag;

                            return <span key={reactKey} className="order-list-item-tag order-tag">{tag}</span>;
                        })}
                        {order.containedProductCodes.map(productCode => {
                            const reactKey = order.id + "-" + productCode;

                            return (<span key={reactKey} className="order-list-item-tag product-code">
                                <a href={order.documentUrl(store.config, productCode)} target="_blank">{Product.humanReadableCode(productCode)}</a>
                            </span>);
                        })}
                        <span className="order-list-item-tag lang">{order.languageCode}</span>
                    </div>
                    {this._actionBtn(order)}
                    {this._secondaryButtons(order)}
                </section>
            </li>
        );
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

    _timeLeft(order) {
        if (order.status === Order.statuses.completed || order.status === Order.statuses.scheduled) {
            return null;
        }

        const dueDate = moment(order.paymentTimestamp).add(1, "d").subtract(90, "m");
        const timeLeft = moment.duration(dueDate.valueOf() - moment().valueOf());

        return <p>{timeLeft.hours()}h{timeLeft.minutes()}m left</p>;
    },

    _coupon(coupon) {
        if (!coupon) {
            return null;
        }
        return <span className="order-list-item-tag coupon" data-toggle="tooltip" title={coupon.code}>{coupon.campaignName}</span>;
    },

    _actionBtn(order) {

        // Raters who are not assigned should still be able to check the assessment, even before it's completed
        if (order.status === Order.statuses.completed || order.status === Order.statuses.scheduled || (
            order.rater && order.rater.id !== store.account.id)) {
            return this._checkBtn();
        }
        return this._assessBtn();
    },

    _assessBtn() {
        return (
            <div>
                <button className="btn btn-default">Assess</button>
            </div>
        );
    },

    _checkBtn() {
        return (
            <div>
                <button className="btn btn-default" href="">Check</button>
            </div>
        );
    },

    _secondaryButtons(order) {
        const assignBtn = order.status === Order.statuses.completed || order.status === Order.statuses.scheduled ?
            null :
            <button className="styleless fa fa-user" onClick={this._handleAssignClicked}>
                <i className="fa fa-check" aria-hidden="true"></i>
            </button>;

        const viewBtn = order.status === Order.statuses.completed || order.status === Order.statuses.scheduled ?
            <button className="styleless fa fa-eye"></button> :
            null;

        const deleteBtn = store.account.isAdmin() ?
            <button className="styleless fa fa-trash" onClick={this._handleDeleteClicked}></button> :
            null;

        return (
            <div className="secondary-buttons">
                {assignBtn}
                {viewBtn}
                {deleteBtn}
            </div>
        );
    },

    _handleAssignClicked() {
        store.currentOrder = this.props.order;
        this.$assignModal.modal();
    },

    _handleDeleteClicked() {
        store.currentOrder = this.props.order;

        ReactDOM.render(
            React.createElement(DeleteModal),
            document.querySelector("#delete-modal")
        );

        this.$deleteModal.modal();
    }
});

export {ListItem as default};
