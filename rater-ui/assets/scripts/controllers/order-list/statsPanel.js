import {animationDurations} from "../../global";
import {fadeOut, fadeIn} from "../../services/animator";
import store from "./store";

const Component = React.createClass({
    nbHoursSoon: 8,

    render() {
        this._processData();

        return (
            <div id="stats-panel">
                <section id="stats-todo" onClick={this._handleSectionClick}>
                    <div></div>
                    <table>
                        <thead>
                            <tr>
                                <th>Team</th>
                                <th>{`Me ${this.nbHoursSoon}h`}</th>
                                <th>Me later</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{this.nbOrdersToDo} / {this.nbDocsToDo}</td>
                                <td>{this.nbOrdersIneedToDoSoon} / {this.nbDocsIneedToDoSoon}</td>
                                <td>{this.nbOrdersIneedToDoLater} / {this.nbDocsIneedToDoLater}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section id="stats-month" onClick={this._handleSectionClick}>
                    <div></div>
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
                </section>
            </div>);
    },

    componentDidMount() {
        this._initElements();
    },

    _initElements() {
        this.$statsSections = $("#stats-panel").children();
    },

    _processData() {
        this._processOrdersToDo();
        this._processOrdersThisMonth();
    },

    _processOrdersToDo() {
        this.nbOrdersToDo = store.ordersToDo.length;
        this.nbDocsToDo = this._nbDocs(store.ordersToDo);

        const ordersIneedToDo = _.filter(store.ordersToDo, o => o.rater && o.rater.id === store.account.id);

        const ordersIneedToDoSoon = _.filter(ordersIneedToDo, o => {
            const dueMomentMinus8h = moment(o.dueTimestamp).subtract(this.nbHoursSoon, "hour");

            return moment() > dueMomentMinus8h;
        });

        this.nbOrdersIneedToDoSoon = ordersIneedToDoSoon.length;
        this.nbDocsIneedToDoSoon = this._nbDocs(ordersIneedToDoSoon);

        const ordersIneedToDoLater = _.difference(ordersIneedToDo, ordersIneedToDoSoon);

        this.nbOrdersIneedToDoLater = ordersIneedToDoLater.length;
        this.nbDocsIneedToDoLater = this._nbDocs(ordersIneedToDoLater);
    },

    _processOrdersThisMonth() {
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
    },

    _handleSectionClick() {
        const idOfSectionToShow = this.$statsSections.filter(":hidden").attr("id");
        const $sectionToShow = this.$statsSections.filter(`#${idOfSectionToShow}`);

        fadeOut(this.$statsSections, {
            animationDuration: animationDurations.short,

            onComplete: () => fadeIn($sectionToShow, {
                animationDuration: animationDurations.short,
                display: "flex"
            })
        });
    }
});

export {Component as default};
