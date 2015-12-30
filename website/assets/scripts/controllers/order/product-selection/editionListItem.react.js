"use strict";

CR.Controllers.EditionListItem = React.createClass({
    render: function() {
        let editionId = this.props.edition.id;
        let editionCode = this.props.edition.code;
        let radioId = "edition-" + editionId;

        let isThisEditionSelected = this._isThisEditionSelected();

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
                        <span>{CR.i18nMessages["edition.name.long." + editionCode]}</span>
                        <p>{CR.i18nMessages["order.productSelection.editionsSection.editionDescription.text." + editionCode]}</p>
                    </label>
                </div>
            </li>
        );
    },

    componentDidMount: function() {
        this._initElements();
    },

    _initElements: function() {
        this.$listItem = $(ReactDOM.findDOMNode(this.refs.li));
        this.$radio = this.$listItem.find("input[type=\"radio\"]");
        this.$radioLabel = this.$radio.siblings("label");
    },

    _isThisEditionSelected: function() {
        return CR.order.getEdition() && CR.order.getEdition().id === this.props.edition.id;
    },

    _handleListItemClick: function(e) {
        if (e.target !== this.$radio[0] && e.target !== this.$radioLabel[0] && !this.$radio.prop("checked")) {
            this.$radio.prop("checked", true);
            this._setEdition();
        }
    },

    _setEdition: function() {
        CR.order.setEdition(this.props.edition);
        CR.order.saveInLocalStorage();

        this.props.controller.reRender();
    }
});
