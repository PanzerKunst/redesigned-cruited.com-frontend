"use strict";

CR.Controllers.OrderSummary = React.createClass({
    render: function() {
        const order = this.props.order;
        const currencyCode = order.getProducts()[0].price.currencyCode;

        return (
            <section id="cart-section">
                <header>
                    <h2>{CR.i18nMessages["order.productSelection.cartSection.title"]}</h2>
                    <span className="highlighted-number">{order.getProducts().length}</span>
                </header>
                <div>
                    <div className="column-labels">
                        <span>{CR.i18nMessages["order.productSelection.cartSection.productsHeader.products"]}</span>
                        <span>{CR.i18nMessages["order.productSelection.cartSection.productsHeader.defaultPrice"]}</span>
                    </div>
                    <ul className="styleless">
                        {order.getProducts().map(function(product, index) {
                            const editionCode = order.getEdition().code;
                            const editionSpanClasses = "edition " + editionCode;

                            return (
                                <li key={index}>
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
                                <td>{order.getTotalPrice()} {currencyCode}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <article className="alert alert-info guarantee-panel" role="alert">
                    <p dangerouslySetInnerHTML={{__html: CR.i18nMessages["moneyBackGuarantee.text"]}} />
                </article>
            </section>
        );
    },

    _getCouponRow: function() {
        const orderCoupon = this.props.order.getCoupon();

        if (!orderCoupon) {
            return null;
        }

        const amount = orderCoupon.discountPercentage || orderCoupon.discountPrice.amount;
        const unit = orderCoupon.discountPercentage ? "%" : " " + orderCoupon.discountPrice.currencyCode;

        return (
            <tr className="coupon-row">
                <td>{orderCoupon.campaignName}:</td>
                <td>- {amount}{unit}</td>
            </tr>
        );
    }
});
