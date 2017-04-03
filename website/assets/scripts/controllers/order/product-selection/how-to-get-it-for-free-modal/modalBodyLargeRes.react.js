CR.Controllers.ModalBodyLargeRes = React.createClass({
    render() {
        const lang = this.props.lang;

        return (
            <div className="modal-body large-res detail-panel" ref="modalBody">
                <ul className="styleless">
                    <li>{CR.i18nMessages["order.productSelection.productsSection.howToGetItForFree.listItem.jusek"]}</li>
                    <li>{CR.i18nMessages["order.productSelection.productsSection.howToGetItForFree.listItem.vision"]}</li>
                    <li>{CR.i18nMessages["order.productSelection.productsSection.howToGetItForFree.listItem.unionenEgenforetagare"]}</li>
                    <li>{CR.i18nMessages["order.productSelection.productsSection.howToGetItForFree.listItem.tsn"]}</li>
                    <li>{CR.i18nMessages["order.productSelection.productsSection.howToGetItForFree.listItem.trs"]}</li>
                    <li>{CR.i18nMessages["order.productSelection.productsSection.howToGetItForFree.listItem.ki"]}</li>
                </ul>
                <CR.Controllers.ModalContentJusek lang={lang}/>
                <CR.Controllers.ModalContentVision lang={lang}/>
                <CR.Controllers.ModalContentUnionenEgenforetagare lang={lang}/>
                <CR.Controllers.ModalContentTSN lang={lang}/>
                <CR.Controllers.ModalContentTRS lang={lang}/>
                <CR.Controllers.ModalContentKI lang={lang}/>
            </div>);
    },

    componentDidMount() {
        this._initElements();

        this.detailPanel = _.assign(Object.create(CR.DetailPanel), {
            $list: this.$list,
            $contentPanels: this.$contentPanels
        });

        this.detailPanel.init();
    },

    _initElements() {
        const $root = $(ReactDOM.findDOMNode(this.refs.modalBody));

        this.$list = $root.children("ul");
        this.$contentPanels = $root.children("div");
    }
});
