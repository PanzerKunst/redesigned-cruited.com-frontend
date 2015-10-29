"use strict";

CR.Controllers.CartProductListItem = React.createClass({
    render: function() {
        return (
            <li ref="li">
                <span>
                    <p>{CR.i18nMessages["product.name." + this.props.product.code]}</p>
                    {CR.i18nMessages["orderStep1.cartSection.edition"]}: <span>{CR.i18nMessages["edition.name." + CR.order.getEdition().code]}</span>
                </span>
                <span>{this.props.product.price.amount} {this.props.product.price.currencyCode}</span>
                <button className="styleless fa fa-times" onClick={this._handleClick}></button>
            </li>
            );
    },

    _handleClick: function() {
        CR.order.removeProduct(this.props.product);
        this.props.controller.reRender();
    }
});
