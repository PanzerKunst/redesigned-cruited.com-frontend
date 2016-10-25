const CouponTag = React.createClass({
    render() {
        const coupon = this.props.coupon;

        if (!coupon) {
            return null;
        }

        return <span ref="coupon" className="order-list-item-tag coupon" data-toggle="tooltip" title={coupon.code}>{coupon.campaignName}</span>;
    },

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.coupon)).tooltip();
    }
});

export {CouponTag as default};
