CR.Controllers.ModalBodyLargeRes = React.createClass({
    render() {
        return (
            <div className="modal-body large-res detail-panel" ref="modalBody">
                <ul className="styleless">
                    <li>{CR.i18nMessages["order.productSelection.productsSection.howToGetItForFree.listItem.jusek"]}</li>
                    <li>{CR.i18nMessages["order.productSelection.productsSection.howToGetItForFree.listItem.vision"]}</li>
                </ul>
                <CR.Controllers.ModalContentJusek/>
                <CR.Controllers.ModalContentVision/>
            </div>);
    },

    componentDidMount() {
        this._initElements();

        this.detailPanel = Object.assign(Object.create(CR.DetailPanel), {
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
