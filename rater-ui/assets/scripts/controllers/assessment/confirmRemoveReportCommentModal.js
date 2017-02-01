import store from "./store";

const Component = React.createClass({
    render() {
        const commentToRemove = store.commentToRemove;

        if (!commentToRemove) {
            return null;
        }

        return (
            <div id="confirm-remove-report-comment-modal" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h3 className="modal-title">{`Remove comment ${commentToRemove.id} from the report?`}</h3>
                        </div>
                        <div className="modal-body">
                            <p>{commentToRemove.redText}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this._handleRemoveClick}>Remove this comment from the report</button>
                        </div>
                    </div>
                </div>
            </div>);
    },

    componentDidUpdate() {
        this._initElements();
        this._initEvents();

        if (store.commentToRemove) {
            this.$modal.modal();
        }
    },

    _initElements() {
        this.$modal = $("#confirm-remove-report-comment-modal");
    },

    _initEvents() {
        if (!_.isEmpty(this.$modal)) {
            const modalEvents = $._data(this.$modal.get(0), "events");

            if (!_.has(modalEvents, "hide")) {
                this.$modal.on("hide.bs.modal", () => {
                    store.commentToRemove = null;
                });
            }
        }
    },

    _handleRemoveClick() {
        store.removeReportComment();

        this.$modal.modal("hide");
    }
});

export {Component as default};
