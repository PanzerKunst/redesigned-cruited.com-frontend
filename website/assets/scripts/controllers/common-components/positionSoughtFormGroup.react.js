CR.Controllers.PositionSoughtFormGroup = React.createClass({
    render() {

        // To avoid losing value if the page is reloaded, for example by a Sign in with LI
        const positionSought = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.positionSought) || CR.order.getSoughtPosition();
        const label = CR.order.isForConsultant() ? CR.i18nMessages["order.assessmentInfo.form.positionSought.label.consult"] : CR.i18nMessages["order.assessmentInfo.form.positionSought.label"];

        return (
            <div className="form-group">
                <label htmlFor="position-sought">{label}</label>
                <input type="text" className="form-control" id="position-sought" maxLength="230" defaultValue={positionSought} />
            </div>);
    }
});
