import store from "./store";

const Component = React.createClass({
    render() {
        const ac = this.props.assessmentComment;

        return (
            <li ref="root">
                <div className="default-comment green">
                    <p>{ac.greenText}</p>
                </div>
                <div className="default-comment red">
                    <p onClick={this._handleTextClick}>{ac.redText}</p>
                    <textarea defaultValue={ac.redText} onBlur={this._handleTextAreaBlur} />
                </div>
            </li>
        );
    },

    componentDidMount() {
        this._initElements();
    },

    _initElements() {
        const $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

        this.$textareas = $rootEl.find("textarea");

        this._initTextareasHeight();
    },

    _initTextareasHeight() {
        _.forEach(this.$textareas, ta => {
            if (ta.clientHeight < ta.scrollHeight) {
                ta.style.height = (ta.scrollHeight + 2) + "px";
            }
        });
    },

    _handleTextClick(e) {
        const $p = $(e.currentTarget);
        const $ta = $p.siblings();

        $p.hide();
        $ta.show();
        this._initTextareaHeight($ta.get(0));
        $ta.focus();
    },

    _handleTextAreaBlur(e) {
        const $ta = $(e.currentTarget);
        const $p = $ta.siblings();
        const newRedText = $ta.val();

        $p.text(newRedText);
        $ta.hide();
        $p.show();

        store.assessment.updateListComment(this.props.assessmentComment.id, newRedText);
    },

    _initTextareaHeight(ta) {
        if (ta.clientHeight < ta.scrollHeight) {
            ta.style.height = (ta.scrollHeight + 2) + "px";
        }
    }
});

export {Component as default};
