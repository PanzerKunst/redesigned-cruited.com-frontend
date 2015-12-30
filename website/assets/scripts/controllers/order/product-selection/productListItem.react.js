"use strict";

CR.Controllers.ProductListItem = React.createClass({
    render: function() {
        let product = this.props.product;
        let checkboxId = "product-" + product.id;

        let fullPriceParagraph = product.reducedPrice ? <p className="full-price">{product.price.amount} {product.price.currencyCode}</p> : null;

        let isInOrder = this._isInOrder();
        let liClasses = isInOrder ? "selected" : null;

        let pricesClasses = "prices";
        if (product.reducedPrice) {
            pricesClasses += " with-reduction";
        }

        let currentPrice = product.reducedPrice || product.price;

        return (
            <li ref="li" className={liClasses} onClick={this._handleListItemClick}>
                <div className="checkbox checkbox-primary">
                    <input type="checkbox" id={checkboxId} checked={isInOrder} onChange={this._toggleProduct} />
                    <label htmlFor={checkboxId}>{CR.i18nMessages["order.productSelection.productsSection.productName." + product.code]}</label>
                </div>
                <div className={pricesClasses}>
                    {fullPriceParagraph}
                    <p className="current-price">
                        <span className="amount">{currentPrice.amount}</span>
                        <span className="currency-code">{currentPrice.currencyCode}</span>
                    </p>
                </div>
            </li>
        );
    },

    componentDidMount: function() {
        this._initElements();
    },

    _initElements: function() {
        this.$listItem = $(ReactDOM.findDOMNode(this.refs.li));
        this.$checkbox = this.$listItem.find("input[type=\"checkbox\"]");
        this.$checkboxLabel = this.$checkbox.siblings("label");
    },

    _isInOrder: function() {
        let foundProduct = _.find(CR.order.getProducts(), function(product) {
            return product.id === this.props.product.id;
        }.bind(this));

        return foundProduct !== undefined;
    },

    _handleListItemClick: function(e) {
        if (e.target !== this.$checkbox[0] && e.target !== this.$checkboxLabel[0]) {
            this.$checkbox.prop("checked", !this.$checkbox.prop("checked"));
            this._toggleProduct();
        }
    },

    _toggleProduct: function() {
        if (this.$checkbox.prop("checked")) {
            CR.order.addProduct(this.props.product);
        } else {
            CR.order.removeProduct(this.props.product);
        }
        CR.order.saveInLocalStorage();

        this.props.controller.reRender();
    }
});
