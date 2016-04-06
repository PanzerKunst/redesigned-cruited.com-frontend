"use strict";

CR.Controllers.LanguageDropdown = React.createClass({
    render: function() {
        const currentLanguageCode = $("html").attr("lang");

        if (this.props.isShortVersion) {
            return (
                <select className="form-control" id={this.props.id} defaultValue={currentLanguageCode} onChange={this._handleChange}>
                    {CR.supportedLanguages.map(function(supportedLanguage) {
                        const ietfCode = supportedLanguage.ietfCode;
                        const shortName = ietfCode.replace(/^./, function($1) {
                            return $1.toUpperCase();
                        });

                        return <option key={supportedLanguage.id} value={ietfCode}>{shortName}</option>;
                    })}
                </select>
            );
        }

        return (
            <select className="form-control" id={this.props.id} defaultValue={currentLanguageCode} onChange={this._handleChange}>
                {CR.supportedLanguages.map(function(supportedLanguage) {
                    return <option key={supportedLanguage.id} value={supportedLanguage.ietfCode}>{supportedLanguage.name}</option>;
                })}
            </select>
        );
    },

    _handleChange: function(e) {
        const $dropdown = $(e.currentTarget);
        location.replace("/order?lang=" + $dropdown.val());
    }
});
