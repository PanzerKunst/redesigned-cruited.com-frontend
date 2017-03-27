CR.Controllers.EmployerSoughtFormGroup = React.createClass({
    render() {

        // To avoid losing value if the page is reloaded, for example by a Sign in with LI
        const employerSought = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.employerSought) || CR.order.getSoughtEmployer();

        return (
            <div className="form-group">
                <label htmlFor="employer-sought">{CR.i18nMessages["order.assessmentInfo.form.employerSought.label"]}</label>
                <input type="text" className="form-control" id="employer-sought" maxLength="230" defaultValue={employerSought} />
            </div>);
    }
});
