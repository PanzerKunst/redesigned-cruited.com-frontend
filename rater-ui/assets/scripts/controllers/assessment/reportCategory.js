import Category from "../../models/category";
import Assessment from "../../models/assessment";
import StringUtils from "../../services/string";
import Keyboard from "../../services/keyboard";
import store from "./store";

// eslint-disable-next-line no-unused-vars
import ReportComment from "./reportComment";

const Component = React.createClass({
    render() {
        const categoryId = this.props.categoryId;

        return (
            <li ref="root">
                <h3>{Category.titles[store.order.languageCode][categoryId]}</h3>
                <button type="button" className="styleless fa fa-undo" onClick={this._handleResetClick} />
                <ul className="styleless">
                {Assessment.reportComments(this.props.categoryProductCode, categoryId).map(comment =>
                        <ReportComment key={`top-comment-${comment.id}`} comment={comment} />
                )}
                </ul>
                <div className="comment-composer">
                    <p onKeyUp={this._handleComposerKeyUp} />
                    <button type="button" className="styleless fa fa-times" onClick={this._hideComposer} />
                </div>
                <a onClick={this._handleAddCommentClick}>+ Add comment</a>
            </li>);
    },

    componentDidMount() {
        this._initElements();
    },

    _initElements() {
        const $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

        this.$composer = $rootEl.children(".comment-composer");

        this.$composer.children("p").attr("contenteditable", "true");
    },

    _handleResetClick() {
        store.resetCategory(this.props.categoryId);
    },

    _handleAddCommentClick() {
        this.$composer.show();
    },

    _handleComposerKeyUp(e) {
        const $p = $(e.currentTarget);

        if (e.keyCode === Keyboard.keyCodes.enter) {
            this._hideComposer();

            store.addOrUpdateReportComment({
                id: StringUtils.uuid(),
                categoryId: this.props.categoryId,
                redText: $p.text()
            });

            $p.text(null);
        }
    },

    _hideComposer() {
        this.$composer.hide();
    }
});

export {Component as default};
