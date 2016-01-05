"use strict";

CR.Controllers.OrderSummary = React.createClass({
    render: function() {
        let order = this.props.order;
        let currencyCode = order.getProducts()[0].price.currencyCode;

        return (
            <section id="cart-section">
                <header>
                    <h2>{CR.i18nMessages["order.productSelection.cartSection.title"]}</h2>
                    <span>{order.getProducts().length}</span>
                </header>
                <div>
                    <div>
                        <span>{CR.i18nMessages["order.productSelection.cartSection.productsHeader.products"]}</span>
                        <span>{CR.i18nMessages["order.productSelection.cartSection.productsHeader.defaultPrice"]}</span>
                    </div>
                    <ul className="styleless">
                        {order.getProducts().map(function(product, index) {
                            let reactItemId = "cart-product-" + index;
                            let editionCode = order.getEdition().code;
                            let editionSpanClasses = "edition " + editionCode;

                            return (
                                <li key={reactItemId}>
                                    <span>
                                        <p className="cart-product-name">{CR.i18nMessages["product.name." + product.code]}</p>
                                        <span className={editionSpanClasses}>{CR.i18nMessages["edition.name." + editionCode]}</span>
                                    </span>
                                    <span className="cart-product-price">{product.price.amount} {product.price.currencyCode}</span>
                                </li>
                            );
                        })}
                    </ul>
                    <table>
                        <tbody>
                            <tr className="sub-total-row">
                                <td>{CR.i18nMessages["order.productSelection.cartSection.subTotal"]}:</td>
                                <td>{order.getBasePrice()} {currencyCode}</td>
                            </tr>
                            {order.getReductions().map(function(reduction, index) {
                                let reactItemId = "cart-reduction-" + index;

                                return (
                                    <tr key={reactItemId} className="reduction-row">
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
                                <td>{order.getTotalPrice()} {currencyCode}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </section>
        );
    },

    _getCouponRow: function() {
        let orderCoupon = this.props.order.getCoupon();

        if (!orderCoupon) {
            return null;
        }

        let amount = orderCoupon.discountPercentage || orderCoupon.discountPrice.amount;
        let unit = orderCoupon.discountPercentage ? "%" : " " + orderCoupon.discountPrice.currencyCode;

        return (
            <tr className="coupon-row">
                <td>{orderCoupon.campaignName}:</td>
                <td>- {amount}{unit}</td>
            </tr>
        );
    }
});
