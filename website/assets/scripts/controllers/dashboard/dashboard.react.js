"use strict";

CR.Controllers.Dashboard = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                account: null,
                orders: []
            };
        },

        render: function() {
            if (!this.state.account) {
                return null;
            }

            const newAssessmentBtnLabel = CR.Services.Browser.isSmallScreen() ? null : CR.i18nMessages["dashboard.newAssessmentBtn.text"];

            return (
                <div id="content">
                    <header id="header-with-new-assessment-btn">
                        <div>
                            <h1>{CR.i18nMessages["dashboard.title"]}</h1>
                            <a className="btn btn-danger new-assessment" href="/order">{newAssessmentBtnLabel}
                                <i className="fa fa-plus"></i>
                            </a>
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{CR.Services.String.template(CR.i18nMessages["dashboard.subtitle"], "firstName", this.state.account.firstName)}</span>
                        <ul className="styleless">
                            {this.state.orders.map(function(order, index) {
                                let completePaymentLink = null;

                                if (order.getStatus() === CR.Models.OrderStaticProps.statusIds.notPaid) {
                                    const url = "/order/complete-payment?orderId=" + order.getId();
                                    completePaymentLink = (<div>
                                        <a href={url} className="btn btn-primary btn-xs">{CR.i18nMessages["dashboard.completePaymentLink.text"]}</a>
                                    </div>);
                                }

                                let editOrderMarkup = null;
                                if (order.getStatus() < CR.Models.OrderStaticProps.statusIds.inProgress) {
                                    const url = "/order/edit?id=" + order.getId();
                                    editOrderMarkup = <p className="light-font" dangerouslySetInnerHTML={{__html: CR.Services.String.template(CR.i18nMessages["dashboard.editOrder.text"], "url", url)}} />;
                                }

                                const reactItemId = "order-" + index;
                                const editionClasses = "edition " + order.getEdition().code;
                                const statusClasses = "status " + order.getStatusForHtml();

                                let editionKey = "edition.name." + order.getEdition().code;
                                if (CR.Services.Browser.isSmallScreen()) {
                                    editionKey = "edition.name.short." + order.getEdition().code;
                                }

                                return (
                                    <li key={reactItemId} className="sheet-of-paper">
                                        <h2 dangerouslySetInnerHTML={{__html: this._getOrderTitle(order)}} />
                                        <p>
                                            <span className="assessment-label light-font">{CR.i18nMessages["order.creationDate.label"]}:</span>{moment(order.getCreationTimestamp()).format("lll")}
                                        </p>
                                        <section className="status-and-edition-wrapper">
                                            <div>
                                                <div>
                                                    <span className="assessment-label light-font">{CR.i18nMessages["order.status.label"]}:</span>
                                                    <span className={statusClasses}>{order.getStatusForHtml()}</span>
                                                </div>
                                                {completePaymentLink}
                                            </div>
                                            <div>
                                                <span className={editionClasses}>{CR.i18nMessages[editionKey]}</span>
                                            </div>
                                        </section>

                                        <ul className="styleless view-report-list">
                                            {order.getProducts().map(function(product, i) {
                                                const reactItmId = "product-" + i;

                                                return <CR.Controllers.OrderedDocumentAssessment key={reactItmId} order={order} productCode={product.code} />;
                                            })}
                                        </ul>
                                        {editOrderMarkup}
                                    </li>
                                );
                            }.bind(this))}
                        </ul>
                    </div>
                </div>
            );
        },

        _getOrderTitle: function(order) {
            const inner = order.getTitleForHtml();

            if (!order.jobAdUrl) {
                return inner;
            }

            const outer = "<a href=\"" + order.jobAdUrl + "\" target=\"_blank\">{inner}</a>";
            return CR.Services.String.template(outer, "inner", inner);
        }
    });

    c.init = function(i18nMessages, account, orders) {
        CR.i18nMessages = i18nMessages;
        this.account = account;

        this.orders = orders.map(function(order) {
            return CR.Models.Order(order);
        });

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();

        // Clearing the current order in local storage
        CR.order = CR.Models.Order();
        CR.order.saveInLocalStorage();

        // Clearing other dirty deeds in local storage
        CR.Services.Browser.removeFromLocalStorage(CR.localStorageKeys.positionSought);
        CR.Services.Browser.removeFromLocalStorage(CR.localStorageKeys.employerSought);
        CR.Services.Browser.removeFromLocalStorage(CR.localStorageKeys.jobAdUrl);
        CR.Services.Browser.removeFromLocalStorage(CR.localStorageKeys.customerComment);
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            account: this.account,
            orders: this.orders
        });
    };
});
