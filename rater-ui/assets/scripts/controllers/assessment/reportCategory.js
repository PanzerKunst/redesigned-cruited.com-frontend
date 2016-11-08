import Category from "../../models/category";
import Assessment from "../../models/assessment";
import StringUtils from "../../services/string";
import Keyboard from "../../services/keyboard";
import store from "./store";

// eslint-disable-next-line no-unused-vars
import ReportComment from "./reportComment";

const Component = React.createClass({
    render() {
        const categoryProductCode = this.props.categoryProductCode;
        const categoryId = this.props.categoryId;

        this.reportCategory = Assessment.reportCategory(categoryProductCode, categoryId);

        return (
            <li ref="root" className="report-category">
                <h3>{Category.titles[store.order.languageCode][categoryId]}</h3>
                <button type="button" className="styleless fa fa-undo" onClick={this._handleResetClick} />
                {this._wellDoneComment()}
                <ul className="styleless">
                {this.reportCategory.comments.map(comment =>
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

        this.$commentList = $rootEl.children("ul");
        this.$composer = $rootEl.children(".comment-composer");
        this.$textarea = this.$composer.children("textarea");

        this._makeCommentsSortable();
    },

    _makeCommentsSortable() {

        // eslint-disable-next-line no-new
        new Sortable(this.$commentList.get(0), {
            animation: 150,
            onUpdate: e => store.handleReportCommentsReorder(this.props.categoryId, e.oldIndex, e.newIndex),
            handle: ".fa-bars"
        });
    },

    _wellDoneComment() {
        if (Assessment.categoryScore(this.props.categoryId) < Assessment.minScoreForWellDoneComment) {
            return null;
        }

        const wellDoneCommentText = this.reportCategory.wellDoneComment || "Well done m8!";

        return (
            <div>
                <label>Top comment</label>
                <textarea className="form-control" defaultValue={wellDoneCommentText}/>
            </div>);
    },

    _handleResetClick() {
        store.resetCategory(this.props.categoryId);
    },

    _handleAddCommentClick() {
        this.$composer.show();
        this.$textarea.focus();
        this._adaptTextareaHeight();
    },

    _handleComposerKeyUp(e) {
        this._adaptTextareaHeight();

        if (e.keyCode === Keyboard.keyCodes.enter) {
            this._hideComposer();

            store.addOrUpdateReportComment({
                id: StringUtils.uuid(),
                categoryId: this.props.categoryId,
                redText: this.$textarea.val()
            });

            this.$textarea.val(null);
        }
    },

    _adaptTextareaHeight() {
        const ta = this.$textarea.get(0);

        if (ta.clientHeight < ta.scrollHeight) {
            ta.style.height = (ta.scrollHeight + 2) + "px";
        }
    },

    _hideComposer() {
        this.$composer.hide();
    }
});

export {Component as default};
