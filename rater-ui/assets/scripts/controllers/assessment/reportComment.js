import store from "./store";

const Component = React.createClass({
    render() {
        const c = this.props.comment;
        const liClasses = classNames({
            "from-list": c.isRedSelected,
            "well-done": c.isWellDone
        });

        return (
            <li ref="root" data-comment-id={c.id} className={liClasses}>
                <span className="fa fa-bars"></span>
                <p className="comment-paragraph" onBlur={this._handleParagraphBlur}>{c.redText}</p>
                <button type="button" className="styleless fa fa-trash" onClick={this._handleRemoveClick} />
            </li>);
    },

    componentDidMount() {
        this._initElements();
    },

    _initElements() {
        const $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

        $rootEl.children("p").attr("contenteditable", "true");
    },

    _handleParagraphBlur(e) {
        const c = this.props.comment;

        c.redText = $(e.currentTarget).text();

        store.addOrUpdateReportComment(c);
    },

    _handleRemoveClick() {
        store.removeReportComment(this.props.comment);
    }
});

export {Component as default};
