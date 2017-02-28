"use strict";

CR.Controllers.OrderStepProductSelection = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                products: [],
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
                            <h1>{CR.i18nMessages["order.productSelection.title"]}</h1>
                            <CR.Controllers.LanguageSelectionInHeader supportedLanguages={this.state.supportedLanguages} currentLanguageCode={this.state.currentLanguageCode} url="/order" />
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.productSelection.subtitle"]}</span>

                        <CR.Controllers.OrderStepBreadcrumbs step={CR.Controllers.OrderCommon.steps.productSelection} />

                        <section id="products-section" className="two-columns">
                            <header>
                                <h2>{CR.i18nMessages["order.productSelection.productsSection.title"]}</h2>
                                <div className="alert alert-info guarantee-panel" role="alert">
                                    <p dangerouslySetInnerHTML={{__html: CR.i18nMessages["moneyBackGuarantee.text"]}} />
                                </div>
                            </header>
                            <ul className="styleless">
                                {this.state.products.map(function(product, index) {
                                    return <CR.Controllers.ProductListItem key={index} product={product} controller={this.state.controller} />;
                                }.bind(this))}
                            </ul>
                        </section>
                        <section id="editions-section" className="two-columns">
                            <header>
                                <h2>{CR.i18nMessages["order.productSelection.editionsSection.title"]}</h2>
                                <p className="light-font">{CR.i18nMessages["order.productSelection.editionsSection.subtitle"]}</p>
                            </header>
                            <ul className="styleless">
                            {CR.editions.map(function(edition, index) {
                                return <CR.Controllers.EditionListItem key={index} edition={edition} controller={this.state.controller} />;
                            }.bind(this))}
                            </ul>
                        </section>

                        <CR.Controllers.OrderLanguageSelection supportedLanguages={this.state.supportedLanguages} currentLanguageCode={this.state.currentLanguageCode} url="/order" />
                        <CR.Controllers.CartSection products={this.state.products} controller={this.state.controller} />

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

        this._removeInterviewTrainingProductFromOrder();

        if (!CR.order.getEdition() && !_.isEmpty(CR.editions)) {
            CR.order.setEdition(CR.editions[0]);
        }

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

    c._removeInterviewTrainingProductFromOrder = function() {
        const orderProducts = CR.order.getProducts();

        if (orderProducts.length === 1 && orderProducts[0].code === CR.Models.Product.codes.INTERVIEW_TRAINING) {
            CR.order.removeAllProducts();
        }
    };
});
