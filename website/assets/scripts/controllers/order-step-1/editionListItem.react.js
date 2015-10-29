"use strict";

CR.Controllers.EditionListItem = React.createClass({
    render: function() {
        var radioId = "edition-" + this.props.edition.id;

        return (
            <li ref="li">
                <div className="radio radio-primary">
                    <input type="radio" name="editions" id={radioId} value={this.props.edition.id} checked={this._isThisEditionSelected()} onChange={this._handleEditionChanged} />
                    <label htmlFor={radioId}>{CR.i18nMessages["edition.name." + this.props.edition.code]}</label>
                </div>
            </li>
            );
    },

    _isThisEditionSelected: function() {
        return CR.order.getEdition() && CR.order.getEdition().id === this.props.edition.id;
    },

    _handleEditionChanged: function() {
        CR.order.setEdition(this.props.edition);
        this.props.controller.reRender();
    }
});
