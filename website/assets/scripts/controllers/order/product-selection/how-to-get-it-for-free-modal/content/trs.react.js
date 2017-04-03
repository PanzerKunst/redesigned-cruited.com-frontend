CR.Controllers.ModalContentTRS = React.createClass({
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
                    <span className="logo trs"/>
                </div>

                <p>Trygghetsrådet TRS hjälper dig som blivit uppsagd inom ideell sektor och inom kulturområdet.</p>

                <h4>Så får du din kod</h4>

                <p>(Kommer snart)</p>
            </div>);
    },

    _contentEn() {
        return (
            <div>
                <div className="centered-contents">
                    <span className="logo trs"/>
                </div>

                <p>Trygghetsrådet TRS offers help to people who have been made redundant within non-profit organizations
                    and within the cultural sector.</p>

                <h4>How to get your coupon code</h4>

                <p>(Coming soon)</p>
            </div>);
    }
});
