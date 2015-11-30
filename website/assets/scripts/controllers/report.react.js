"use strict";

CR.Controllers.Report = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                order: null,
                cvReport: null,
                coverLetterReport: null,
                linkedinProfileReport: null,
                dwsRootUrl: null
            };
        },

        render: function() {
            if (!this.state.order) {
                return null;
            }

            return (
                <div id="content">
                    <div id="page-header-bar">
                        <h1>{CR.i18nMessages["report.title"]}</h1>
                    </div>
                    <div className="with-circles">
                        <span>{this.state.order.getTitleForHtml()}</span>
                        {this._getGlobalSection()}
                        <section>
                            <ul className="nav nav-pills" role="tablist">
                                <li role="presentation" className="active">
                                    <a href="#cv-report-panel" aria-controls="cv-report-panel" role="tab" data-toggle="pill">{CR.i18nMessages["product.name.CV_REVIEW"]}</a>
                                </li>
                                <li role="presentation">
                                    <a href="#cover-letter-report-panel" aria-controls="cover-letter-report-panel" role="tab" data-toggle="pill">{CR.i18nMessages["product.name.COVER_LETTER_REVIEW"]}</a>
                                </li>
                                <li role="presentation">
                                    <a href="#linkedin-profile-report-panel" aria-controls="linkedin-profile-report-panel" role="tab" data-toggle="pill">{CR.i18nMessages["product.name.LINKEDIN_PROFILE_REVIEW"]}</a>
                                </li>
                            </ul>

                            <div className="tab-content">
                                <div role="tabpanel" className="tab-pane fade in active" id="cv-report-panel">
                                    {this._getDocumentReportSection(CR.Models.Product.codes.CV_REVIEW)}
                                </div>
                                <div role="tabpanel" className="tab-pane fade" id="cover-letter-report-panel">
                                    {this._getDocumentReportSection(CR.Models.Product.codes.COVER_LETTER_REVIEW)}
                                </div>
                                <div role="tabpanel" className="tab-pane fade" id="linkedin-profile-report-panel">
                                    {this._getDocumentReportSection(CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW)}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            );
        },

        _getGlobalSection: function() {
            return (
                <section>
                    <p>
                        <span>{CR.i18nMessages["order.creationDate.label"]}:</span> {moment(this.state.order.getCreationTimestamp()).format("lll")}
                    </p>
                    <div>
                        <span>{CR.i18nMessages["order.status.label"]}:</span> {this.state.order.getStatusForHtml()}
                        <span>{this.state.order.getEditionForHtml()}</span>
                    </div>
                </section>
            );
        },

        _getDocumentReportSection: function(productCode) {
            if (_.find(this.state.order.getProducts(), "code", productCode)) {
                let documentUrl = this._getDocumentUrl(this.state.order.getId(), productCode);

                let docReport = this.state.cvReport;
                if (productCode === CR.Models.Product.codes.COVER_LETTER_REVIEW) {
                    docReport = this.state.coverLetterReport;
                } else if (productCode === CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW) {
                    docReport = this.state.linkedinProfileReport;
                }

                let categoriesAndTheirComments = [];

                // For each red comment
                docReport.redComments.forEach(function(comment) {
                    let categoryIndex = -1;
                    for (let i = 0; i < categoriesAndTheirComments.length; i++) {
                        if (categoriesAndTheirComments[i].categoryId === comment.category.id) {
                            categoryIndex = i;
                            break;
                        }
                    }

                    // If the comment's category is not in categoriesAndTheirComments
                    if (categoryIndex === -1) {
                        // Add the category to categoriesAndTheirComments
                        categoriesAndTheirComments.push({
                            categoryId: comment.category.id,
                            redComments: [comment]
                        });
                    } else {    // If it's already in categoriesAndTheirComments
                        // Then add the comment to the list of comments for that category
                        categoriesAndTheirComments[categoryIndex].redComments.push(comment);
                    }
                });

                docReport.topComments.forEach(function(comment) {
                    let categoryIndex = -1;
                    for (let i = 0; i < categoriesAndTheirComments.length; i++) {
                        if (categoriesAndTheirComments[i].categoryId === comment.category.id) {
                            categoryIndex = i;
                            break;
                        }
                    }

                    if (categoryIndex === -1) {
                        categoriesAndTheirComments.push({
                            categoryId: comment.category.id,
                            topComment: comment
                        });
                    } else {
                        categoriesAndTheirComments[categoryIndex].topComment = comment;
                    }
                });

                return (
                    <div>
                        <section className="summary">
                            <h2>{CR.i18nMessages["report.summary.title"]}</h2>
                            <img src={documentUrl + "/thumbnail"} />
                            <a href={documentUrl}>{CR.i18nMessages["report.document.link.text"]}</a>
                            <span>{CR.i18nMessages["report.document.score.label"]}:</span>
                            <span>{docReport.score}</span>
                        </section>
                        <section className="report-analysis">
                            <h2>{CR.i18nMessages["report.analysis.title"]}</h2>
                            <ul className="styleless">
                            {categoriesAndTheirComments.map(function(categoryAndItsComments) {
                                let reactItemId = "category-" + categoryAndItsComments.categoryId;

                                let topCommentParagraph = null;
                                if (categoryAndItsComments.topComment) {
                                    topCommentParagraph = <p>{categoryAndItsComments.topComment.text}</p>;
                                }

                                return (
                                    <li key={reactItemId}>
                                        <h3>{CR.i18nMessages["category." + productCode + "." + categoryAndItsComments.categoryId + ".title"]}</h3>
                                        <p>{CR.i18nMessages["category." + productCode + "." + categoryAndItsComments.categoryId + ".shortDesc"]}</p>
                                        {topCommentParagraph}
                                        <ul className="styleless">
                                            {categoryAndItsComments.redComments.map(function(comment) {
                                                let reactSubItemId = "comment-" + comment.id;

                                                return <li key={reactSubItemId} className="red-comment">{comment.text}</li>;
                                            })}
                                        </ul>
                                    </li>
                                );
                            })}
                            </ul>
                        </section>
                    </div>
                );
            }

            return <a>Order this assessment</a>;
        },

        _getDocumentUrl: function(orderId, productCode) {
            switch (productCode) {
                case CR.Models.Product.codes.CV_REVIEW:
                    return this.state.dwsRootUrl + "docs/" + orderId + "/cv";
                case CR.Models.Product.codes.COVER_LETTER_REVIEW:
                    return this.state.dwsRootUrl + "docs/" + orderId + "/cover-letter";
                default:
                    return this.state.dwsRootUrl + "docs/" + orderId + "/linkedin-profile";
            }
        }
    });

    c.init = function(i18nMessages, assessmentReport, dwsRootUrl) {
        CR.i18nMessages = i18nMessages;
        this.order = CR.Models.Order(assessmentReport.order);
        this.cvReport = assessmentReport.cvReport;
        this.coverLetterReport = assessmentReport.coverLetterReport;
        this.linkedinProfileReport = assessmentReport.linkedinProfileReport;
        this.dwsRootUrl = dwsRootUrl;

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            order: this.order,
            cvReport: this.cvReport,
            coverLetterReport: this.coverLetterReport,
            linkedinProfileReport: this.linkedinProfileReport,
            dwsRootUrl: this.dwsRootUrl
        });
    };
});
