import {httpStatusCodes} from "../../global";
import Account from "../../models/Account";

// eslint-disable-next-line no-unused-vars
import ListItem from "./listItem";

// eslint-disable-next-line no-unused-vars
import AssignModal from "./assignModal";

const AssessmentListController = {
    init() {
        ReactDOM.render(
            React.createElement(this.reactComponent),
            document.querySelector("[role=main]")
        );
    },

    reactComponent: React.createClass({
        getInitialState() {
            return {
                account: Object.assign(Object.create(Account), CR.ControllerData.account),
                config: CR.ControllerData.config,
                topOrders: [],
                moreOrders: []
            };
        },

        render() {
            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>Orders</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        {this._topOrders()}
                        <ul className="styleless">
                            {this.state.moreOrders.map(order => <ListItem key={order.id} order={order} account={this.state.account} config={this.state.config} parentController={this} />)}
                        </ul>
                        <div id="load-more-panel">
                            <div className="centered-contents">
                                <i className="fa fa-spinner fa-pulse"/>
                            </div>
                            <div id="load-more-link-panel">
                                <a onClick={this._handleLoadMoreClicked}>Load more</a>
                            </div>
                        </div>
                    </div>

                    <AssignModal parentController={this} />
                </div>
            );
        },

        componentDidMount() {
            this._fetchTopOrders();
        },

        _fetchTopOrders() {
            const type = "GET";
            const url = "/api/orders/top";

            const httpRequest = new XMLHttpRequest();

            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === httpStatusCodes.ok) {
                        this.setState({
                            topOrders: JSON.parse(httpRequest.responseText)
                        });
                    } else {
                        alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                    }
                }
            }.bind(this);
            httpRequest.open(type, url);
            httpRequest.send();
        },

        componentDidUpdate() {
            this._initElements();

            if (!this.isDefaultSearchDone) {
                this._searchMore();
                this.isDefaultSearchDone = true;
            }
        },

        /* TODO: move to `deleteModal`
         hideOrderOfId(orderId) {
         const filterFnc = order => order.id !== orderId;

         this.setState({
         topOrders: _.filter(this.state.topOrders, filterFnc),
         moreOrders: _.filter(this.state.moreOrders, filterFnc)
         });
         }, */

        showAssignModal(orderId) {
            this.$assignModal.modal();
            this.currentOrderId = orderId;
        },

        assignOrderTo(account) {
            if (!this.currentOrderId) {
                alert("Error: `this.currentOrderId` must exist, this is a bug!");
            } else {
                const order = _.find(this.state.topOrders, ["id", this.currentOrderId]) ||
                    _.find(this.state.moreOrders, ["id", this.currentOrderId]);

                order.rater = account;

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

                // We update the lists
                this.forceUpdate();
            }
        },

        _initElements() {
            this.$loadMorePanel = $("#load-more-panel");
            this.$assignModal = $("#assign-modal");
        },

        _topOrders() {
            if (this.state.topOrders.length === 0) {
                return (
                    <div className="centered-contents">
                        <i className="fa fa-spinner fa-pulse"/>
                    </div>);
            }
            return (
                <ul className="styleless">
                    {this.state.topOrders.map(order => <ListItem key={order.id} order={order} account={this.state.account} config={this.state.config} parentController={this} />)}
                </ul>);
        },

        _handleLoadMoreClicked() {
            this._searchMore();
        },

        _searchMore() {
            this._updateSearchCriteria();

            this.$loadMorePanel.addClass("loading");

            const type = "POST";
            const url = "/api/orders/search";

            const httpRequest = new XMLHttpRequest();

            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    this.$loadMorePanel.removeClass("loading");

                    if (httpRequest.status === httpStatusCodes.ok) {
                        this.setState({
                            moreOrders: _.concat(this.state.moreOrders, JSON.parse(httpRequest.responseText))
                        });
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
                    excludedOrderIds: this.state.topOrders.map(order => order.id)
                };
            } else {
                this.searchCriteria.fromMoment = moment(this.searchCriteria.toMoment);

                this.searchNbDays *= 1.5;
                this.searchCriteria.toMoment.subtract(this.searchNbDays, "d");
            }
        }
    })
};

AssessmentListController.init();
