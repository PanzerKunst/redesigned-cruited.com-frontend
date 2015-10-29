"use strict";

CR.Controllers.ProductListItem = React.createClass({
    render: function() {
        var checkboxId = "product-" + this.props.product.id;

        var priceWrapperClasses = classNames({
            "with-reduced-price": this.props.product.reducedPrice !== undefined
        });

        var reducedPriceParagraph = null;

        if (this.props.product.reducedPrice) {
            reducedPriceParagraph = (
                <p className="reduced-price">{this.props.product.reducedPrice.currencyCode} {this.props.product.reducedPrice.amount}</p>
                );
        }

        return (
            <li ref="li">
                <div className="checkbox checkbox-primary">
                    <input type="checkbox" id={checkboxId} checked={this._isInOrder()} onChange={this._handleProductToggle} />
                    <label htmlFor={checkboxId}>{CR.i18nMessages["orderStep1.productsSection.productName." + this.props.product.code]}</label>
                </div>
                <div className={priceWrapperClasses}>
                    <p className="price">{this.props.product.price.currencyCode} {this.props.product.price.amount}</p>
                    {reducedPriceParagraph}
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

    _isInOrder: function() {
        var foundProduct = _.find(CR.order.getProducts(), function(product) {
            return product.id === this.props.product.id;
        }.bind(this));

        return foundProduct !== undefined;
    },

    _handleProductToggle: function() {
        if (this.$checkbox.prop("checked")) {
            CR.order.addProduct(this.props.product);
        } else {
            CR.order.removeProduct(this.props.product);
        }
        this.props.controller.reRender();
    }
});
