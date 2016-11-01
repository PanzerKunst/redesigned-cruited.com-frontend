import store from "./store";

const Component = React.createClass({
    getInitialState() {
        return this.props;
    },

    render() {
        const ac = this.state.assessmentComment;

        const greenParagraphClasses = classNames({
            selected: ac.isGreenSelected
        });
        const redParagraphClasses = classNames({
            selected: ac.isRedSelected
        });

        return (
            <li ref="root">
                <div className="assessment-comment id-and-points">
                    <p>{ac.id}</p>
                    <p>{ac.points}</p>
                </div>
                <div className="assessment-comment green">
                    <p className={greenParagraphClasses} onClick={this._handleGreenParagraphClick}>{ac.greenText}</p>
                </div>
                <div className="assessment-comment red">
                    <p className={redParagraphClasses} onClick={this._handleRedParagraphClick} onBlur={this._handleRedParagraphBlur}>{ac.redText}</p>
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
