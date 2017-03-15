CR.Controllers.ModalContentVision = React.createClass({
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
                    <span className="logo vision"/>
                </div>

                <p>Som medlem kan du kostnadsfritt göra en bedömning av cv, personligt brev eller LinkedIn-profil.
                    Vision är fackförbundet för dig som arbetar inom kommun, landsting, region, kyrka eller i ett bolag
                    med koppling till välfärden. Vision kan göra skillnad, både för dig på din arbetsplats och i
                    utvecklingen av framtiden jobb. Är du inte medlem? <a href="https://vision.se/Medlem/Bli-medlem"
                                                                          target="_blank">Ansök nu</a>.
                </p>

                <h4>Så får du din kod</h4>

                <p>Logga in på vision.se för att <a
                    href="https://vision.se/Din-utveckling/Karriar/CV-granskning/Granska-cv"
                    target="_blank">beställa din rabattkod</a>. Du får koden direkt och din granskning blir
                    kostnadsfri.</p>

                <h4>Som medlem kan du kostnadsfritt även</h4>

                <ul>
                    <li>Boka in ett karriärsamtal</li>
                    <li>Få återkoppling inför en anställningsintervju</li>
                </ul>
            </div>);
    },

    _contentEn() {
        return (
            <div>
                <div className="centered-contents">
                    <span className="logo vision"/>
                </div>

                <p>Vision is the trade union for anyone working in municipalities, county councils and churches. Vision
                    has 180.000 members. Together we can make sure that you get what you need for success in your
                    career. Not a member? <a href="https://vision.se/Medlem/Bli-medlem"
                                             target="_blank">Apply now</a>.
                </p>

                <h4>How to get your coupon code</h4>

                <p>As a member in Vision you can get help free of charge with your CV, cover letter or LinkedIn
                    profile. Login to vision.se to <a
                        href="https://vision.se/Din-utveckling/Karriar/CV-granskning/Granska-cv"
                        target="_blank">get your coupon code</a>. You'll get your code instantly and your assessment
                    will be free of charge.</p>

                <h4>Other services, free of charge</h4>

                <ul>
                    <li>Schedule a call with one of our career agents</li>
                    <li>Get feedback and training for an upcoming job interview</li>
                </ul>
            </div>);
    }
});
