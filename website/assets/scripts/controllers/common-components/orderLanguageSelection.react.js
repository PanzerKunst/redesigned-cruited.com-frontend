"use strict";

CR.Controllers.OrderLanguageSelection = React.createClass({
    render: function() {
        const supportedLanguages = this.props.supportedLanguages;
        const currentLanguageCode = this.props.currentLanguageCode;

        return (
            <section className="two-columns widow">
                <header>
                    <p className="light-font">{CR.i18nMessages["order.productSelection.languageSection.subtitle"]}</p>
                </header>
                <form ref="form">
                    <div className="form-group">
                        <select className="form-control" value={currentLanguageCode} onChange={this._handleLanguageChange}>
                            {supportedLanguages.map(function(supportedLanguage) {
                                return <option key={supportedLanguage.id} value={supportedLanguage.ietfCode}>{supportedLanguage.name}</option>;
                            })}
                        </select>
                    </div>
                </form>
            </section>);
    },

    _handleLanguageChange: function(e) {
        const $dropdown = $(e.currentTarget);
        location.replace(`${this.props.url}?lang=${$dropdown.val()}`);
    }
});
