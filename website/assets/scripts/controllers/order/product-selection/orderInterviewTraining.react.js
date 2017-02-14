"use strict";

CR.Controllers.OrderInterviewTraining = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                supportedLanguages: [],
                currentLanguageCode: null,
                controller: null
            };
        },

        render: function() {
            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["order.interviewTraining.title"]}</h1>
                            <form ref="form" className="form-inline">
                                <div className="form-group">
                                    <label htmlFor="selected-language">Lang</label>
                                    <select className="form-control" id="selected-language" value={this.state.currentLanguageCode} onChange={this._handleLanguageChange}>
                                        {this.state.supportedLanguages.map(function(supportedLanguage) {
                                            const ietfCode = supportedLanguage.ietfCode;
                                            const shortName = ietfCode.replace(/^./, function($1) {
                                                return $1.toUpperCase();
                                            });

                                            return <option key={supportedLanguage.id} value={ietfCode}>{shortName}</option>;
                                        })}
                                    </select>
                                </div>
                                <div className="form-group medium-screen">
                                    <label htmlFor="selected-language-medium-screen">Language</label>
                                    <select className="form-control" id="selected-language-medium-screen" value={this.state.currentLanguageCode} onChange={this._handleLanguageChange}>
                                        {this.state.supportedLanguages.map(function(supportedLanguage) {
                                            return <option key={supportedLanguage.id} value={supportedLanguage.ietfCode}>{supportedLanguage.name}</option>;
                                        })}
                                    </select>
                                </div>
                            </form>
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.interviewTraining.subtitle"]}</span>

                        <CR.Controllers.OrderStepBreadcrumbs step={CR.Controllers.OrderCommon.steps.productSelection} />

                        <section id="language-section" className="two-columns">
                            <header>
                                <p className="light-font">{CR.i18nMessages["order.productSelection.languageSection.subtitle"]}</p>
                            </header>
                            <form ref="form">
                                <div className="form-group">
                                     <select className="form-control" value={this.state.currentLanguageCode} onChange={this._handleLanguageChange}>
                                         {this.state.supportedLanguages.map(function(supportedLanguage) {
                                             return <option key={supportedLanguage.id} value={supportedLanguage.ietfCode}>{supportedLanguage.name}</option>;
                                         })}
                                     </select>
                                </div>
                            </form>
                        </section>
                        <section id="cart-section">
                            <header>
                                <h2>{CR.i18nMessages["order.productSelection.cartSection.title"]}</h2>
                                <span className="highlighted-number">{CR.order.getProducts().length}</span>
                            </header>
                            <div>
                                <div className="column-labels">
                                    <span>{CR.i18nMessages["order.productSelection.cartSection.productsHeader.products"]}</span>
                                    <span>{CR.i18nMessages["order.productSelection.cartSection.productsHeader.defaultPrice"]}</span>
                                </div>

                                <ul className="styleless">
                                    {CR.order.getProducts().map(function(product, index) {
                                        return <CR.Controllers.CartProductListItem key={index} product={product} controller={this.state.controller} />;
                                    }.bind(this))}
                                </ul>

                                <CR.Controllers.CouponForm controller={this.state.controller} />

                                <div className="bottom-section">
                                    {this._getCartTable()}

                                    <div className="alert alert-info guarantee-panel" role="alert">
                                        <p dangerouslySetInnerHTML={{__html: CR.i18nMessages["moneyBackGuarantee.text"]}} />
                                    </div>
                                </div>
                            </div>
                        </section>
                        <form onSubmit={this._handleSubmit} className="centered-contents">
                            <p className="other-form-error" id="empty-cart">{CR.i18nMessages["order.productSelection.validation.emptyCart"]}</p>
                            <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.productSelection.submitBtn.text"]}</button>
                        </form>
                    </div>
                </div>
            );
        },

        componentDidUpdate: function() {
            this._initElements();
            this._initValidation();

            if (!_.isEmpty(CR.order.getProducts())) {
                this.validator.hideErrorMessage(this.$emptyCartError);
            }
        },

        _initElements: function() {
            const $content = $("#content");
            this.$otherFormErrors = $content.find(".other-form-error");
            this.$emptyCartError = this.$otherFormErrors.filter("#empty-cart");

            // Coupon form
            this.$couponForm = $content.find("#cart-section").find("form");
            this.$couponCodeField = this.$couponForm.find("#coupon-code");
            this.$addCouponBtn = this.$couponForm.find("#add-coupon-btn");
            this.$couponNotFoundError = this.$otherFormErrors.filter("#coupon-not-found-error");
            this.$couponExpiredError = this.$otherFormErrors.filter("#coupon-expired-error");
        },

        _initValidation: function() {
            this.validator = CR.Services.Validator();
        },

        _getCartTable: function() {
            if (_.isEmpty(this.state.products)) {
                return null;
            }

            return (
                <table>
                    <tbody>
                        <tr className="sub-total-row">
                            <td>{CR.i18nMessages["order.productSelection.cartSection.subTotal"]}:</td>
                            <td>{CR.order.getBasePrice()} {this.state.products[0].price.currencyCode}</td>
                        </tr>
                        {CR.order.getReductions().map(function(reduction, index) {
                            return (
                                <tr key={index} className="reduction-row">
                                    <td>{CR.i18nMessages["reduction.name." + reduction.code]}:</td>
                                    <td>- {reduction.price.amount} {reduction.price.currencyCode}</td>
                                </tr>
                            );
                        })}

                        {this._getCouponRow()}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>{CR.i18nMessages["order.productSelection.cartSection.total"]}:</td>
                            <td>{CR.order.getTotalPrice()} {this.state.products[0].price.currencyCode}</td>
                        </tr>
                    </tfoot>
                </table>
            );
        },

        _getCouponRow: function() {
            const orderCoupon = CR.order.getCoupon();

            if (!orderCoupon) {
                return null;
            }

            const amount = orderCoupon.discountPercentage || orderCoupon.discountPrice.amount;
            const unit = orderCoupon.discountPercentage ? "%" : " " + orderCoupon.discountPrice.currencyCode;

            return (
                <tr className="coupon-row">
                    <td>{orderCoupon.campaignName}:</td>
                    <td>- {amount}{unit}</td>
                </tr>
            );
        },

        _handleSubmit: function(e) {
            e.preventDefault();

            this.validator.hideErrorMessage(this.$otherFormErrors);

            if (_.isEmpty(CR.order.getProducts())) {
                this.validator.showErrorMessage(this.$emptyCartError);
            } else {
                const couponCodeField = this.$couponCodeField.val();

                if (couponCodeField) {
                    const type = "GET";
                    const url = "/api/coupons/" + couponCodeField;

                    const httpRequest = new XMLHttpRequest();
                    httpRequest.onreadystatechange = function() {
                        if (httpRequest.readyState === XMLHttpRequest.DONE) {
                            this.$addCouponBtn.disableLoading();
                            this.$couponCodeField.blur();

                            let coupon;

                            switch (httpRequest.status) {
                                case CR.httpStatusCodes.noContent:
                                    this.validator.showErrorMessage(this.$couponNotFoundError);
                                    break;
                                case CR.httpStatusCodes.couponExpired:
                                    coupon = JSON.parse(httpRequest.responseText);
                                    this.$couponExpiredError[0].innerText = coupon.couponExpiredMsg;
                                    this.validator.showErrorMessage(this.$couponExpiredError);
                                    break;
                                case CR.httpStatusCodes.ok:
                                    coupon = JSON.parse(httpRequest.responseText);
                                    this.$couponForm[0].reset();

                                    CR.order.setCoupon(coupon);
                                    CR.order.saveInLocalStorage();

                                    location.href = "/order/assessment-info";
                                    break;
                                default:
                                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                            }
                        }
                    }.bind(this);
                    httpRequest.open(type, url);
                    httpRequest.setRequestHeader("Content-Type", "application/json");
                    httpRequest.send();
                } else {
                    location.href = "/order/assessment-info";
                }
            }
        },

        _handleLanguageChange: function(e) {
            const $dropdown = $(e.currentTarget);
            location.replace("/order?lang=" + $dropdown.val());
        }
    });

    c.init = function(i18nMessages, products, reductions, editions, loggedInAccount, supportedLanguages) {
        CR.i18nMessages = i18nMessages;
        CR.products = products;
        CR.editions = editions;
        CR.reductions = reductions;
        CR.loggedInAccount = loggedInAccount;
        this.supportedLanguages = supportedLanguages;

        const orderFromLocalStorage = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.order);
        CR.order = CR.Models.Order(orderFromLocalStorage);

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            products: this._getProducts(),
            supportedLanguages: this.supportedLanguages,
            currentLanguageCode: $("html").attr("lang"),
            controller: this
        });
    };

    c._getProducts = function() {
        const products = CR.products ? _.cloneDeep(CR.products) : [];
        const orderProducts = CR.order.getProducts();

        for (let i = 0; i < products.length; i++) {
            const sameProductInOrder = _.find(orderProducts, function(orderProduct) {
                return products[i].id === orderProduct.id;
            });

            if (sameProductInOrder) {
                products[i] = _.cloneDeep(sameProductInOrder);
            }
        }

        return products;
    };
});
