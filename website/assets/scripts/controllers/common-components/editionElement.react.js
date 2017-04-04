CR.Controllers.EditionElement = React.createClass({
    render() {
        if (!this.props.edition) {
            return null;
        }

        const editionCode = this.props.edition.code;

        return <span className={`edition ${editionCode}`}>{CR.i18nMessages[`edition.name.${editionCode}`]}</span>;
    }
});
