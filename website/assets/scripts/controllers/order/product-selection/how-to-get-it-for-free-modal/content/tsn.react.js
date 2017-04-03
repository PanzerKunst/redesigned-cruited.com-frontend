CR.Controllers.ModalContentTSN = React.createClass({
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
                    <span className="logo tsn"/>
                </div>

                <p>Trygghetsstiftelsen hjälper dig att komma vidare till ett nytt, om du blivit uppsagd från en statlig
                    anställning. Som kund får du en rad jobbsökaraktiveteter, däribland bedömning av cv, personligt brev
                    och LinkedIn-profil.</p>

                <h4>Så får du din kod</h4>

                <p>E-posta ditt namn och personnummer till <a href="mailto:cv@tsn.se">cv@tsn.se</a>. Du kommer att få
                    tillbaka en rabattkod. Det går också bra att prata med din konsulent.</p>
            </div>);
    },

    _contentEn() {
        return (
            <div>
                <div className="centered-contents">
                    <span className="logo tsn"/>
                </div>

                <p>The Job Foundation (Trygghetsstiftelsen) is for people who have been made reduntant from government
                    agencies. Trygghetsstiftelsen helps you get a new job.</p>

                <h4>How to get your coupon code</h4>

                <p>Send an e-mail with your name and personal identity number to <a
                    href="mailto:cv@tsn.se">cv@tsn.se</a>. You will get a reply with your coupon code. You can also talk
                    directly with your contact person at TSN.</p>
            </div>);
    }
});
