import {httpStatusCodes} from "../../global";
import Account from "../../models/Account";

const store = {
    reactComponent: null,
    account: Object.assign(Object.create(Account), CR.ControllerData.account),
    config: CR.ControllerData.config,
    topOrders: [],
    moreOrders: [],
    allRaters: [],
    currentOrderId: null,
    areTopOrdersFetched: false,

    init() {
        this._fetchTopOrders();
        this._fetchAllRaters();
    },

    _fetchTopOrders() {
        const type = "GET";
        const url = "/api/orders/top";

        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {
                    this.topOrders = JSON.parse(httpRequest.responseText);
                    this.areTopOrdersFetched = true;
                    this.reactComponent.forceUpdate();
                } else {
                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                }
            }
        }.bind(this);
        httpRequest.open(type, url);
        httpRequest.send();
    },

    _fetchAllRaters() {
        const type = "GET";
        const url = "/api/accounts/raters";

        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {
                    this.allRaters = JSON.parse(httpRequest.responseText);
                    this.reactComponent.forceUpdate();
                } else {
                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                }
            }
        }.bind(this);
        httpRequest.open(type, url);
        httpRequest.send();
    },

    assignOrderTo(account) {
        if (!this.currentOrderId) {
            alert("Error: `this.currentOrderId` must exist, this is a bug!");
        } else {
            const order = _.find(this.topOrders, ["id", this.currentOrderId]) ||
                _.find(this.moreOrders, ["id", this.currentOrderId]);

            order.rater = account;

            this.reactComponent.forceUpdate();

            const type = "PUT";
            const url = "/api/orders";

            const httpRequest = new XMLHttpRequest();

            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status !== httpStatusCodes.ok) {
                        alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                    }
                }
            };
            httpRequest.open(type, url);
            httpRequest.setRequestHeader("Content-Type", "application/json");
            httpRequest.send(JSON.stringify(order));
        }
    },

    deleteOrder(orderId) {
        const type = "DELETE";
        const url = "/api/orders/" + orderId;

        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {
                    const predicate = o => o.id === orderId;

                    _.remove(this.topOrders, predicate);
                    _.remove(this.moreOrders, predicate);

                    this.reactComponent.forceUpdate();
                } else {
                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                }
            }
        }.bind(this);
        httpRequest.open(type, url);
        httpRequest.send();
    },

    searchMore(onAjaxRequestDone) {
        this._updateSearchCriteria();

        const type = "POST";
        const url = "/api/orders/search";

        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                onAjaxRequestDone();

                if (httpRequest.status === httpStatusCodes.ok) {
                    this.moreOrders = _.concat(this.moreOrders, JSON.parse(httpRequest.responseText));
                    this.reactComponent.forceUpdate();
                } else {
                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                }
            }
        }.bind(this);
        httpRequest.open(type, url);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(JSON.stringify({
            fromTimestamp: this.searchCriteria.fromMoment ? this.searchCriteria.fromMoment.valueOf() : null,
            toTimestamp: this.searchCriteria.toMoment.valueOf(),
            excludedOrderIds: this.searchCriteria.excludedOrderIds
        }));
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

            this.searchNbDays *= 1.5;
            this.searchCriteria.toMoment.subtract(this.searchNbDays, "d");
        }
    }
};

export {store as default};
