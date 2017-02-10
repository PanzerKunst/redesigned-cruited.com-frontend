import {httpStatusCodes} from "../../global";
import Account from "../../models/account";
import Order from "../../models/order";

const store = {
    reactComponent: null,
    account: Object.assign(Object.create(Account), CR.ControllerData.account),
    config: CR.ControllerData.config,
    myToDos: [],
    otherOrders: [],
    allRaters: [],
    currentOrder: null,
    areMyToDosFetched: false,
    ordersSentToTheCustomerThisMonth: [],
    ordersToDo: [],

    init() {
        this._fetchMyToDos();
        this._fetchAllRaters();

        this._fetchStats();

        setInterval(() => {
            this._fetchStats();
        }, 10 * 1000);
    },

    assignOrderTo(account) {
        if (!this.currentOrder) {
            alert("Error: `this.currentOrder` must exist, this is a bug!");
        } else {
            const predicate = ["id", this.currentOrder.id];
            const order = _.find(this.myToDos, predicate) || _.find(this.otherOrders, predicate);

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

                        _.remove(this.myToDos, predicate);
                        _.remove(this.otherOrders, predicate);

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

    fetchTeamOrders() {
        const type = "POST";
        const url = "/api/orders/team";
        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {
                    const ordersJson = JSON.parse(httpRequest.responseText);

                    this.otherOrders = ordersJson.map(o => Object.assign(Object.create(Order), o));
                    this.reactComponent.forceUpdate();

                    this._fetchLastRatingInfoForDisplayedCustomers();
                } else {
                    alert(`AJAX failure doing a ${type} request to "${url}"`);
                }
            }
        };
        httpRequest.open(type, url);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(JSON.stringify(this.myToDos.map(order => order.id)));
    },

    fetchMoreOrders(onAjaxRequestDone) {
        this._updateSearchCriteria();

        const type = "POST";
        const url = "/api/orders/completed";
        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                onAjaxRequestDone();

                if (httpRequest.status === httpStatusCodes.ok) {
                    const ordersJson = JSON.parse(httpRequest.responseText);
                    const orders = ordersJson.map(o => Object.assign(Object.create(Order), o));

                    this.otherOrders = _.concat(this.otherOrders, orders);
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
            to: this.searchCriteria.toMoment.valueOf()
        }));
    },

    isOrderReadOnly(order) {
        if (order.rater && order.rater.id === this.account.id && order.status === Order.statuses.paid) {
            return false;
        }

        return order.isReadOnly(this.account);
    },

    _fetchMyToDos() {
        const type = "GET";
        const url = "/api/orders/my-todo";
        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {
                    const myToDosJson = JSON.parse(httpRequest.responseText);

                    this.myToDos = myToDosJson.map(o => Object.assign(Object.create(Order), o));
                    this.areMyToDosFetched = true;
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

    _fetchStats() {
        this._fetchOrdersToDo();
        this._fetchOrdersSentToTheCustomerThisMonth();
    },

    _fetchOrdersToDo() {
        const type = "GET";
        const url = "/api/orders/stats/todo";

        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {
                    const ordersToDoJson = JSON.parse(httpRequest.responseText);

                    this.ordersToDo = ordersToDoJson.map(o => Object.assign(Object.create(Order), o));

                    // No need to `reactComponent.forceUpdate`, as `_fetchOrdersSentToTheCustomerThisMonth()` does it already.
                } else {

                    // We don't display any error, because this call happens often, and possibly on page refresh
                    // alert(`AJAX failure doing a ${type} request to "${url}"`);
                }
            }
        };
        httpRequest.open(type, url);
        httpRequest.send();
    },

    _fetchOrdersSentToTheCustomerThisMonth() {
        const type = "GET";
        const url = "/api/orders/stats/sent";

        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {
                    const sentOrdersJson = JSON.parse(httpRequest.responseText);

                    this.ordersSentToTheCustomerThisMonth = sentOrdersJson.map(o => Object.assign(Object.create(Order), o));
                    this.reactComponent.forceUpdate();
                } else {

                    // We don't display any error, because this call happens often, and possibly on page refresh
                    // alert(`AJAX failure doing a ${type} request to "${url}"`);
                }
            }
        };
        httpRequest.open(type, url);
        httpRequest.send();
    },

    _updateSearchCriteria() {
        if (!this.searchCriteria) {
            this.searchNbDays = 60;

            this.searchCriteria = {
                toMoment: moment().subtract(this.searchNbDays, "day")
            };
        } else {
            this.searchCriteria.fromMoment = moment(this.searchCriteria.toMoment);

            this.searchNbDays *= 2;
            this.searchCriteria.toMoment.subtract(this.searchNbDays, "day");
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

        for (const order of this.myToDos) {
            customerIds.push(order.customer.id);
        }

        for (const order of this.otherOrders) {
            customerIds.push(order.customer.id);
        }

        return _.uniq(customerIds);
    }
};

export {store as default};
