CR.Controllers.LanguageSelectionInHeader = React.createClass({
    render() {
        const supportedLanguages = this.props.supportedLanguages;
        const currentLanguageCode = this.props.currentLanguageCode;

        return (
            <form ref="form" className="form-inline">
                <div className="form-group">
                    <label htmlFor="selected-language">Lang</label>
                    <select className="form-control" id="selected-language" value={currentLanguageCode} onChange={this._handleLanguageChange}>
                        {supportedLanguages.map(function(supportedLanguage) {
                            const ietfCode = supportedLanguage.ietfCode;
                            const shortName = ietfCode.replace(/^./, function($1) {
                                return $1.toUpperCase();
                            });

                            return <option key={supportedLanguage.id} value={ietfCode}>{shortName}</option>;
                        })}
                    </select>
                </div>
                <div className="form-group medium-screen">
                    <label htmlFor="selected-language-medium-screen">Language</label>
                    <select className="form-control" id="selected-language-medium-screen" value={currentLanguageCode} onChange={this._handleLanguageChange}>
                        {supportedLanguages.map(function(supportedLanguage) {
                            return <option key={supportedLanguage.id} value={supportedLanguage.ietfCode}>{supportedLanguage.name}</option>;
                        })}
                    </select>
                </div>
            </form>);
    },

    _handleLanguageChange(e) {
        const $dropdown = $(e.currentTarget);

        location.replace(`${this.props.url}?lang=${$dropdown.val()}`);
    }
});
