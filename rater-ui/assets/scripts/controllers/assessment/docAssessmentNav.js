import {scrollTo} from "../../services/animator";
import store from "./store";

const Component = React.createClass({
    render() {
        if (!store.assessment) {
            return null;
        }

        const categoryProductCode = this.props.categoryProductCode;

        return (
            <section key={categoryProductCode} className={`nav assessment ${categoryProductCode}`}>
                <ul className="styleless">
                    {this._categoryLinks(categoryProductCode)}
                </ul>
                <div className="centered-contents">
                    <a href={`#${categoryProductCode}-report-form`} onClick={this._handleScrollToLinkClick}>Report form</a>
                </div>
            </section>);
    },

    componentDidUpdate() {
        this._initElements();
    },

    _initElements() {
        this.$siteHeader = $("#container").children("header");
    },

    _categoryLinks(categoryProductCode) {
        return store.assessment.categoryIds(categoryProductCode).map(categoryId => {
            const validationErrorsForThisCategory = this.props.validationErrors ? this.props.validationErrors[categoryId] : null;

            const linkClasses = classNames({
                "has-errors": !_.isEmpty(validationErrorsForThisCategory)
            });

            return (
                <li key={categoryId}>
                    <a href={`#list-category-${categoryId}`} onClick={this._handleScrollToLinkClick} className={linkClasses}>{store.i18nMessages[`category.title.${categoryId}`]}</a>
                </li>);
        });
    },

    _handleScrollToLinkClick(e) {
        scrollTo(e, this.$siteHeader.height());
    }
});

export {Component as default};
