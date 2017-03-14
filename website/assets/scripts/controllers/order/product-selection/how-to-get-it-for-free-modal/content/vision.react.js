CR.Controllers.ModalContentVision = React.createClass({
    render() {

        /* TODO if (1 === 2) {     // Language === Swedish
         this._contentSv();
         } */

        return this._contentEn();
    },

    _contentSv() {
        return (
            <div>
                <p>Som medlem kan du kostnadsfritt göra en bedömning av cv, personligt brev eller LinkedIn-profil.
                    Vision är fackförbundet för dig som arbetar inom kommun, landsting, region, kyrka eller i ett bolag
                    med koppling till välfärden. Vision kan göra skillnad, både för dig på din arbetsplats och i
                    utvecklingen av framtiden jobb. Är du inte medlem? <a
                        href="https://www.jusek.se/medlemskap/blimedlem"
                        target="_blank">Ansök nu</a>.
                </p>

                <h4>Så får du din kod</h4>

                <p>Logga in på vision.se för att <a
                        href="https://www.jusek.se/Logga-in?ReturnUrl=/karriar/karriartjanster/kodjobbansokan"
                        target="_blank">beställa din rabattkod</a>. Du får koden direkt och din granskning blir
                    kostnadsfri.</p>

                <h4>Som medlem kan du kostnadsfritt även</h4>

                <ul>
                    <li>boka in ett karriärsamtal</li>
                    <li>få återkoppling inför en anställningsintervju</li>
                </ul>
            </div>);
    },

    _contentEn() {
        return (
            <div>
                <p>Som medlem kan du kostnadsfritt göra en bedömning av cv, personligt brev eller LinkedIn-profil.
                    Vision är fackförbundet för dig som arbetar inom kommun, landsting, region, kyrka eller i ett bolag
                    med koppling till välfärden. Vision kan göra skillnad, både för dig på din arbetsplats och i
                    utvecklingen av framtiden jobb. Är du inte medlem? <a
                        href="https://www.jusek.se/medlemskap/blimedlem"
                        target="_blank">Ansök nu</a>.
                </p>

                <h4>Så får du din kod</h4>

                <p>Logga in på vision.se för att <a
                    href="https://www.jusek.se/Logga-in?ReturnUrl=/karriar/karriartjanster/kodjobbansokan"
                    target="_blank">beställa din rabattkod</a>. Du får koden direkt och din granskning blir
                    kostnadsfri.</p>

                <h4>Som medlem kan du kostnadsfritt även</h4>

                <ul>
                    <li>boka in ett karriärsamtal</li>
                    <li>få återkoppling inför en anställningsintervju</li>
                </ul>
            </div>);
    }
});
