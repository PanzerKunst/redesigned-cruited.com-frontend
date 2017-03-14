CR.Controllers.HowToGetItForFreeModal = React.createClass({
    render() {
        return (
            <div id="how-to-get-it-for-free-modal" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h3 className="modal-title">{CR.i18nMessages["order.productSelection.productsSection.howToGetItForFree.title"]}</h3>
                        </div>
                        <CR.Controllers.ModalBodySmallRes/>
                        <CR.Controllers.ModalBodyLargeRes/>
                    </div>
                </div>
            </div>);
    }
});
