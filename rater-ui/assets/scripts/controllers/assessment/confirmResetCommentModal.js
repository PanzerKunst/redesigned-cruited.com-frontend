import store from "./store";

const Component = React.createClass({
    render() {
        const commentToReset = store.commentToReset;

        if (!commentToReset) {
            return null;
        }

        const originalComment = store.assessment.originalComment(commentToReset);

        if (commentToReset.redText === originalComment.redText) {
            store.commentToReset = null;
            return null;
        }

        return (
            <div id="confirm-reset-comment-modal" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h3 className="modal-title">{`Reset comment ${commentToReset.id}?`}</h3>
                        </div>
                        <div className="modal-body">
                            <article>
                                <h4>Current text</h4>
                                <p>{commentToReset.redText}</p>
                            </article>
                            <article>
                                <h4>Original text</h4>
                                <p>{originalComment.redText}</p>
                            </article>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this._handleResetClick}>Reset comment</button>
                        </div>
                    </div>
                </div>
            </div>);
    },

    componentDidUpdate() {
        this._initElements();
        this._initEvents();

        if (store.commentToReset) {
            this.$modal.modal();
        }
    },

    _initElements() {
        this.$modal = $("#confirm-reset-comment-modal");
    },

    _initEvents() {
        if (!_.isEmpty(this.$modal)) {
            const modalEvents = $._data(this.$modal.get(0), "events");

            if (!_.has(modalEvents, "hide")) {
                this.$modal.on("hide.bs.modal", () => {
                    store.commentToReset = null;
                });
            }
        }
    },

    _handleResetClick() {
        store.resetCommentInListAndReport();

        this.$modal.modal("hide");
    }
});

export {Component as default};
