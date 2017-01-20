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
                            <h3 className="modal-title">{`Select variation for ${currentDefaultComment.id}`}</h3>
                        </div>
                        <div className="modal-body">
                            <ul className="styleless">
                                <li key={currentDefaultComment.id} onClick={this._handleDefaultCommentClick}>
                                    <p className="variation-text">{currentDefaultComment.redText}</p>

                                    {this._listItemContents({
                                        edition: {
                                            code: "PRO"
                                        }
                                    })}
                                </li>

                            {variations.map(variation =>
                                <li key={variation.id} onClick={this._handleVariationClick} data-variation-id={variation.id}>
                                    <p className="variation-text">{variation.text}</p>
                                    {this._listItemContents(variation)}
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

    _listItemContents(variation) {
        const edition = variation.edition;
        const languageCode = variation.languageCode;

        let tagText = "";

        if (edition) {
            tagText = edition.code;
        } else if (languageCode) {
            tagText = "English";
        }

        let tagClasses = null;

        if (edition) {
            tagClasses = `edition ${edition.code}`;
        } else if (languageCode) {
            tagClasses = "extra-language";
        }

        return (
            <div className="variation-id-and-tag">
                <span className="variation-id">{variation.id}</span>
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
