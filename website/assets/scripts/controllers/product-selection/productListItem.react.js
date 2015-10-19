"use strict";

CR.Controllers.ProductListItem = React.createClass({
    render: function() {
        return (
            <li ref="li">
                <div className="checkbox">
                    <label>
                        <input type="checkbox" onChange={this._handleProductToggle}>{this.props.i18nMessages["productSelection.productsSection.productName." + this.props.product.code]}</input>
                    </label>
                </div>
                <div>
                    <div className="default-price">{this.props.product.price.currencyCode} {this.props.product.price.amount}</div>
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

    _handleProductToggle: function() {
        if (this.$checkbox.prop("checked")) {
            CR.Cart.addProduct(this.props.product);
        } else {
            CR.Cart.removeProduct(this.props.product);
        }
        this.props.controller.reRender();
    }
});
