CR.Controllers.ModalContentUnionenEgenforetagare = React.createClass({
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
                    <span className="logo unionen-egen"/>
                </div>

                <p>Unionen Egenföretagare är ett skräddarsytt medlemskap för dig som driver eget företag med primärt
                    tjänstemannauppgifter. Du får bland annat inkomstförsäkringar och affärscoachning. Är du inte melem?
                    <a href="https://www.unionen.se/bli-medlem/egenforetagare" target="_blank">Ansök nu</a>.
                </p>

                <h4>Så får du din kod</h4>

                <p>Ring Företagslinjen på <a href="tel:+4620-743 743">020-743 743</a> eller mejla <a
                    href="mailto:foretagslinjen@unionen.se">foretagslinjen@unionen.se</a>. Du får koden direkt och din
                    granskning blir kostnadsfri.</p>
            </div>);
    },

    _contentEn() {
        return (
            <div>
                <div className="centered-contents">
                    <span className="logo unionen-egen"/>
                </div>

                <p>Unionen is Sweden's largest trade union and Unionen Egenföretagare is the membership for anyone who's
                    self-employed. Benefits include insurance, business coaching and help with your LinkedIn profile.
                    Not a member? <a href="https://www.unionen.se/bli-medlem/egenforetagare" target="_blank">Apply
                        now</a>.
                </p>

                <h4>How to get your coupon code</h4>

                <p>Call the member service at <a href="tel:+4620-743 743">020-743 743</a> or send an e-mail to <a
                    href="mailto:foretagslinjen@unionen.se">foretagslinjen@unionen.se</a>. You'll get your code and the
                    assessment is free of charge.</p>
            </div>);
    }
});
