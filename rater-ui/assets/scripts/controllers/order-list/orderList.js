// eslint-disable-next-line no-unused-vars
import ListItem from "./listItem";

const AssessmentListController = {
    ordersToDisplayAtTheTop: [],

    init() {
        ReactDOM.render(
            React.createElement(this.reactComponent),
            document.querySelector("[role=main]")
        )
            .setState({
                ordersToDisplayAtTheTop: this.ordersToDisplayAtTheTop
            });
    },

    reactComponent: React.createClass({
        getInitialState() {
            return {
                ordersToDisplayAtTheTop: [],
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
                        <ul className="styleless">
                        {this.state.ordersToDisplayAtTheTop.map(order => <ListItem key={order.id} order={order} />)}
                        {this.state.moreOrders.map(order => <ListItem key={order.id} order={order} />)}
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
                </div>
            );
        },

        componentDidUpdate() {
            this._initElements();

            if (!this.isDefaultSearchDone) {
                this._searchMore();
                this.isDefaultSearchDone = true;
            }
        },

        _initElements() {
            const $loadMorePanel = $("#load-more-panel");

            this.$loadMoreSpinner = $loadMorePanel.find(".fa-spinner");
            this.$loadMoreLink = $loadMorePanel.find("a");
        },

        _handleLoadMoreClicked() {
            this._searchMore();
        },

        _searchMore() {
            this._updateSearchCriteria();

            this.$loadMoreSpinner.show();
            this.$loadMoreLink.hide();

            const type = "POST";
            const url = "/api/orders/search";

            const httpRequest = new XMLHttpRequest();

            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    this.$loadMoreSpinner.hide();
                    this.$loadMoreLink.show();

                    this.setState({
                        moreOrders: _.concat(this.state.moreOrders, JSON.parse(httpRequest.responseText))
                    });
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
                    excludedOrderIds: this.state.ordersToDisplayAtTheTop.map(order => order.id)
                };
            } else {
                this.searchCriteria.fromMoment = moment(this.searchCriteria.toMoment);

                this.searchNbDays *= 1.5;
                this.searchCriteria.toMoment.subtract(this.searchNbDays, "d");
            }
        }
    })
};

Object.assign(Object.create(AssessmentListController), CR.ControllerData).init();
