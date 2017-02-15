import {scrollTo} from "../../services/animator";
import store from "./store";

const Component = React.createClass({
    render() {
        if (!store.assessment) {
            return null;
        }

        const categoryProductCode = this.props.categoryProductCode;

        if (!this.categoryIds) {
            this.categoryIds = store.assessment.categoryIds(categoryProductCode);
        }

        return (
            <section ref="root" className={`nav assessment ${categoryProductCode}`}>
                <ul className="styleless">
                    {this.categoryIds.map(categoryId => {
                        const liClasses = classNames({
                            active: this._isCategoryCurrentlyActive(categoryId),
                            "all-selected": store.assessment.areListCommentsSelected(this.props.categoryProductCode, categoryId)
                        });

                        return (
                            <li key={categoryId} className={liClasses} data-category-id={categoryId}>
                                <i className="fa fa-check" aria-hidden="true"/>
                                <a href={`#list-category-${categoryId}`} onClick={this._handleScrollToLinkClick}>{store.i18nMessages[`category.title.${categoryId}`]}</a>
                                <span className="category-score">{store.assessment.categoryScore(categoryId)}</span>
                            </li>);
                    })}
                </ul>
                <a href={`#${categoryProductCode}-report-form`} onClick={this._handleScrollToLinkClick}>Report form</a>
            </section>);
    },

    componentDidUpdate() {
        this._initElements();
    },

    _initElements() {
        const $container = $("#container");

        this.$siteHeader = $container.children("header");
        this.$orderDetails = $container.find("#order-details");
        this.$navPanel = $container.find(".nav-panel");

        const $rootEl = $(ReactDOM.findDOMNode(this.refs.root));

        this.$listItems = $rootEl.find("li");
    },

    _isCategoryCurrentlyActive(categoryId) {
        if (!this.$listItems) {
            return false;
        }

        return this.$listItems.filter(`[data-category-id="${categoryId}"]`).hasClass("active");
    },

    _handleScrollToLinkClick(e) {
        scrollTo(e, this.$siteHeader.height() + this.$orderDetails.height());
    }
});

export {Component as default};
