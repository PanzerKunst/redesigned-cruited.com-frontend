CR.Controllers.Index = P(CR.Controllers.Base, function (c) {
    c.init = function () {
        this._initElements();
        this._initEvents();
        this._initValidation();
    };

    c._initElements = function () {
        this.$form = $("form");

        this.$emailField = $("#email");
        this.$emailFormGroup = this.$emailField.parent();

        this.$tipField = $("#tip");
        this.$questionField = $("#question");

        this.$viewRadios = $("[name=\"view\"]");
        this.$areaViewRadio = this.$viewRadios.filter("[value=\"area\"]");
        this.$itemViewRadio = this.$viewRadios.filter("[value=\"item\"]");

        this.$noViewSelectedError = $("#no-view-selected");
        this.$noAccountFoundForThisEmailError = $("#no-account-found-for-this-email");
    };

    c._initEvents = function () {
        this.$form.submit(this._onSubmit.bind(this));
        this.$emailField.blur(this._onEmailFieldBlur.bind(this));
    };

    c._initValidation = function () {
        this.validator = CR.Services.Validator([
            "email"
        ]);
    };

    c._onSubmit = function (e) {
        e.preventDefault();

        this._resetEmailFieldCustomLogic();
        this.validator.hideErrorMessage(this.$noViewSelectedError);

        if (this.validator.isValid()) {
            if (!this._isViewSelected()) {
                this.validator.showErrorMessage(this.$noViewSelectedError);
            } else {
                this._ifAccountExists({
                    accountFound: function (account) {
                        var tip = this.$tipField.val().trim();
                        var question = this.$questionField.val().trim();

                        var view = null;
                        if (this.$areaViewRadio.prop("checked")) {
                            view = "AREA";
                        } else if (this.$itemViewRadio.prop("checked")) {
                            view = "ITEM";
                        }

                        this._addCustomTask({
                            accountId: account.id,
                            tip: tip || null,
                            question: question || null,
                            view: view
                        });
                    }.bind(this),
                    accountNotFound: this._accountNotFound.bind(this)
                });
            }
        }
    };

    c._onEmailFieldBlur = function () {
        this._resetEmailFieldCustomLogic();

        // We wait a little before checking if account exists. We do it only if the normal field validation succeeds
        setTimeout(function () {
            if (!this.$emailFormGroup.hasClass("has-error")) {
                this._ifAccountExists({
                    accountFound: function () {
                        this.$emailFormGroup.addClass("has-success");
                    }.bind(this),
                    accountNotFound: this._accountNotFound.bind(this)
                });
            }
        }.bind(this), 100);
    };

    c._ifAccountExists = function (callbacks) {
        var emailAddress = this.$emailField.val().trim();

        if (emailAddress) {
            var type = "GET";
            var url = "/api/accounts/" + emailAddress;

            $.ajax({
                url: url,
                type: type,
                success: function (data, textStatus, jqXHR) {
                    if (callbacks) {
                        if (jqXHR.status === this.httpStatusCode.ok && _.isFunction(callbacks.accountFound)) {
                            callbacks.accountFound(data);
                        } else if (jqXHR.status === this.httpStatusCode.noContent && _.isFunction(callbacks.accountNotFound)) {
                            callbacks.accountNotFound();
                        }
                    }
                }.bind(this),
                error: function () {
                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                }
            });
        }
    };

    c._isViewSelected = function() {
        return this.$areaViewRadio.prop("checked") || this.$itemViewRadio.prop("checked");
    };

    c._accountNotFound = function () {
        this.$emailFormGroup.addClass("has-error");
        this.validator.showErrorMessage(this.$noAccountFoundForThisEmailError);
    };

    c._resetEmailFieldCustomLogic = function () {
        this.$emailFormGroup.removeClass("has-error");
        this.validator.hideErrorMessage(this.$noAccountFoundForThisEmailError);
    };

    c._addCustomTask = function (task) {
        var type = "POST";
        var url = "/api/custom-tasks";

        $.ajax({
            url: url,
            type: type,
            contentType: "application/json",
            data: JSON.stringify(task),
            success: function () {
                this.$form[0].reset();
            }.bind(this),
            error: function () {
                alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
            }
        });
    };
});
