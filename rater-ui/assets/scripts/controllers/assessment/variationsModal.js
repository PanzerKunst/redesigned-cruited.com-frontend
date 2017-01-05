import store from "./store";

const Component = React.createClass({
    render() {
        const currentDefaultComment = store.currentDefaultComment;

        if (!currentDefaultComment) {
            return null;
        }

        const variations = _.filter(store.allCommentVariations, v => v.defaultComment.id === currentDefaultComment.id);

        // TODO: remove
        console.log("store.allCommentVariations", store.allCommentVariations);
        console.log("variations", variations);

        return (
            <div id="variations-modal" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h3 className="modal-title">Variations</h3>
                        </div>
                        <div className="modal-body">
                            <ul className="styleless">
                                <li key={currentDefaultComment.id} onClick={this._handleDefaultCommentClick}>
                                    {this._listItemContents(currentDefaultComment.redText, {code: "PRO"})}
                                </li>

                            {variations.map(variation =>
                                <li key={variation.id} onClick={this._handleVariationClick} data-variation-id={variation.id}>
                                    {this._listItemContents(variation.text, variation.edition)}
                                </li>
                            )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>);
    },

    componentDidUpdate() {
        this._initElements();

        if (store.currentDefaultComment && !_.isEmpty(this.$listItems)) {
            this.$modal.modal();
        }
    },

    _initElements() {
        this.$modal = $("#variations-modal");
        this.$listItems = this.$modal.find("li");
    },

    _listItemContents(variationText, edition) {
        const tag = edition ? edition.code : "English";

        return (
            <div>
                <p>{variationText}</p>
                <span className="variation-tag">{tag}</span>
            </div>);
    },

    _handleDefaultCommentClick() {
        const c = store.currentDefaultComment;

        c.isGreenSelected = false;
        c.isRedSelected = true;

        store.updateListComment(c);
        store.selectNextCommentAsRedIfGrouped(c.id);

        this._finishClickHandling();
    },

    _handleVariationClick(e) {
        const $li = $(e.currentTarget);
        const variationId = $li.data("variation-id");
        const variation = _.find(store.allCommentVariations, v => v.id === variationId);

        store.updateListComment(variation);
        store.selectNextCommentAsRedIfGrouped(variation.defaultComment.id);

        this._finishClickHandling();
    },

    _finishClickHandling() {
        store.currentDefaultComment = null;
        this.$modal.modal("hide");
    }
});

export {Component as default};
