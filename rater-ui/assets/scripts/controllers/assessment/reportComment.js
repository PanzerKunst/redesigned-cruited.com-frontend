import {animationDurations} from "../../global";
import {fadeOut} from "../../services/animator";
import Comment from "../../models/comment";
import store from "./store";

const Component = React.createClass({
    render() {
        const c = this.props.comment;
        const validationErrors = this.props.validationErrors;

        const liClasses = classNames({
            "report-comment": true,
            "from-list": c.isRedSelected,
            "well-done": c.isWellDone
        });

        const paragraphClasses = classNames({
            "comment-paragraph": true,
            "has-errors": validationErrors && validationErrors.areBracketsRemaining
        });

        /* TODO: remove
        const checkboxClasses = classNames({
            "report-comment-checkbox": true,
            checked: c.isChecked,
            "has-errors": validationErrors && validationErrors.isUnChecked
        }); */

        return (
            <li ref="root" data-comment-id={c.id} className={liClasses}>
                <p className={paragraphClasses} onBlur={this._handleParagraphBlur}>{c.redText}</p>
                <button type="button" className="styleless fa fa-arrows fa-fw" />
                <button type="button" className="styleless fa fa-clone fa-fw" onClick={this._handleVariationsClick} />
                <button type="button" className="styleless fa fa-undo fa-fw" onClick={this._handleResetClick} />
                <button type="button" className="styleless fa fa-trash fa-fw" onClick={this._handleRemoveClick} />

                <div className="id-and-points">
                    <p>{c.id}</p>
                    <p>{c.points}pt</p>
                </div>
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

    _handleParagraphBlur(e) {
        const c = this.props.comment;
        const $p = $(e.currentTarget);

        c.redText = $p.text();

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
            store.resetCommentInListAndReport(this.props.comment);
        }
    },

    _handleRemoveClick() {
        if (!store.isOrderReadOnly()) {
            fadeOut(this.$li, {
                animationDuration: animationDurations.short,
                onComplete: () => store.removeReportComment(this.props.comment)
            });
        }
    } /* TODO: remove ,

    _handleCheckboxClick(e) {
        if (!store.isOrderReadOnly()) {
            const updatedComment = this.props.comment;

            updatedComment.isChecked = updatedComment.isChecked ? false : true;

            store.updateReportCommentIfExists(updatedComment);

            if ($(e.currentTarget).hasClass("has-errors") && updatedComment.isChecked) {
                store.validateReportForm();
            }
        }
    } */
});

export {Component as default};
