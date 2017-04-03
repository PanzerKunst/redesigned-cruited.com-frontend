CR.Controllers.CartProductListItem = React.createClass({
    render() {
        const product = this.props.product;

        const classes = classNames({
            editable: this.props.isEditable,
            "with-edition": this.props.product.code !== CR.Models.Product.codes.CV_REVIEW_CONSULT && this.props.product.code !== CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW_CONSULT
        });

        return (
            <li className={classes}>
                <span>
                    <p className="cart-product-name">{CR.i18nMessages["product.name." + product.code]}</p>
                    <CR.Controllers.EditionElement edition={CR.order.getEdition()} />
                </span>
                <span className="cart-product-price">{product.price.amount}&nbsp;{product.price.currencyCode}{this._deleteButton()}</span>
            </li>);
    },

    _deleteButton() {
        if (!this.props.isEditable) {
            return null;
        }

        return <button className="styleless fa fa-times" onClick={this._handleClick} />;
    },

    _handleClick() {
        CR.order.removeProduct(this.props.product);
        CR.order.saveInLocalStorage();

        this.props.controller.reRender();
    }
});
