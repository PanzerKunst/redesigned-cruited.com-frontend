import store from "./store";

const Component = React.createClass({
    render() {
        this._processData();

        return (
            <div id="stats-panel">
                <section>
                    <div>
                        <i className="fa fa-coffee"></i>
                    </div>
                    <div>
                        <i className="fa fa-user"></i>
                        <span>{this.dueTotalAssignedToMe}</span>
                    </div>
                    <div>
                        <i className="fa fa-users"></i>
                        <span>{this.dueTotal}</span>
                    </div>
                </section>
                <section>
                    <div>
                        <span>8h:</span>
                        <span>{this.dueWithin8hAssignedToMe}</span>
                    </div>
                    <div>
                        <span>16h:</span>
                        <span>{this.dueWithin16hAssignedToMe}</span>
                    </div>
                    <div>
                        <span>24h:</span>
                        <span>{this.dueWithin24hAssignedToMe}</span>
                    </div>
                </section>
                <section>
                    <div>
                        <i className="fa fa-glass"></i>
                    </div>
                    <div>
                        <i className="fa fa-user"></i>
                        <span>{this.sentToTheCustomerThisMonthByMe}</span>
                    </div>
                    <div>
                        <i className="fa fa-users"></i>
                        <span>{this.sentToTheCustomerThisMonth}</span>
                    </div>
                </section>
            </div>
        );
    },

    _processData() {
        const due = store.dueOrders;
        const assignedToMePredicate = o => o.rater && o.rater.id === store.account.id;

        this.dueTotal = due.length;
        this.dueTotalAssignedToMe = _.filter(due, assignedToMePredicate).length;

        const now = moment();
        const momentIn8h = moment(now).add(8, "H");
        const dueWithin8hForEveryone = _.filter(due, o => o.dueTimestamp < momentIn8h.valueOf());

        this.dueWithin8hAssignedToMe = _.filter(dueWithin8hForEveryone, assignedToMePredicate).length;

        const momentIn16h = moment(now).add(16, "H");
        const dueWithin16hForEveryone = _.filter(due, o => o.dueTimestamp < momentIn16h.valueOf());

        this.dueWithin16hAssignedToMe = _.filter(dueWithin16hForEveryone, assignedToMePredicate).length;

        const momentIn24h = moment(now).add(24, "H");
        const dueWithin24hForEveryone = _.filter(due, o => o.dueTimestamp < momentIn24h.valueOf());

        this.dueWithin24hAssignedToMe = _.filter(dueWithin24hForEveryone, assignedToMePredicate).length;

        this.sentToTheCustomerThisMonth = store.ordersSentToTheCustomerThisMonth.length;
        this.sentToTheCustomerThisMonthByMe = _.filter(store.ordersSentToTheCustomerThisMonth, assignedToMePredicate).length;
    }
});

export {Component as default};
