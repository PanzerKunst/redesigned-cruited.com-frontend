"use strict";

CR.Controllers.OrderStepPayment = P(function(c) {
    c.reactClass = React.createClass({
        render: function() {
            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["order.payment.title"]}</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.payment.subtitle"]}</span>

                        <CR.Controllers.OrderStepBreadcrumbs step={CR.Controllers.OrderCommon.steps.payment} />
                        <CR.Controllers.OrderSummary order={CR.order} />
                        <CR.Controllers.PaymentForm price={CR.order.getTotalPrice()} currency={CR.order.getProducts()[0].price.currencyCode} />
                    </div>
                </div>
            );
        }
    });

    c.init = function(i18nMessages, products, reductions, orderId, loggedInAccount) {
        CR.i18nMessages = i18nMessages;
        CR.products = products;
        CR.reductions = reductions;
        CR.loggedInAccount = loggedInAccount;

        let orderFromLocalStorage = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.order);
        CR.order = CR.Models.Order(orderFromLocalStorage);
        CR.order.setId(orderId);
        CR.order.saveInLocalStorage();

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );
    };
});
