import store from "./store";

const Component = React.createClass({
    render() {
        const c = this.props.comment;

        const listCommentClasses = classNames({
            "list-comment": true,
            grouped: c.isGrouped
        });

        const greenParagraphClasses = classNames({
            "comment-paragraph": true,
            selected: c.isGreenSelected
        });
        const redParagraphClasses = classNames({
            "comment-paragraph": true,
            selected: c.isRedSelected
        });

        return (
            <li ref="root" className={listCommentClasses}>
                <div className="green">
                    <p className={greenParagraphClasses} onClick={this._handleGreenParagraphClick}>{c.greenText}</p>
                </div>
                <div className="red">
                    <p className={redParagraphClasses} onClick={this._handleRedParagraphClick} onBlur={this._handleRedParagraphBlur}>{c.redText}</p>
                </div>
                <div className="id-and-points">
                    <p>{c.id}</p>
                    <p>{c.points}pt</p>
                </div>
            </li>);
    },

    componentDidMount() {
        this._initElements();
    },

    _initElements() {
        const $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

        this.$redParagraphs = $rootEl.children(".red").children("p");

        this._addContentEditableToParagraphs();
    },

    _addContentEditableToParagraphs() {
        _.forEach(this.$redParagraphs, p =>
                $(p).attr("contenteditable", "true")
        );
    },

    _handleGreenParagraphClick() {
        const c = this.props.comment;

        c.isRedSelected = false;

        // TODO: remove
        c.isGreenSelected = !c.isGreenSelected;

        /* TODO: uncomment when the above code is removed
         comment.isGreenSelected = true; */

        store.updateListComment(c);
    },

    _handleRedParagraphClick() {
        const c = this.props.comment;

        c.isGreenSelected = false;
        c.isRedSelected = true;

        store.updateListComment(c);
    },

    _handleRedParagraphBlur(e) {
        const c = this.props.comment;

        c.redText = $(e.currentTarget).text();

        store.updateListComment(c);
    }
});

export {Component as default};
