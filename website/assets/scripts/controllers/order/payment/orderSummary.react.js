"use strict";

CR.Controllers.OrderSummary = React.createClass({
    render: function() {
        return (
            <section>
                <ul className="styleless">
                    {this.props.order.getProducts().map(function(product, index) {
                        let reactItemId = "ordered-product-" + index;

                        return (
                            <li key={reactItemId}>
                                <p>{CR.i18nMessages["product.name." + product.code]}</p>
                                <span>{CR.i18nMessages["edition.name." + this.props.order.getEdition().code]}</span>
                            </li>
                        );
                    }.bind(this))}
                </ul>
                <p>
                    <span>{CR.i18nMessages["order.productSelection.cartSection.total"]}</span>
                    <span>{this.props.order.getTotalPrice()} {this.props.order.getProducts()[0].price.currencyCode}</span>
                </p>
            </section>
        );
    }
});
