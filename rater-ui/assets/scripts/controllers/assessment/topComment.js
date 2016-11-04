import store from "./store";

const Component = React.createClass({
    render() {
        const c = this.props.comment;

        return (
            <li ref="root" data-comment-id={c.id}>
                <p onBlur={this._handleParagraphBlur}>{c.redText}</p>
                <button type="button" className="styleless fa fa-undo" onClick={this._handleResetClick} />
                <button type="button" className="styleless fa fa-trash" onClick={this._handleRemoveClick} />
            </li>);
    },

    componentDidMount() {
        this._initElements();
    },

    _initElements() {
        const $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

        this.$p = $rootEl.children("p");

        this.$p.attr("contenteditable", "true");
    },

    _handleParagraphBlur() {
        const c = this.props.comment;

        c.redText = this.$p.text();

        store.updateTopComment(c);
    },

    _handleResetClick() {
        store.resetTopComment(this.props.comment);
    },

    _handleRemoveClick() {
        store.removeTopComment(this.props.comment);
    }
});

export {Component as default};
