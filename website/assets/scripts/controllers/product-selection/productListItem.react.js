"use strict";

CR.Controllers.ProductListItem = React.createClass({
    render: function() {
        var checkboxId = "product-" + this.props.product.id;

        return (
            <li ref="li">
                <div className="checkbox checkbox-success">
                    <input type="checkbox" id={checkboxId} onChange={this._handleProductToggle} checked={this._isInCart()} />
                    <label htmlFor={checkboxId}>{this.props.i18nMessages["productSelection.productsSection.productName." + this.props.product.code]}</label>
                </div>
                <div>
                    <div className="default-price">{this.props.product.defaultPrice.currencyCode} {this.props.product.defaultPrice.amount}</div>
                    <div className="current-price">{this.props.product.currentPrice.currencyCode} {this.props.product.currentPrice.amount}</div>
                </div>
            </li>
            );
    },

    componentDidMount: function() {
        this._initElements();
    },

    _initElements: function() {
        this.$listItem = $(React.findDOMNode(this.refs.li));
        this.$checkbox = this.$listItem.find("input[type=\"checkbox\"]");
    },

    _isInCart: function() {
        var foundProduct = _.find(CR.cart.getProducts(), function(product) {
            return product.id === this.props.product.id;
        }.bind(this));

        return foundProduct !== undefined;
    },

    _handleProductToggle: function() {
        if (this.$checkbox.prop("checked")) {
            CR.cart.addProduct(this.props.product);
        } else {
            CR.cart.removeProduct(this.props.product);
        }
        this.props.controller.reRender();
    }
});
