import Product from "../../models/product";
import store from "./store";

// eslint-disable-next-line no-unused-vars
import CouponTag from "../components/couponTag";

const DeleteModal = React.createClass({
    render() {
        const order = store.currentOrder;

        return (
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h3 className="modal-title">Delete this order&#63;</h3>
                    </div>
                    <div className="modal-body">
                        <section>
                            <p>#{order.id}</p>
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
                            <CouponTag coupon={order.coupon}/>
                            {order.tags.map(tag => {
                                const reactKey = order.id + "-" + tag;

                                return <span key={reactKey} className="order-list-item-tag order-tag">{tag}</span>;
                            })}
                            {order.containedProductCodes.map(productCode => {
                                const reactKey = order.id + "-" + productCode;

                                return <span key={reactKey} className="order-list-item-tag product-code">{Product.humanReadableCode(productCode)}</span>;
                            })}
                            <span className="order-list-item-tag lang">{order.languageCode}</span>
                        </section>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={this._handleDeleteClicked}>Mark as deleted</button>
                    </div>
                </div>
            </div>
        );
    },

    componentDidMount() {
        this._initElements();
    },

    _initElements() {
        this.$modal = $("#delete-modal");
    },

    _handleDeleteClicked() {
        store.deleteCurrentOrder();
        this.$modal.modal("hide");
    }
});

export {DeleteModal as default};
