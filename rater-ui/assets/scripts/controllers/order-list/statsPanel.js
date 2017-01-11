import store from "./store";

const Component = React.createClass({
    render() {
        this._processData();

        return (
            <div id="stats-panel">
                <div>
                    <i className="fa fa-glass"></i>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Team</th>
                            <th>Me</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.nbOrdersThisMonth} / {this.nbDocsThisMonth}</td>
                            <td>{this.nbOrdersThisMonthByMe} / {this.nbDocsThisMonthByMe}</td>
                        </tr>
                    </tbody>
                </table>
            </div>);
    },

    _processData() {
        this.nbOrdersThisMonth = store.ordersSentToTheCustomerThisMonth.length;
        this.nbDocsThisMonth = this._nbDocs(store.ordersSentToTheCustomerThisMonth);

        const ordersThisMonthByMe = _.filter(store.ordersSentToTheCustomerThisMonth, o => o.rater.id === store.account.id);

        this.nbOrdersThisMonthByMe = ordersThisMonthByMe.length;
        this.nbDocsThisMonthByMe = this._nbDocs(ordersThisMonthByMe);
    },

    _nbDocs(orders) {
        if (orders.length === 0) {
            return 0;
        }

        const nbDocsArray = orders.map(order => order.containedProductCodes.length);
        let result = 0;

        for (const nbDocs of nbDocsArray) {
            result += nbDocs;
        }

        return result;
    }
});

export {Component as default};
