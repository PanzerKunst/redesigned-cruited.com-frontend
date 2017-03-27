CR.Controllers.Dashboard = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState() {
            return {
                account: null,
                orders: []
            };
        },

        render() {
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
                                <i className="fa fa-plus"/>
                            </a>
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{CR.Services.String.template(CR.i18nMessages["dashboard.subtitle"], "firstName", this.state.account.firstName)}</span>
                        <div className="alert alert-success alert-dismissible" role="alert">
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <p dangerouslySetInnerHTML={{__html: CR.i18nMessages["dashboard.orderCompleted.alert.text"]}} />
                        </div>
                        <div className="alert alert-info alert-dismissible" role="alert" id="assessment-waiting-alert">
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <p dangerouslySetInnerHTML={{__html: CR.i18nMessages["dashboard.assessmentWaiting.alert.text"]}} />
                        </div>
                        <div className="alert alert-info alert-dismissible" role="alert" id="assessment-in-progress-alert">
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <p dangerouslySetInnerHTML={{__html: CR.i18nMessages["dashboard.assessmentInProgress.alert.text"]}} />
                        </div>
                        <ul className="styleless">
                            {this.state.orders.map(function(order, index) {
                                let completePaymentLink = null;

                                if (order.getStatus() === CR.Models.OrderStaticProps.statusIds.notPaid) {
                                    const url = "/order/complete-payment?orderId=" + order.getId();

                                    completePaymentLink = (<div>
                                        <a href={url} className="btn btn-primary btn-xs">{CR.i18nMessages["dashboard.completePaymentLink.text"]}</a>
                                    </div>);
                                }

                                const statusClasses = "status " + order.getStatusForHtml();

                                return (
                                    <li key={index} className="sheet-of-paper">
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
                                            <div className="centered-contents">
                                                <CR.Controllers.EditionElement edition={order.getEdition()} />
                                            </div>
                                        </section>

                                        <ul className="styleless view-report-list">
                                            {order.getProducts().map(function(product, i) {
                                                const reactItmId = "product-" + i;

                                                return <CR.Controllers.OrderedDocumentAssessment key={reactItmId} order={order} productCode={product.code} />;
                                            })}
                                        </ul>
                                        {this._editOrderParagraph(order)}
                                    </li>
                                );
                            }.bind(this))}
                        </ul>
                    </div>
                </div>
            );
        },

        _getOrderTitle(order) {
            const inner = order.getTitleForHtml();

            if (!order.jobAdUrl) {
                return inner;
            }

            const outer = `<a href="${order.jobAdUrl}" target="_blank">{inner}</a>`;

            return CR.Services.String.template(outer, "inner", inner);
        },


        componentDidUpdate() {
            this._initElements();
            this._showAlertIfNeeded();
        },

        _initElements() {
            this.$content = $("#content");
            this.$orderCompletedAlert = this.$content.find(".alert-success");
            this.$assessmentWaitingAlert = this.$content.find("#assessment-waiting-alert");
            this.$assessmentInProgressAlert = this.$content.find("#assessment-in-progress-alert");
        },

        _editOrderParagraph(order) {
            if (order.getStatus() >= CR.Models.OrderStaticProps.statusIds.inProgress) {
                return null;
            }

            const url = `/order/edit?id=${order.getId()}`;

            return <p className="light-font" dangerouslySetInnerHTML={{__html: CR.Services.String.template(CR.i18nMessages["dashboard.editOrder.text"], "url", url)}} />;
        },

        _showAlertIfNeeded() {
            const queryStrings = CR.Services.Browser.getUrlQueryStrings();
            const latestOrder = _.head(this.state.orders);
            const latestOrderStatus = latestOrder ? latestOrder.getStatus() : CR.Models.OrderStaticProps.statusIds.notPaid;

            if (queryStrings.action === "orderCompleted" && !this.$orderCompletedAlert.is(":visible")) {
                this.$orderCompletedAlert.fadeIn();
            } else if (latestOrderStatus === CR.Models.OrderStaticProps.statusIds.paid && !this.$assessmentWaitingAlert.is(":visible")) {
                this.$assessmentWaitingAlert.fadeIn();
            } else if (latestOrderStatus === CR.Models.OrderStaticProps.statusIds.inProgress && !this.$assessmentInProgressAlert.is(":visible")) {
                this.$assessmentInProgressAlert.fadeIn();
            }
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
