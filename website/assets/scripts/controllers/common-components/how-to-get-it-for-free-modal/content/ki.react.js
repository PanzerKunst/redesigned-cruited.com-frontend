CR.Controllers.ModalContentKI = React.createClass({
    render() {
        if (this.props.lang === CR.languageCodes.en) {
            return this._contentEn();
        }

        return this._contentSv();
    },

    _contentSv() {
        return (
            <div>
                <div className="centered-contents">
                    <span className="logo ki"/>
                </div>

                <p>Som doktorand eller forskare på KI har du rätt till bedömning av din jobbansökan, både för akademiska
                    tjänster och för tjänster i näringslivet.</p>

                <h4>Så får du din kod</h4>

                <p><a href="https://internwebben.ki.se/en/career-service" target="_blank">Kontakta karriärcenter</a> för
                    att få din kod.</p>
            </div>);
    },

    _contentEn() {
        return (
            <div>
                <div className="centered-contents">
                    <span className="logo ki"/>
                </div>

                <p>For postdocs and researchers at KI we offer an assessment for free. Make an assessment both when you
                    are applying for an academic position or for a position in the private or public sector.</p>

                <h4>How to get your coupon code</h4>

                <p><a href="https://internwebben.ki.se/en/career-service" target="_blank">Contact KI Career
                    Service</a> to get your code.</p>
            </div>);
    }
});
