import Category from "../../models/category";
import Assessment from "../../models/assessment";
import StringUtils from "../../services/string";
import Keyboard from "../../services/keyboard";
import store from "./store";

// eslint-disable-next-line no-unused-vars
import ReportComment from "./reportComment";

const Component = React.createClass({
    getInitialState() {
        return {
            wellDoneComment: this.props.reportCategory.wellDoneComment || this._defaultWellDoneComment()
        };
    },

    render() {
        const reportCategory = this.props.reportCategory;

        return (
            <li ref="root" className="report-category">
                <h3>{Category.titles[store.order.languageCode][reportCategory.id]}</h3>
                <button type="button" className="styleless fa fa-undo" onClick={this._handleResetClick} />
                {this._wellDoneComment()}
                <ul className="styleless">
                {reportCategory.comments.map(comment =>
                        <ReportComment key={comment.id} comment={comment} />
                )}
                </ul>
                <div className="comment-composer">
                    <textarea className="form-control" onKeyUp={this._handleComposerKeyUp} />
                    <button type="button" className="styleless fa fa-times" onClick={this._hideComposer} />
                </div>
                <a onClick={this._handleAddCommentClick}>Add comment</a>
            </li>);
    },

    componentDidMount() {
        this._initElements();
    },

    _initElements() {
        const $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

        this.$wellDoneCommentComposer = $rootEl.children(".well-done-comment-composer");
        this.$wellDoneCommentTextarea = this.$wellDoneCommentComposer.children("textarea");

        this.$commentList = $rootEl.children("ul");

        this.$addCommentComposer = $rootEl.children(".comment-composer");
        this.$addCommentTextarea = this.$addCommentComposer.children("textarea");

        this._makeCommentsSortable();
    },

    _makeCommentsSortable() {

        // eslint-disable-next-line no-new
        new Sortable(this.$commentList.get(0), {
            animation: 150,
            onUpdate: e => store.handleReportCommentsReorder(this.props.reportCategory.id, e.oldIndex, e.newIndex),
            handle: ".fa-bars"
        });
    },

    _wellDoneComment() {
        if (Assessment.categoryScore(this.props.reportCategory.id) < Assessment.minScoreForWellDoneComment) {
            return null;
        }

        return (
            <div className="well-done-comment-composer">
                <label>Top comment</label>
                <textarea className="form-control" value={this.state.wellDoneComment} onChange={this._handleWellDoneCommentTextareaChange} onBlur={this._handleWellDoneCommentTextareaBlur}/>
            </div>);
    },

    _defaultWellDoneComment() {
        return Category.wellDoneComments[store.order.languageCode][this.props.reportCategory.id];
    },

    _handleResetClick() {
        store.resetReportCategory(this.props.reportCategory.id);
    },

    _handleAddCommentClick() {
        this.$addCommentComposer.show();
        this.$addCommentTextarea.focus();
        this._adaptTextareaHeight();
    },

    _handleComposerKeyUp(e) {
        this._adaptTextareaHeight();

        if (e.keyCode === Keyboard.keyCodes.enter) {
            this._hideComposer();

            store.addOrUpdateReportComment({
                id: StringUtils.uuid(),
                categoryId: this.props.reportCategory.id,
                redText: this.$addCommentTextarea.val()
            });

            this.$addCommentTextarea.val(null);
        }
    },

    _handleWellDoneCommentTextareaChange() {
        this.setState({
            wellDoneComment: this.$wellDoneCommentTextarea.val()
        });
    },

    _handleWellDoneCommentTextareaBlur() {
        const updatedReportCategory = this.props.reportCategory;

        updatedReportCategory.wellDoneComment = this.state.wellDoneComment;

        store.updateReportCategory(updatedReportCategory);
    },

    _adaptTextareaHeight() {
        const ta = this.$addCommentTextarea.get(0);

        if (ta.clientHeight < ta.scrollHeight) {
            ta.style.height = (ta.scrollHeight + 2) + "px";
        }
    },

    _hideComposer() {
        this.$addCommentComposer.hide();
    }
});

export {Component as default};
