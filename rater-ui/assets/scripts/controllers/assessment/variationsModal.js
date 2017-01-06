import store from "./store";

const Component = React.createClass({
    render() {
        const currentDefaultComment = store.currentDefaultComment;

        if (!currentDefaultComment) {
            return null;
        }

        const variations = _.filter(store.allCommentVariations, v => v.defaultComment.id === currentDefaultComment.id);

        return (
            <div id="variations-modal" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h3 className="modal-title">Select variation</h3>
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
        this._initEvents();

        if (store.currentDefaultComment && !_.isEmpty(this.$listItems)) {
            this.$modal.modal();
        }
    },

    _initElements() {
        this.$modal = $("#variations-modal");
        this.$listItems = this.$modal.find("li");
    },

    _initEvents() {
        if (!_.isEmpty(this.$modal)) {
            const modalEvents = $._data(this.$modal.get(0), "events");

            if (!_.has(modalEvents, "hide")) {
                this.$modal.on("hide.bs.modal", () => {
                    store.currentDefaultComment = null;
                });
            }
        }
    },

    _listItemContents(variationText, edition) {
        const tagText = edition ? edition.code : "English";

        let tagClasses = "variation-tag";

        tagClasses += edition && edition.code ? ` edition ${edition.code}` : " extra-language";

        return (
            <div>
                <p className="variation-text">{variationText}</p>
                <span className={tagClasses}>{tagText}</span>
            </div>);
    },

    _handleDefaultCommentClick() {
        const c = store.currentDefaultComment;

        store.variationSelected(c);
        store.selectNextCommentAsRedIfGrouped(c.id);

        this.$modal.modal("hide");
    },

    _handleVariationClick(e) {
        const $li = $(e.currentTarget);
        const variationId = $li.data("variation-id");
        const variation = _.find(store.allCommentVariations, v => v.id === variationId);

        store.variationSelected(variation);
        store.selectNextCommentAsRedIfGrouped(variation.defaultComment.id);

        this.$modal.modal("hide");
    }
});

export {Component as default};
