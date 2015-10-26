"use strict";

CR.Controllers.CartProductListItem = React.createClass({
    render: function() {
        return (
            <li ref="li">
                <span>
                    <p>{this.props.i18nMessages["product.name." + this.props.product.code]}</p>
                    {this.props.i18nMessages["productSelection.cartSection.edition"]}: <span>{this.props.i18nMessages["edition.name." + CR.cart.getEdition().code]}</span>
                </span>
                <span>{this.props.product.price.amount} {this.props.product.price.currencyCode}</span>
                <button className="styleless fa fa-times" onClick={this._handleClick}></button>
            </li>
            );
    },

    _handleClick: function() {
        CR.cart.removeProduct(this.props.product);
        this.props.controller.reRender();
    }
});
