import store from "./store";

const Component = React.createClass({
    getInitialState() {
        return this.props;
    },

    render() {
        const ac = this.state.assessmentComment;

        const listCommentClasses = classNames({
            "list-comment": true,
            grouped: ac.isGrouped
        });

        const greenParagraphClasses = classNames({
            selected: ac.isGreenSelected
        });
        const redParagraphClasses = classNames({
            selected: ac.isRedSelected
        });

        return (
            <li ref="root" className={listCommentClasses}>
                <div className="green">
                    <p className={greenParagraphClasses} onClick={this._handleGreenParagraphClick}>{ac.greenText}</p>
                </div>
                <div className="red">
                    <p className={redParagraphClasses} onClick={this._handleRedParagraphClick} onBlur={this._handleRedParagraphBlur}>{ac.redText}</p>
                </div>
                <div className="id-and-points">
                    <p>{ac.id}</p>
                    <p>{ac.points}pt</p>
                </div>
            </li>
        );
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
        _.forEach(this.$redParagraphs, p => {
            $(p).attr("contenteditable", "true");
        });
    },

    _handleGreenParagraphClick() {
        const comment = this.state.assessmentComment;

        comment.isRedSelected = false;
        comment.isGreenSelected = true;

        this._updateAssessmentInStoreAndRefreshUi(comment);
    },

    _handleRedParagraphClick() {
        const comment = this.state.assessmentComment;

        comment.isGreenSelected = false;
        comment.isRedSelected = true;

        this._updateAssessmentInStoreAndRefreshUi(comment);
    },

    _handleRedParagraphBlur(e) {
        const comment = this.state.assessmentComment;

        comment.redText = $(e.currentTarget).text();

        this._updateAssessmentInStoreAndRefreshUi(comment);
    },

    _updateAssessmentInStoreAndRefreshUi(comment) {
        this.setState({
            assessmentComment: comment
        });

        store.assessment.updateListComment(comment);
    }
});

export {Component as default};
