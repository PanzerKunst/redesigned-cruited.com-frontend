import store from "./store";

// eslint-disable-next-line no-unused-vars
import ListItem from "./listItem";

// eslint-disable-next-line no-unused-vars
import AssignModal from "./assignModal";

const controller = {
    init() {
        store.reactComponent = ReactDOM.render(
            React.createElement(this.reactComponent),
            document.querySelector("[role=main]")
        );

        store.init();
    },

    reactComponent: React.createClass({
        getInitialState() {
            return store;
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
                        <ul className="styleless orders">
                            {store.moreOrders.map(order => <ListItem key={order.id} order={order} />)}
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

                    <AssignModal />
                    <div id="delete-modal" className="modal fade" tabIndex="-1" role="dialog"></div>
                </div>
            );
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
                    <ul className="styleless orders">
                        {store.topOrders.map(order => <ListItem key={order.id} order={order} />)}
                    </ul>);
            }
            return (
                <div className="centered-contents">
                    <i className="fa fa-spinner fa-pulse"/>
                </div>);
        },

        _handleLoadMoreClicked() {
            this._searchMore();
        },

        _searchMore() {
            this.$loadMorePanel.addClass("loading");
            store.searchMore(() => this.$loadMorePanel.removeClass("loading"));
        }
    })
};

controller.init();
