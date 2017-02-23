import String from "../../services/string";
import Keyboard from "../../services/keyboard";
import store from "./store";

import ReportComment from "./reportComment";    // eslint-disable-line no-unused-vars

const Component = React.createClass({
    minScoreForWellDoneComment: 80,

    getInitialState() {
        return {
            wellDoneComment: this.props.reportCategory.wellDoneComment || this._defaultWellDoneComment()
        };
    },

    render() {
        const reportCategory = this.props.reportCategory;

        const liClasses = classNames({
            "report-category": true,
            "read-only": store.isOrderReadOnly()
        });

        return (
            <li ref="root" className={liClasses} id={`report-category-${reportCategory.id}`}>
                <h3>{store.i18nMessages[`category.title.${reportCategory.id}`]}</h3>
                {this._wellDoneComment()}
                <ul className="styleless">
                {reportCategory.comments.map(comment => {
                    if (comment === null) {
                        return null;
                    }

                    const commentId = comment.id;
                    const validationErrors = this.props.validationErrors ? this.props.validationErrors[commentId] : null;

                    return <ReportComment key={commentId} comment={comment} validationErrors={validationErrors} />;
                })}
                </ul>
                <div className="comment-composer hidden">
                    <textarea className="form-control" onKeyUp={this._handleComposerKeyUp} />
                    <button type="button" className="styleless fa fa-times" onClick={this._hideComposer} />
                </div>
                <button type="button" className="btn secondary" onClick={this._handleAddCommentClick}>Add comment</button>
            </li>);
    },

    componentDidUpdate() {
        this._initElements();
        this._disableActionableElementsIfRequired();
        this._makeCommentsSortable();
    },

    _initElements() {
        const $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

        this.$wellDoneCommentComposer = $rootEl.children(".well-done-comment-composer");
        this.$wellDoneCommentTextarea = this.$wellDoneCommentComposer.children("textarea");

        this.$commentList = $rootEl.children("ul");

        this.$addCommentComposer = $rootEl.children(".comment-composer");
        this.$addCommentTextarea = this.$addCommentComposer.children("textarea");
        this.$addCommentBtn = $rootEl.children(".btn");
    },

    _disableActionableElementsIfRequired() {
        if (store.isOrderReadOnly()) {
            this.$wellDoneCommentTextarea.prop("disabled", true);
            this.$addCommentBtn.prop("disabled", true);
            this.$addCommentTextarea.prop("disabled", true);
        }
    },

    _makeCommentsSortable() {
        if (!store.isOrderReadOnly()) {
            new Sortable(this.$commentList.get(0), {    // eslint-disable-line no-new
                animation: 150,
                onUpdate: e => store.handleReportCommentsReorder(this.props.reportCategory.id, e.oldIndex, e.newIndex),
                handle: ".fa-arrows"
            });
        }
    },

    _wellDoneComment() {
        if (store.assessment.categoryScore(this.props.reportCategory.id) < this.minScoreForWellDoneComment) {
            this._updateWellDoneComment(null);
            return null;
        }

        this._updateWellDoneComment(this.state.wellDoneComment.trim());

        return (
            <div className="well-done-comment-composer">
                <label>Top comment</label>
                <textarea className="form-control" value={this.state.wellDoneComment} onChange={this._handleWellDoneCommentChange} />
            </div>);
    },

    _defaultWellDoneComment() {
        return store.i18nMessages[`wellDone.comment.${this.props.reportCategory.id}`];
    },

    _handleAddCommentClick() {
        if (!store.isOrderReadOnly()) {
            this.$addCommentBtn.hide();
            this.$addCommentComposer.removeClass("hidden");
            this.$addCommentTextarea.focus();
            this._adaptTextareaHeight();
        }
    },

    _handleComposerKeyUp(e) {
        this._adaptTextareaHeight();

        if (e.keyCode === Keyboard.keyCodes.enter || e.keyCode === Keyboard.keyCodes.escape) {
            this._hideComposer();
        }

        if (e.keyCode === Keyboard.keyCodes.enter) {
            store.addReportComment({
                id: String.uuid(),
                categoryId: this.props.reportCategory.id,
                redText: this.$addCommentTextarea.val().trim()
            });

            this.$addCommentTextarea.val(null);
        }
    },

    _handleWellDoneCommentChange() {
        this.setState({
            wellDoneComment: this.$wellDoneCommentTextarea.val()
        });
    },

    _adaptTextareaHeight() {
        const ta = this.$addCommentTextarea.get(0);

        if (ta.clientHeight < ta.scrollHeight) {
            ta.style.height = (ta.scrollHeight + 2) + "px";
        }
    },

    _hideComposer() {
        this.$addCommentComposer.addClass("hidden");
        this.$addCommentBtn.show();
    },

    _updateWellDoneComment(wellDoneComment) {
        const updatedReportCategory = this.props.reportCategory;

        updatedReportCategory.wellDoneComment = wellDoneComment;

        store.assessment.updateReportCategory(updatedReportCategory);
    }
});

export {Component as default};
