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

            return (
                <div id="content">
                    <div id="page-header-bar">
                        <h1>{CR.i18nMessages["dashboard.title"]}</h1>
                        <a className="btn btn-danger" id="new-assessment" href="/order">{CR.i18nMessages["dashboard.newAssessmentBtn.text"]}
                            <i className="fa fa-plus"></i>
                        </a>
                    </div>
                    <div className="with-circles">
                        <span>{CR.Services.String.template(CR.i18nMessages["dashboard.subtitle"], "firstName", this.state.account.firstName)}</span>
                        <ul className="styleless">
                            {this.state.orders.map(function(order, index) {
                                let reactItemId = "order-" + index;

                                return (
                                    <li key={reactItemId}>
                                        <h2 dangerouslySetInnerHTML={{__html: this._getOrderTitle(order)}} />
                                        <p>
                                            <span>{CR.i18nMessages["dashboard.creationDate.label"]}:</span> {moment(order.creationTimestamp).format("lll")}
                                        </p>
                                        <p>
                                            <span>{CR.i18nMessages["dashboard.status.label"]}:</span> {this._getOrderStatus(order)}
                                            <span>{CR.i18nMessages["edition.name." + order.edition.code]}</span>
                                        </p>

                                        <ul className="styleless">
                                            {order.containedProductCodes.map(function(productCode, i) {
                                                let reactItmId = "product-code-" + i;

                                                return <CR.Controllers.OrderedDocumentAssessment key={reactItmId} order={order} productCode={productCode} />;
                                            })}
                                        </ul>
                                    </li>
                                );
                            }.bind(this))}
                        </ul>
                    </div>
                </div>
            );
        },

        _getOrderTitle: function(order) {
            let inner = CR.i18nMessages["dashboard.defaultListItem.title"];

            if (order.positionSought && order.employerSought) {
                inner = order.positionSought + " - " + order.employerSought;
            } else if (order.positionSought) {
                inner = order.positionSought;
            } else if (order.employerSought) {
                inner = order.employerSought;
            }

            if (!order.jobAdUrl) {
                return inner;
            }

            let outer = "<a href=\"" + order.jobAdUrl + "\" target=\"_blank\">{inner}</a>";
            return CR.Services.String.template(outer, "inner", inner);
        },

        _getOrderStatus: function(order) {
            switch (order.status) {
                case CR.Models.OrderStaticProps.statusIds.notPaid:
                    return CR.i18nMessages["dashboard.status.notPaid.text"];
                case CR.Models.OrderStaticProps.statusIds.paid:
                    return CR.i18nMessages["dashboard.status.paid.text"];
                case CR.Models.OrderStaticProps.statusIds.completed:
                    return CR.i18nMessages["dashboard.status.completed.text"];
                default:
                    return CR.i18nMessages["dashboard.status.inProgress.text"];
            }
        }
    });

    c.init = function(i18nMessages, account, orders) {
        CR.i18nMessages = i18nMessages;
        this.account = account;
        this.orders = orders;

        this.reactInstance = React.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();

        // Clearing the current order in local storage
        CR.order = CR.Models.Order();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            account: this.account,
            orders: this.orders
        });
    };
});
