CR.Controllers.ModalBodySmallRes = React.createClass({
    render() {
        return (
            <div className="modal-body small-res" ref="modalBody">
                <article className="expandable-panel alt">
                    <header>
                        <span>{CR.i18nMessages["order.productSelection.productsSection.howToGetItForFree.listItem.jusek"]}</span>
                    </header>
                    <CR.Controllers.ModalContentJusek/>
                </article>

                <article className="expandable-panel alt">
                    <header>
                        <span>{CR.i18nMessages["order.productSelection.productsSection.howToGetItForFree.listItem.vision"]}</span>
                    </header>
                    <CR.Controllers.ModalContentVision/>
                </article>
            </div>);
    },

    componentDidMount() {
        this._initElements();
        this.$expandablePanels.makeAltExpandable();
        this._expandFirst();
    },

    _initElements() {
        const $root = $(ReactDOM.findDOMNode(this.refs.modalBody));

        this.$expandablePanels = $root.find(".expandable-panel.alt");
        this.$firstExpandablePanel = $(this.$expandablePanels.get(0));
    },

    _expandFirst() {
        this.$firstExpandablePanel.addClass("expanded");
        this.$firstExpandablePanel.children("div").css("display", "block");
    }
});
