CR.Controllers.CartSection = React.createClass({
    render() {
        const controller = this.props.controller;

        return (
            <section id="cart-section">
                <header>
                    <h2>{CR.i18nMessages["order.productSelection.cartSection.title"]}</h2>
                    <span className="highlighted-number">{CR.order.getProducts().length}</span>
                </header>
                <div>
                    <div className="column-labels">
                        <span>{CR.i18nMessages["order.productSelection.cartSection.productsHeader.products"]}</span>
                        <span>{CR.i18nMessages["order.productSelection.cartSection.productsHeader.defaultPrice"]}</span>
                    </div>

                    <ul className="styleless">
                        {CR.order.getProducts().map((product, index) => <CR.Controllers.CartProductListItem key={index} product={product} isEditable={product.code !== CR.Models.Product.codes.INTERVIEW_TRAINING} controller={controller} />)}
                    </ul>

                    <CR.Controllers.CouponForm controller={controller} />

                    <div className="bottom-section">
                        {this._getCartTable()}

                        <div className="alert alert-info guarantee-panel" role="alert">
                            <p dangerouslySetInnerHTML={{__html: CR.i18nMessages["moneyBackGuarantee.text"]}} />
                        </div>
                    </div>
                </div>
            </section>);
    },

    _getCartTable() {
        const products = CR.order.getProducts();

        if (_.isEmpty(products)) {
            return null;
        }

        const productCurrencyCode = products[0].price.currencyCode;

        return (
            <table>
                <tbody>
                <tr className="sub-total-row">
                    <td>{CR.i18nMessages["order.productSelection.cartSection.subTotal"]}:</td>
                    <td>{CR.order.getBasePrice()} {productCurrencyCode}</td>
                </tr>
                {CR.order.getReductions().map(function(reduction, index) {
                    return (
                        <tr key={index} className="reduction-row">
                            <td>{CR.i18nMessages["reduction.name." + reduction.code]}:</td>
                            <td>- {reduction.price.amount} {reduction.price.currencyCode}</td>
                        </tr>
                    );
                })}

                {this._getCouponRow()}
                </tbody>
                <tfoot>
                <tr>
                    <td>{CR.i18nMessages["order.productSelection.cartSection.total"]}:</td>
                    <td>{CR.order.getTotalPrice()} {productCurrencyCode}</td>
                </tr>
                </tfoot>
            </table>);
    },

    _getCouponRow() {
        const orderCoupon = CR.order.getCoupon();

        if (!orderCoupon) {
            return null;
        }

        const amount = orderCoupon.discountPercentage || orderCoupon.discountPrice.amount;
        const unit = orderCoupon.discountPercentage ? "%" : " " + orderCoupon.discountPrice.currencyCode;

        return (
            <tr className="coupon-row">
                <td>{orderCoupon.campaignName}:</td>
                <td>- {amount}{unit}</td>
            </tr>);
    }
});
