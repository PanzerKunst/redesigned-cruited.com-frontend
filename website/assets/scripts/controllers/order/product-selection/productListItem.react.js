"use strict";

CR.Controllers.ProductListItem = React.createClass({
    render: function() {
        const product = this.props.product;
        const checkboxId = "product-" + product.id;

        const isInOrder = this._isInOrder();
        const cartProductsCount = CR.order.getProducts().length;

        if (!isInOrder && cartProductsCount > 0) {
            const reductionForTwoProductsSameOrder = _.find(CR.reductions, function(reduction) {
                return reduction.code === CR.Models.Reduction.codes.TWO_PRODUCTS_SAME_ORDER;
            });

            const rductionForThreeProductsSameOrdr = _.find(CR.reductions, function(reduction) {
                return reduction.code === CR.Models.Reduction.codes.THREE_PRODUCTS_SAME_ORDER;
            });

            if (cartProductsCount === 1) {
                product.reducedPrice = {
                    amount: product.price.amount - reductionForTwoProductsSameOrder.price.amount,
                    currencyCode: product.price.currencyCode
                };
            } else if (cartProductsCount === 2) {
                product.reducedPrice = {
                    amount: product.price.amount - (rductionForThreeProductsSameOrdr.price.amount - reductionForTwoProductsSameOrder.price.amount),
                    currencyCode: product.price.currencyCode
                };
            }
        }

        let pricesClasses = "prices";
        let fullPriceParagraph = null;

        if (product.reducedPrice) {
            fullPriceParagraph = <p className="full-price">{product.price.amount} {product.price.currencyCode}</p>;
            pricesClasses += " with-reduction";
        }

        const liClasses = isInOrder ? "selected" : null;
        const currentPrice = product.reducedPrice || product.price;

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
        const foundProduct = _.find(CR.order.getProducts(), function(product) {
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
