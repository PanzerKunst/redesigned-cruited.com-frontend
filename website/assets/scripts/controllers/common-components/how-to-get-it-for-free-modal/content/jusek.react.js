CR.Controllers.ModalContentJusek = React.createClass({
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
                    <span className="logo jusek"/>
                </div>

                <p>Jusek är det ledande akademikerförbundet för jurister, ekonomer, systemvetare, personalvetare,
                    kommunikatörer och samhällsvetare. Ett fackförbund som stärker medlemmarnas konkurrenskraft genom
                    hela karriären. Är du inte medlem? <a href="https://www.jusek.se/medlemskap/blimedlem"
                                                          target="_blank">Ansök nu</a>.
                </p>

                <h4>Så får du din kod</h4>

                <p>Som medlem kan du kostnadsfritt göra en bedömning av cv, personligt brev eller LinkedIn-profil. Logga
                    in på jusek.se för att <a
                        href="https://www.jusek.se/Logga-in?ReturnUrl=/karriar/karriartjanster/kodjobbansokan"
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
                    <span className="logo jusek"/>
                </div>

                <p>Jusek is a Swedish Union of University Graduates of Law, Business Administration and Economics,
                    Computer and Systems Science, Personnel Management, Professional Communicators and Social Science.
                    The union's main task is to reinforce the competitive edge and the position of individual members in
                    the labour market. Not a member? <a href="https://www.jusek.se/medlemskap/blimedlem"
                                                        target="_blank">Apply now</a>.
                </p>

                <h4>How to get your coupon code</h4>

                <p>As a member in Jusek you can get help free of charge with your CV, cover letter or LinkedIn profile.
                    Login to jusek.se to <a
                        href="https://www.jusek.se/Logga-in?ReturnUrl=/karriar/karriartjanster/kodjobbansokan"
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
