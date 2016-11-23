import store from "./store";

const Component = React.createClass({
    render() {
        const c = this.props.comment;

        const liClasses = classNames({
            "report-comment": true,
            "from-list": c.isRedSelected,
            "well-done": c.isWellDone
        });

        const checkboxClasses = classNames({
            "report-comment-checkbox": true,
            checked: c.isChecked
        });

        return (
            <li ref="root" data-comment-id={c.id} className={liClasses}>
                <button type="button" className="styleless fa fa-arrows fa-fw" />
                <p className="comment-paragraph" onBlur={this._handleParagraphBlur}>{c.redText}</p>
                <span className={checkboxClasses} onClick={this._handleCheckboxClick}/>
                <button type="button" className="styleless fa fa-undo fa-fw" onClick={this._handleResetClick} />
                <button type="button" className="styleless fa fa-trash fa-fw" onClick={this._handleRemoveClick} />
            </li>);
    },

    componentDidMount() {
        this._initElements();

        if (!store.isOrderReadOnly()) {
            this.$commentParagraph.attr("contenteditable", "true");
        }
    },

    _initElements() {
        const $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

        this.$commentParagraph = $rootEl.children(".comment-paragraph");
    },

    _handleParagraphBlur(e) {
        const c = this.props.comment;

        c.redText = $(e.currentTarget).text();

        store.updateCommentInListAndReport(c);
    },

    _handleResetClick() {
        if (!store.isOrderReadOnly()) {
            store.resetCommentInListAndReport(this.props.comment);
        }
    },

    _handleRemoveClick() {
        if (!store.isOrderReadOnly()) {
            store.removeReportComment(this.props.comment);
        }
    },

    _handleCheckboxClick() {
        if (!store.isOrderReadOnly()) {
            const updatedComment = this.props.comment;

            updatedComment.isChecked = updatedComment.isChecked ? false : true;

            store.updateReportCommentIfExists(updatedComment);
        }
    }
});

export {Component as default};
