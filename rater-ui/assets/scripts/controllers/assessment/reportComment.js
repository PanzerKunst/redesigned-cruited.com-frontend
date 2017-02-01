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
            "from-list": c.isRedSelected
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
                <button type="button" className="styleless fa fa-undo fa-fw" onClick={this._handleResetClick} />
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

    _idAndPoints() {
        const c = this.props.comment;

        if (_.isNaN(_.toNumber(c.id))) {
            return <div className="id-and-points"></div>;
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

        c.redText = $p.text();
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
    }
});

export {Component as default};
