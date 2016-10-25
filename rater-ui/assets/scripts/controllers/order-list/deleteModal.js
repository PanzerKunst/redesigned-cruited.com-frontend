
const DeleteModal = React.createClass({
    render() {
        return (
            <div id="delete-modal" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h3 className="modal-title">Delete</h3>
                        </div>
                        <div className="modal-body">
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    componentDidMount() {
        this._initElements();
    },

    _initElements() {
        this.$modal = $("#delete-modal");

        /* TODO
         $modal.on("show.bs.modal", function(e) {
         // Disable the rater currently assigned to the order
         }); */
    }
});

export {DeleteModal as default};
