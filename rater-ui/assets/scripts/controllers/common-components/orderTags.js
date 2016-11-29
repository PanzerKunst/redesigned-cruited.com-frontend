import Product from "../../models/product";

const Component = React.createClass({
    render() {
        const order = this.props.order;

        return (
            <div ref="root" className="order-tags">
                <section>
                    {this._couponTag(order.coupon)}
                    <span className={`order-tag edition ${order.editionCode}`}>{order.editionCode}</span>
                </section>

                <section>
                    {order.containedProductCodes.map(productCode =>
                            <span key={`${order.id}-${productCode}`} className="order-tag product-code">
                                <a href={order.documentUrl(this.props.config, productCode)} target="_blank">{Product.humanReadableCode(productCode)}</a>
                            </span>
                    )}
                    <span className="order-tag lang">{order.languageCode}</span>
                </section>
            </div>);
    },

    componentDidMount() {
        this._initElements();
        this.$tooltips.tooltip();
    },

    _initElements() {
        const $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

        this.$tooltips = $rootEl.find("[data-toggle=tooltip]");
    },

    _couponTag(coupon) {
        if (!coupon) {
            return null;
        }

        return <span className="order-tag coupon" data-toggle="tooltip" title={coupon.code}>{coupon.campaignName}</span>;
    }
});

export {Component as default};
