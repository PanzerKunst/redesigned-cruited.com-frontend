CR.Controllers.ProductsSection = React.createClass({
    render() {
        return (
            <section id="products-section" className="two-columns">
                <h2>{CR.i18nMessages["order.productSelection.productsSection.title"]}</h2>
                <div>
                    <header>
                        <div className="alert alert-info guarantee-panel" role="alert">
                            <p dangerouslySetInnerHTML={{__html: CR.i18nMessages["moneyBackGuarantee.text"]}} />
                        </div>
                    </header>
                    <div>
                        <ul className="styleless" id="product-list">
                            {this.props.products.map(function(product, index) {
                                return <CR.Controllers.ProductListItem key={index} product={product} controller={this.props.controller} />;
                            }.bind(this))}
                        </ul>

                        <div className="centered-contents" id="how-to-get-it-for-free-link-wrapper">
                            <a onClick={this._handleHowToGetItForFreeLinkClick}>{CR.i18nMessages["order.productSelection.productsSection.howToGetItForFree.link.text"]}</a>
                        </div>

                        <CR.Controllers.HowToGetItForFreeModal lang={this.props.currentLanguageCode} />
                    </div>
                </div>
            </section>);
    },

    componentDidMount() {
        this._initElements();
    },

    _initElements() {
        this.$howToGetItForFreeModal = $("#how-to-get-it-for-free-modal");
    },

    _handleHowToGetItForFreeLinkClick() {
        this.$howToGetItForFreeModal.modal();
    }
});
