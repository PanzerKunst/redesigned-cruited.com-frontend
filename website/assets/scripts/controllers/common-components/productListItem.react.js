CR.Controllers.ProductListItem = React.createClass({
    render() {
        const product = this.props.product;
        const checkboxId = "product-" + product.id;

        const isInOrder = this._isInOrder();
        const cartProductsCount = CR.order.getProducts().length;

        if (!isInOrder && cartProductsCount > 0) {
            const reductionForTwoProductsSameOrder = _.find(CR.reductions, reduction => reduction.code === CR.Models.Reduction.codes.TWO_PRODUCTS_SAME_ORDER);
            const rductionForThreeProductsSameOrdr = _.find(CR.reductions, reduction => reduction.code === CR.Models.Reduction.codes.THREE_PRODUCTS_SAME_ORDER);

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
            fullPriceParagraph = <p className="full-price">{CR.Models.Product.displayPrice(product.price.amount, product)} {product.price.currencyCode}</p>;
            pricesClasses += " with-reduction";
        }

        const liClasses = classNames({
            selected: isInOrder,
            "read-only": this.props.readOnly
        });

        const checkboxWrapperClasses = classNames({
            checkbox: true,
            "checkbox-primary": !this.props.readOnly
        });

        const currentPrice = product.reducedPrice || product.price;

        return (
            <li ref="li" className={liClasses} onClick={this._handleListItemClick}>
                <div className={checkboxWrapperClasses}>
                    {this._checkboxInput(checkboxId, isInOrder)}
                    <label htmlFor={checkboxId}>{CR.i18nMessages["product.name." + product.code]}</label>
                </div>
                <div className={pricesClasses}>
                    {fullPriceParagraph}
                    <p className="current-price">
                        <span className="amount">{CR.Models.Product.displayPrice(currentPrice.amount, product)}</span>
                        <span className="currency-code">{currentPrice.currencyCode}</span>
                    </p>
                </div>
            </li>
        );
    },

    componentDidMount() {
        this._initElements();
    },

    _initElements() {
        this.$listItem = $(ReactDOM.findDOMNode(this.refs.li));
        this.$checkbox = this.$listItem.find("input[type=\"checkbox\"]");
        this.$checkboxLabel = this.$checkbox.siblings("label");
    },

    _isInOrder() {
        const foundProduct = _.find(CR.order.getProducts(), product => product.id === this.props.product.id);

        return foundProduct !== undefined;  // eslint-disable-line no-undefined
    },

    _checkboxInput(checkboxId, isInOrder) {
        if (this.props.readOnly) {
            return <input type="checkbox" id={checkboxId} checked={isInOrder} disabled />;
        }

        return <input type="checkbox" id={checkboxId} checked={isInOrder} onChange={this._toggleProduct} />;
    },

    _handleListItemClick(e) {
        if (e.target !== this.$checkbox[0] && e.target !== this.$checkboxLabel[0] && !this.$listItem.hasClass("read-only")) {
            this.$checkbox.prop("checked", !this.$checkbox.prop("checked"));
            this._toggleProduct();
        }
    },

    _toggleProduct() {
        if (this.$listItem.hasClass("read-only")) {
            return false;
        }

        if (this.$checkbox.prop("checked")) {
            CR.order.addProduct(this.props.product);
        } else {
            CR.order.removeProduct(this.props.product);
        }
        CR.order.saveInLocalStorage();

        this.props.controller.reRender();

        return null;
    }
});
