import Product from "../../models/product";

const Component = React.createClass({
    render() {
        const order = this.props.order;

        return (<div ref="root">
            {this._couponTag(order.coupon)}
            {order.tags.map(tag => {
                const reactKey = order.id + "-" + tag;

                return <span key={reactKey} className="order-tag tag">{tag}</span>;
            })}
            {order.containedProductCodes.map(productCode => {
                const reactKey = order.id + "-" + productCode;

                return (<span key={reactKey} className="order-tag product-code">
                    <a href={order.documentUrl(this.props.config, productCode)} target="_blank">{Product.humanReadableCode(productCode)}</a>
                </span>);
            })}
            <span className="order-tag lang">{order.languageCode}</span>
        </div>
        );
    },

    componentDidMount() {
        this._initElements();
    },

    _initElements() {
        const $rootEl = $(ReactDOM.findDOMNode(this.refs.root));
        const $tooltips = $rootEl.find("[data-toggle=tooltip]");

        $tooltips.tooltip();
    },

    _couponTag(coupon) {
        if (!coupon) {
            return null;
        }

        return <span className="order-tag coupon" data-toggle="tooltip" title={coupon.code}>{coupon.campaignName}</span>;
    }
});

export {Component as default};