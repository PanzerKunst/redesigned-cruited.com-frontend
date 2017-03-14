CR.Controllers.ModalContentJusek = React.createClass({
    render() {

        /* TODO if (1 === 2) {     // Language === Swedish
            this._contentSv();
        } */

        return this._contentEn();
    },

    _contentSv() {
        return (
            <div>
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
                    <li>boka in ett karriärsamtal</li>
                    <li>få återkoppling inför en anställningsintervju</li>
                </ul>
            </div>);
    },

    _contentEn() {
        return (
            <div>
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
                    <li>boka in ett karriärsamtal</li>
                    <li>få återkoppling inför en anställningsintervju</li>
                </ul>
            </div>);
    }
});
