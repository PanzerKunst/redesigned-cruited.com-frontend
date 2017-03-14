CR.Controllers.OrderedDocumentAssessment = React.createClass({
    render() {
        const isBtnDisabled = this.props.order.getStatus() !== CR.Models.OrderStaticProps.statusIds.completed;

        return (
            <li>
                <p>{CR.i18nMessages["product.name." + this.props.productCode]}</p>
                <div className="centered-contents">
                    <button className="btn btn-default" onClick={this._handleClick} disabled={isBtnDisabled}>{CR.i18nMessages["dashboard.viewReportBtn.text"]}</button>
                </div>
            </li>);
    },

    _handleClick() {
        location.href = "/reports/" + this.props.order.getId() + "?productCode=" + this.props.productCode;
    }
});
