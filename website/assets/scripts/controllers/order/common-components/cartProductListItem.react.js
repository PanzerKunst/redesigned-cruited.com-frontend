"use strict";

CR.Controllers.CartProductListItem = React.createClass({
    render: function() {
        const product = this.props.product;

        return (
            <li>
                <span>
                    <p className="cart-product-name">{CR.i18nMessages["product.name." + product.code]}</p>
                    {this._edition()}
                </span>
                <span className="cart-product-price">{product.price.amount} {product.price.currencyCode}<button className="styleless fa fa-times" onClick={this._handleClick}/></span>
            </li>
        );
    },

    _edition: function() {
        if (!CR.order.getEdition()) {
            return null;
        }

        const editionCode = CR.order.getEdition().code;
        const editionSpanClasses = "edition " + editionCode;

        return <span className={editionSpanClasses}>{CR.i18nMessages["edition.name." + editionCode]}</span>;
    },

    _handleClick: function() {
        CR.order.removeProduct(this.props.product);
        CR.order.saveInLocalStorage();

        this.props.controller.reRender();
    }
});
