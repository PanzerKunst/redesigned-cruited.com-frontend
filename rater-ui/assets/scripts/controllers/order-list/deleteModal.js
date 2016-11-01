import store from "./store";

// eslint-disable-next-line no-unused-vars
import PositionSought from "../components/positionSought";

// eslint-disable-next-line no-unused-vars
import EmployerSought from "../components/employerSought";

// eslint-disable-next-line no-unused-vars
import OrderTags from "../components/orderTags";

const Component = React.createClass({
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
                        </section>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={this._handleDeleteClick}>Mark as deleted</button>
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

    _handleDeleteClick() {
        store.deleteCurrentOrder();
        this.$modal.modal("hide");
    }
});

export {Component as default};
