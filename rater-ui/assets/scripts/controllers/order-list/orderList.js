import store from "./store";

import StatsPanel from "./statsPanel";  // eslint-disable-line no-unused-vars
import ListItem from "./listItem";  // eslint-disable-line no-unused-vars
import AssignModal from "./assignModal";    // eslint-disable-line no-unused-vars

const controller = {
    init() {
        store.reactComponent = ReactDOM.render(
            React.createElement(this.reactComponent),
            document.querySelector("[role=main]")
        );

        store.init();
    },

    reactComponent: React.createClass({
        render() {
            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>Orders</h1>
                            <StatsPanel />
                        </div>
                    </header>
                    <div className="with-circles">
                        {this._topOrders()}
                        <section id="other-orders">
                            <h2>Team</h2>

                            <ul className="styleless orders">
                            {store.moreOrders.map(order =>
                                <ListItem key={order.id} order={order} />
                            )}
                            </ul>
                        </section>
                        <div id="load-more-panel">
                            <div className="centered-contents">
                                <i className="fa fa-spinner fa-pulse"/>
                            </div>
                            <div id="load-more-link-panel">
                                <button className="btn btn-info" onClick={this._handleLoadMoreClick}>Load more</button>
                            </div>
                        </div>
                    </div>

                    <AssignModal />
                    <div id="delete-modal" className="modal fade" tabIndex="-1" role="dialog"></div>
                </div>);
        },

        componentDidMount() {
            this._initElements();
        },

        componentDidUpdate() {
            if (store.areTopOrdersFetched && !this.isDefaultSearchDone) {
                this._searchMore();
                this.isDefaultSearchDone = true;
            }
        },

        _initElements() {
            this.$loadMorePanel = $("#load-more-panel");
        },

        _topOrders() {
            if (store.areTopOrdersFetched) {
                return (
                    <section id="top-orders">
                        <h2>My TODOs</h2>

                        <ul className="styleless orders">
                        {store.topOrders.map(order =>
                                <ListItem key={order.id} order={order} />
                        )}
                        </ul>
                    </section>);
            }
            return (
                <div className="centered-contents">
                    <i className="fa fa-spinner fa-pulse"/>
                </div>);
        },

        _handleLoadMoreClick() {
            this._searchMore();
        },

        _searchMore() {
            this.$loadMorePanel.addClass("loading");
            store.searchMore(() => this.$loadMorePanel.removeClass("loading"));
        }
    })
};

controller.init();
