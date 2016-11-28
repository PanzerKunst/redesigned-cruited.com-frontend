import {scrollTo} from "../../services/animator";
import Category from "../../models/category";
import store from "./store";

const Component = React.createClass({
    render() {
        if (!store.assessment) {
            return null;
        }

        return (
            <section>
                {_.values(Category.productCodes).map(categoryProductCode => (
                        <div key={categoryProductCode} className={`nav assessment ${categoryProductCode}`}>
                            <ul className="styleless">
                                {this._categoryLinks(categoryProductCode)}
                            </ul>
                            <div>
                                <a href={`#${categoryProductCode}-report-form`} onClick={this._handleScrollToLinkClick}>Report form</a>
                            </div>
                        </div>)
                )}
            </section>);
    },

    componentDidUpdate() {
        this._initElements();
    },

    _initElements() {
        this.$siteHeader = $("#container").children("header");
    },

    _categoryLinks(categoryProductCode) {
        return store.assessment.categoryIds(categoryProductCode).map(categoryId => (
                <li key={categoryId}>
                    <a href={`#list-category-${categoryId}`} onClick={this._handleScrollToLinkClick}>{store.i18nMessages[`category.title.${categoryId}`]}</a>
                </li>)
        );
    },

    _handleScrollToLinkClick(e) {
        scrollTo(e, this.$siteHeader.height());
    }
});

export {Component as default};
