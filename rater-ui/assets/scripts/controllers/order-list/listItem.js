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
                    {this._timeLeft(order.paymentTimestamp, order.status)}
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
                    {this._actionBtn(order.id, order.idInBase64)}
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

        this._initTooltips();
    },

    _initTooltips() {
        this.$bootstrapTooltips.tooltip();
    },

    _cssClassForStatus(status) {
        switch (status) {
            case Order.statusIds.paid:
                return "paid";
            case Order.statusIds.inProgress:
                return "in-progress";
            case Order.statusIds.awaitingFeedback:
                return "awaiting-feedback";
            case Order.statusIds.scheduled:
                return "scheduled";
            case Order.statusIds.completed:
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

    _timeLeft(paymentTimestamp, orderStatus) {
        if (orderStatus === Order.statusIds.completed || orderStatus === Order.statusIds.scheduled) {
            return null;
        }

        const dueDate = moment(paymentTimestamp).add(1, "d").subtract(90, "m");
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

    _actionBtn(orderStatus, orderIdInBase64) {
        const label = orderStatus === Order.statusIds.completed || orderStatus === Order.statusIds.scheduled ? "View" : "Assess";

        // TODO: remove
        console.log("orderIdInBase64", orderIdInBase64);

        return (
            <div>
                <button className="btn">{label}</button>
            </div>
        );
    }
});

export {ListItem as default};
