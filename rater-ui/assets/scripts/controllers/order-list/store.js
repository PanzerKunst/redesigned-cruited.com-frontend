import {httpStatusCodes} from "../../global";
import Account from "../../models/account";
import Order from "../../models/order";

const store = {
    reactComponent: null,
    account: Object.assign(Object.create(Account), CR.ControllerData.account),
    config: CR.ControllerData.config,
    topOrders: [],
    moreOrders: [],
    allRaters: [],
    currentOrder: null,
    areTopOrdersFetched: false,
    stats: null,
    dueOrders: [],
    ordersSentToTheCustomerThisMonth: [],

    init() {
        this._fetchTopOrders();
        this._fetchAllRaters();

        this._fetchOrdersSentToTheCustomerThisMonth();
        setInterval(() => this._fetchOrdersSentToTheCustomerThisMonth(), 10 * 1000);
    },

    assignOrderTo(account) {
        if (!this.currentOrder) {
            alert("Error: `this.currentOrder` must exist, this is a bug!");
        } else {
            const predicate = ["id", this.currentOrder.id];
            const order = _.find(this.topOrders, predicate) || _.find(this.moreOrders, predicate);

            order.rater = account;

            this.reactComponent.forceUpdate();

            const type = "PUT";
            const url = "/api/orders";
            const httpRequest = new XMLHttpRequest();

            httpRequest.onreadystatechange = () => {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status !== httpStatusCodes.ok) {
                        alert(`AJAX failure doing a ${type} request to "${url}"`);
                    }
                }
            };
            httpRequest.open(type, url);
            httpRequest.setRequestHeader("Content-Type", "application/json");
            httpRequest.send(JSON.stringify(order));
        }
    },

    deleteCurrentOrder() {
        if (!this.currentOrder) {
            alert("Error: `this.currentOrder` must exist, this is a bug!");
        } else {
            const orderId = this.currentOrder.id;

            const type = "DELETE";
            const url = `/api/orders/${orderId}`;
            const httpRequest = new XMLHttpRequest();

            httpRequest.onreadystatechange = () => {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === httpStatusCodes.ok) {
                        const predicate = o => o.id === orderId;

                        _.remove(this.topOrders, predicate);
                        _.remove(this.moreOrders, predicate);

                        this.reactComponent.forceUpdate();
                    } else {
                        alert(`AJAX failure doing a ${type} request to "${url}"`);
                    }
                }
            };
            httpRequest.open(type, url);
            httpRequest.send();
        }
    },

    searchMore(onAjaxRequestDone) {
        this._updateSearchCriteria();

        const type = "POST";
        const url = "/api/orders/search";
        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                onAjaxRequestDone();

                if (httpRequest.status === httpStatusCodes.ok) {
                    const moreOrdersJson = JSON.parse(httpRequest.responseText);
                    const moreOrders = moreOrdersJson.map(o => Object.assign(Object.create(Order), o));

                    this.moreOrders = _.concat(this.moreOrders, moreOrders);
                    this.reactComponent.forceUpdate();

                    this._fetchLastRatingInfoForDisplayedCustomers();
                } else {
                    alert(`AJAX failure doing a ${type} request to "${url}"`);
                }
            }
        };
        httpRequest.open(type, url);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(JSON.stringify({
            from: this.searchCriteria.fromMoment ? this.searchCriteria.fromMoment.valueOf() : null,
            to: this.searchCriteria.toMoment.valueOf(),
            excludedOrderIds: this.searchCriteria.excludedOrderIds
        }));
    },

    isOrderReadOnly(order) {
        return !order.rater || order.rater.id !== this.account.id ||
            order.status === Order.statuses.scheduled || order.status === Order.statuses.completed;
    },

    _fetchTopOrders() {
        const type = "GET";
        const url = "/api/orders/top";
        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {
                    const topOrdersJson = JSON.parse(httpRequest.responseText);

                    this.topOrders = topOrdersJson.map(o => Object.assign(Object.create(Order), o));
                    this.areTopOrdersFetched = true;
                    this.reactComponent.forceUpdate();
                } else {
                    alert(`AJAX failure doing a ${type} request to "${url}"`);
                }
            }
        };
        httpRequest.open(type, url);
        httpRequest.send();
    },

    _fetchAllRaters() {
        const type = "GET";
        const url = "/api/accounts/raters";
        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {
                    const allRatersJson = JSON.parse(httpRequest.responseText);

                    this.allRaters = allRatersJson.map(o => Object.assign(Object.create(Account), o));
                    this.reactComponent.forceUpdate();
                } else {
                    alert(`AJAX failure doing a ${type} request to "${url}"`);
                }
            }
        };
        httpRequest.open(type, url);
        httpRequest.send();
    },

    _fetchOrdersSentToTheCustomerThisMonth() {
        const type = "GET";
        const url = "/api/orders/sent";

        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {
                    const sentOrdersJson = JSON.parse(httpRequest.responseText);

                    this.ordersSentToTheCustomerThisMonth = sentOrdersJson.map(o => Object.assign(Object.create(Order), o));
                    this.reactComponent.forceUpdate();
                } else {

                    // We don't display any error, because it happens so often, and possibly on page refresh
                    // alert(`AJAX failure doing a ${type} request to "${url}"`);
                }
            }
        };
        httpRequest.open(type, url);
        httpRequest.send();
    },

    _updateSearchCriteria() {
        if (!this.searchCriteria) {
            this.searchNbDays = 7;

            this.searchCriteria = {
                toMoment: moment().subtract(this.searchNbDays, "d"),
                excludedOrderIds: this.topOrders.map(order => order.id)
            };
        } else {
            this.searchCriteria.fromMoment = moment(this.searchCriteria.toMoment);

            this.searchNbDays *= 8;
            this.searchCriteria.toMoment.subtract(this.searchNbDays, "d");
        }
    },

    _fetchLastRatingInfoForDisplayedCustomers() {
        const type = "POST";
        const url = "/api/assessments/scores-of-customers";
        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {

                    /*
                     * {
                     *   646: [
                     *   {
                     *     order: {},
                     *     scores: {
                     *       cvReportScores: {},
                     *       coverLetterReportScores: {},
                     *       linkedinProfileReportScores: {}
                     *     }
                     *   }, {
                     *     order: {},
                     *     scores: {
                     *       cvReportScores: {}
                     *     }
                     *   }],
                     *   886: [...]
                     * }
                     */
                    const customerIdsAndTheirOrdersAndScores = JSON.parse(httpRequest.responseText);

                    this.customerIdsAndTheirOrdersAndScores = {};

                    for (const customerId of _.keys(customerIdsAndTheirOrdersAndScores)) {
                        const customerOrdersAndScores = customerIdsAndTheirOrdersAndScores[customerId].map(orderAndScores => {
                            const smartOrder = Object.assign(Object.create(Order), orderAndScores.order);

                            return {
                                order: smartOrder,
                                scores: orderAndScores.scores
                            };
                        });

                        this.customerIdsAndTheirOrdersAndScores[customerId] = customerOrdersAndScores;
                    }

                    this.reactComponent.forceUpdate();
                } else {
                    alert(`AJAX failure doing a ${type} request to "${url}"`);
                }
            }
        };
        httpRequest.open(type, url);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(JSON.stringify(this._currentCustomerIds()));
    },

    _currentCustomerIds() {
        const customerIds = [];

        for (const order of this.topOrders) {
            customerIds.push(order.customer.id);
        }

        for (const order of this.moreOrders) {
            customerIds.push(order.customer.id);
        }

        return _.uniq(customerIds);
    }
};

export {store as default};
