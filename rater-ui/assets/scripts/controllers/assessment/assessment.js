import Category from "../../models/category";
import store from "./store";

// eslint-disable-next-line no-unused-vars
import OrderDetails from "./orderDetails";

// eslint-disable-next-line no-unused-vars
import GreenRedDefaultComment from "./greenRedDefaultComment";

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
                            {this._heading()}
                        </div>
                    </header>
                    <div className="with-circles">
                        <OrderDetails />
                        <section>
                            <ul className="nav nav-tabs" role="tablist">
                                <li role="presentation" className="active">
                                    <a href="#CV_REVIEW-comments-selection-panel" aria-controls="CV_REVIEW-comments-selection-panel" role="tab" data-toggle="tab" onClick={this._handleTabClicked}>CV</a>
                                </li>
                                <li role="presentation">
                                    <a href="#COVER_LETTER_REVIEW-comments-selection-panel" aria-controls="COVER_LETTER_REVIEW-comments-selection-panel" role="tab" data-toggle="tab" onClick={this._handleTabClicked}>Cover Letter</a>
                                </li>
                                <li role="presentation">
                                    <a href="#LINKEDIN_PROFILE_REVIEW-comments-selection-panel" aria-controls="LINKEDIN_PROFILE_REVIEW-comments-selection-panel" role="tab" data-toggle="tab" onClick={this._handleTabClicked}>Linkedin Profile</a>
                                </li>
                            </ul>

                            <div className="tab-content">
                                <div role="tabpanel" className="tab-pane fade in active" id="CV_REVIEW-comments-selection-panel">
                                    {this._category(Category.productCodes.cv)}
                                </div>
                                <div role="tabpanel" className="tab-pane fade" id="COVER_LETTER_REVIEW-comments-selection-panel">
                                    {this._category(Category.productCodes.coverLetter)}
                                </div>
                                <div role="tabpanel" className="tab-pane fade" id="LINKEDIN_PROFILE_REVIEW-comments-selection-panel">
                                    {this._category(Category.productCodes.linkedinProfile)}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            );
        },

        _heading() {
            const text = `Assessment #${store.order.id}`;

            return <h1>{text}</h1>;
        },

        _category(categoryProductCode) {
            if (!store.categoryIds) {
                return null;
            }
            return store.categoryIds[categoryProductCode].map(categoryId => {
                const elId = `category-${categoryId}`;
                const reactKey = elId;
                const assessmentCommentsForThisCategory = store.assessment.getListComments(categoryProductCode);

                return (
                    <section key={reactKey} id={elId}>
                        <h3>{Category.titles[categoryId]}</h3>

                        <ul className="styleless">
                        {assessmentCommentsForThisCategory.map(ac => {
                            const reactKey2 = `assessment-list-comment-${ac.id}`;

                            return <GreenRedDefaultComment key={reactKey2} assessmentComment={ac} />;
                        })}
                        </ul>
                    </section>
                );
            });
        },

        _handleTabClicked(e) {
            e.preventDefault();
            $(e.currentTarget).tab("show");
        }
    })
};

controller.init();
