import Comment from "../../models/comment";
import store from "./store";

const Component = React.createClass({
    render() {
        const c = this.props.comment;
        const validationErrors = this.props.validationErrors;

        const liClasses = classNames({
            "report-comment": true,
            "from-list": c.isRedSelected,
            custom: Comment.isCustom(c)
        });

        const paragraphClasses = classNames({
            "comment-paragraph": true,
            "has-errors": validationErrors && validationErrors.areBracketsRemaining
        });

        return (
            <li ref="root" data-comment-id={c.id} className={liClasses}>
                <p className={paragraphClasses} onBlur={this._handleParagraphBlur}>{c.redText}</p>
                <button type="button" className="styleless fa fa-arrows fa-fw" />
                <button type="button" className="styleless fa fa-clone fa-fw" onClick={this._handleVariationsClick} />
                {this._resetBtn()}
                <button type="button" className="styleless fa fa-trash fa-fw" onClick={this._handleRemoveClick} />
                {this._idAndPoints()}
            </li>);
    },

    componentDidMount() {
        this._initElements();

        if (!store.isOrderReadOnly()) {
            this.$commentParagraph.attr("contenteditable", "true");
        }
    },

    _initElements() {
        this.$li = $(ReactDOM.findDOMNode(this.refs.root));
        this.$commentParagraph = this.$li.children(".comment-paragraph");
    },

    _resetBtn() {
        if (Comment.isCustom(this.props.comment)) {
            return null;
        }

        return <button type="button" className="styleless fa fa-undo fa-fw" onClick={this._handleResetClick} />;
    },

    _idAndPoints() {
        const c = this.props.comment;

        if (Comment.isCustom(c)) {
            return <div className="id-and-points"/>;
        }

        return (
            <div className="id-and-points">
                <p>{c.id}</p>
                <p>{c.points}pt</p>
            </div>);
    },

    _handleParagraphBlur(e) {
        const c = this.props.comment;
        const $p = $(e.currentTarget);

        c.redText = $p.text().trim();
        c.isRedSelected = true;
        c.isGreenSelected = false;

        store.updateCommentInListAndReport(c);

        if ($p.hasClass("has-errors") && Comment.isTextValidForReport(c.redText)) {
            store.validateReportForm();
        }
    },

    _handleVariationsClick() {
        if (!store.isOrderReadOnly()) {
            store.setVariationsModalForComment(this.props.comment);
        }
    },

    _handleResetClick() {
        if (!store.isOrderReadOnly()) {
            store.setConfirmResetCommentModal(this.props.comment);
        }
    },

    _handleRemoveClick() {
        if (!store.isOrderReadOnly()) {
            store.setConfirmRemoveReportCommentModal(this.props.comment);
        }
    }
});

export {Component as default};
