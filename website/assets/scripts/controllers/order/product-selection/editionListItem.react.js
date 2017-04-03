CR.Controllers.EditionListItem = React.createClass({
    render() {
        const editionId = this.props.edition.id;
        const editionCode = this.props.edition.code;
        const radioId = "edition-" + editionId;

        const isThisEditionSelected = this._isThisEditionSelected();

        let liClasses = editionCode;

        if (isThisEditionSelected) {
            liClasses += " selected";
        }

        return (
            <li ref="li" className={liClasses} onClick={this._handleListItemClick}>
                <div className="edition-icon" />
                <div className="radio radio-primary">
                    <input type="radio" name="editions" id={radioId} value={editionId} checked={isThisEditionSelected} onChange={this._setEdition} />
                    <label htmlFor={radioId}>
                        <span>{CR.i18nMessages["edition.name." + editionCode]}</span>
                        <p>{CR.i18nMessages["order.productSelection.editionsSection.editionDescription.text." + editionCode]}</p>
                    </label>
                </div>
            </li>
        );
    },

    componentDidMount() {
        this._initElements();
    },

    _initElements() {
        this.$listItem = $(ReactDOM.findDOMNode(this.refs.li));
        this.$radio = this.$listItem.find("input[type=\"radio\"]");
        this.$radioLabel = this.$radio.siblings("label");
    },

    _isThisEditionSelected() {
        return CR.order.getEdition() && CR.order.getEdition().id === this.props.edition.id;
    },

    _handleListItemClick(e) {
        if (e.target !== this.$radio[0] && e.target !== this.$radioLabel[0] && !this.$radio.prop("checked")) {
            this.$radio.prop("checked", true);
            this._setEdition();
        }
    },

    _setEdition() {
        CR.order.setEdition(this.props.edition);
        CR.order.saveInLocalStorage();

        this.props.controller.reRender();
    }
});
