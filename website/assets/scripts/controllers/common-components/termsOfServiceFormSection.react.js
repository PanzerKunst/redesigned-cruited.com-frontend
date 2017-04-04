CR.Controllers.TermsOfServiceFormSection = React.createClass({
    render() {
        if (CR.loggedInAccount) {
            return null;
        }

        return (
            <div id="tos-wrapper" className="centered-contents">
                <div className="checkbox checkbox-primary">
                    <input type="checkbox" id="accept-tos" defaultChecked={CR.order.isTosAccepted()} />
                    <label htmlFor="accept-tos" dangerouslySetInnerHTML={{__html: CR.i18nMessages["order.assessmentInfo.form.tos.text"]}} />
                </div>
                <p className="field-error" data-check="empty" />
            </div>);
    }
});
