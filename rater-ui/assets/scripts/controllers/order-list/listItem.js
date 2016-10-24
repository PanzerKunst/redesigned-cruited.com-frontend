import {httpStatusCodes} from "../../global";
import Order from "../../models/order";
import Product from "../../models/product";

const ListItem = React.createClass({
    render() {
        const order = this.props.order;

        return (
            <li ref="li" className={this._cssClassForStatus(order.status)}>
                <section>
                    {this._raterProfile(order.rater)}
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
                        {this._coupon(order.coupon)}
                        {order.tags.map(tag => {
                            const reactKey = order.id + "-" + tag;

                            return <span key={reactKey} className="order-list-item-tag order-tag">{tag}</span>;
                        })}
                        {order.containedProductCodes.map(productCode => this._productCode(productCode, order.id))}
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
        const $listItem = $(ReactDOM.findDOMNode(this.refs.li));

        this.$bootstrapTooltips = $listItem.find("[data-toggle=tooltip]");
        this.$assignModal = $("#assign-modal");

        this.$bootstrapTooltips.tooltip();
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

    _raterProfile(rater) {
        if (!rater) {
            return null;
        } else {
            let myProfilePictureStyleAttr = null;
            const myLinkedinProfile = rater.linkedinProfile;

            if (myLinkedinProfile) {
                myProfilePictureStyleAttr = {backgroundImage: "url(" + myLinkedinProfile.pictureUrl + ")"};
            }

            return (
                <article className="rater-profile">
                    <div className="profile-picture" style={myProfilePictureStyleAttr}></div>
                    <span>{rater.firstName} {rater.lastName}</span>
                </article>
            );
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

    _productCode(productCode, orderId) {
        const reactKey = orderId + "-" + productCode;

        return <span key={reactKey} className="order-list-item-tag product-code">{Product.humanReadableCode(productCode)}</span>;
    },

    _actionBtn(order) {
        if (order.status === Order.statuses.completed || order.status === Order.statuses.scheduled) {
            return this._checkBtn();
        }
        return this._assessBtn(order.rater);
    },

    _assessBtn(rater) {
        const btn = rater ?
            <button className="btn btn-default">Assess</button> :
            <button className="btn btn-default" disabled>Assess</button>;

        return (
            <div>
                {btn}
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
        const assignBtn = order.status === Order.statuses.completed || order.status === Order.statuses.scheduled || !this.props.account.isAdmin() ?
            null :
            <button className="styleless fa fa-user" onClick={this._handleAssignClicked}>
                <i className="fa fa-check" aria-hidden="true"></i>
            </button>;

        const viewBtn = order.status === Order.statuses.completed || order.status === Order.statuses.scheduled ?
            <button className="styleless fa fa-eye"></button> :
            null;

        const deleteBtn = this.props.account.isAdmin() ?
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
        this.$assignModal.modal();
    },

    _handleDeleteClicked() {
        const order = this.props.order;

        // TODO: remove
        console.log("_handleDeleteClicked", order);

        const type = "DELETE";
        const url = "/api/orders";

        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {
                    this.props.parentController.hideOrderOfId(order.id);
                } else {
                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                }
            }
        }.bind(this);
        httpRequest.open(type, url);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(JSON.stringify(order));

    }
});

export {ListItem as default};
