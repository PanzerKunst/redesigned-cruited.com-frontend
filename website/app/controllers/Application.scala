package controllers

import java.util.Timer
import javax.inject.Inject

import db._
import models.CruitedProduct
import play.api.Play.current
import play.api.i18n.MessagesApi
import play.api.libs.json.JsNull
import play.api.mvc._
import play.api.{Logger, Play}
import services._

class Application @Inject()(val messagesApi: MessagesApi, val linkedinService: LinkedinService, val orderService: OrderService, val emailsToSendTasker: EmailsToSendTasker, val emailService: EmailService, val scoreAverageTasker: ScoreAverageTasker) extends Controller {
  val dwsRootUrl = Play.configuration.getString("dws.rootUrl").get
  val doNotCachePage = Array(CACHE_CONTROL -> "no-cache, no-store")

  // Run the EmailsToSendTasker task after 0ms, repeating every 5 seconds
  new Timer().schedule(emailsToSendTasker, 0, 5 * 1000)

  // Run the ScoreAverageTasker task after 0ms, repeating every day
  new Timer().schedule(scoreAverageTasker, 0, 3600 * 24 * 1000)

  def index() = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Redirect("/order")
      case Some(accountId) =>
        if (AccountService.isTemporary(accountId)) {
          Redirect("/order")
        } else {
          val (accountOpt, currentLanguage) = AccountDto.getOfId(accountId) match {
            case None => (None, SessionService.getCurrentLanguage(request.session))
            case Some(account) => (Some(account), SupportedLanguageDto.getOfCode(account.languageCode).get)
          }

          val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)
          val frontendOrders = OrderDto.getOfAccountIdForFrontend(accountId) map { tuple => tuple._1 }
          val consultantAwareFrontendOrders = orderService.handleFrontendOrdersForConsultant(frontendOrders)

          Ok(views.html.dashboard(i18nMessages, currentLanguage, accountOpt, consultantAwareFrontendOrders))
            .withSession(request.session + (SessionService.sessionKeyLanguageCode -> currentLanguage.ietfCode)
              - SessionService.sessionKeyOrderId)
        }
    }
  }

  def signOut() = Action {
    linkedinService.invalidateAccessToken()
    Redirect("/").withNewSession
  }

  def signIn() = Action { request =>
    val currentLanguage = SessionService.getCurrentLanguage(request.session)
    val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)
    val isLinkedinAccountUnregistered = false

    val orderIdOpt = if (request.queryString.contains("reportId")) {
      try {
        Some(request.queryString("reportId").head.toLong)
      }
      catch {
        case _: NumberFormatException => None
      }
    } else {
      None
    }

    Ok(views.html.signIn(i18nMessages, currentLanguage, linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriSignIn), None, isLinkedinAccountUnregistered, orderIdOpt))
  }

  def myAccount() = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized(views.html.unauthorised())
      case Some(accountId) =>
        if (AccountService.isTemporary(accountId)) {
          Unauthorized(views.html.unauthorised())
        } else {
          val account = AccountDto.getOfId(accountId).get
          val currentLanguage = SupportedLanguageDto.getOfCode(account.languageCode).get
          val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)
          val isSaveSuccessful = SessionService.isAccountSaveSuccessful(request.session)

          Ok(views.html.myAccount(i18nMessages, currentLanguage, account, isSaveSuccessful, SupportedLanguageDto.All))
            .withSession(request.session
              - SessionService.sessionKeyAccountSaveSuccessful
              + (SessionService.sessionKeyLanguageCode -> account.languageCode))
        }
    }
  }

  def resetPassword() = Action { request =>
    val currentLanguage = SessionService.getCurrentLanguage(request.session)
    val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)

    Ok(views.html.resetPassword(i18nMessages, currentLanguage))
  }

  def confirmResetPassword() = Action { request =>
    if (request.queryString.contains("token")) {
      val token = request.queryString("token").head

      AccountService.resetPasswordTokens.get(token) match {
        case None => BadRequest("This token has already been used, or is incorrect")
        case Some(accountId) =>
          val currentLanguage = SessionService.getCurrentLanguage(request.session)
          val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)
          val account = AccountDto.getOfId(accountId).get

          Ok(views.html.newPassword(i18nMessages, currentLanguage, account))
            .withSession(request.session + (SessionService.sessionKeyResetPasswordToken -> token))
      }
    } else {
      Unauthorized(views.html.unauthorised())
    }
  }

  def orderStepProductSelection() = Action { request =>
    var currentLanguage = SessionService.getCurrentLanguage(request.session)

    val accountOpt = SessionService.getAccountId(request.session) match {
      case None => None
      case Some(accountId) =>
        if (AccountService.isTemporary(accountId)) {
          None
        } else {
          AccountDto.getOfId(accountId) match {
            case None => None
            case Some(account) =>
              currentLanguage = SupportedLanguageDto.getOfCode(account.languageCode).get
              Some(account)
          }
        }
    }

    if (request.queryString.contains("lang")) {
      currentLanguage = SupportedLanguageDto.getOfCode(request.queryString("lang").head).getOrElse(SupportedLanguageDto.All.head)
    }

    val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)

    Ok(views.html.order.orderStepProductSelection(i18nMessages, currentLanguage, accountOpt, CruitedProductDto.getForMainOrderPage, ReductionDto.getAll, EditionDto.All, SupportedLanguageDto.All))
      .withSession(request.session + (SessionService.sessionKeyLanguageCode -> currentLanguage.ietfCode))
  }

  def orderForConsultant = Action { request =>
    var currentLanguage = SessionService.getCurrentLanguage(request.session)

    val accountOpt = SessionService.getAccountId(request.session) match {
      case None => None
      case Some(accountId) =>
        if (AccountService.isTemporary(accountId)) {
          None
        } else {
          AccountDto.getOfId(accountId) match {
            case None => None
            case Some(account) =>
              currentLanguage = SupportedLanguageDto.getOfCode(account.languageCode).get
              Some(account)
          }
        }
    }

    if (request.queryString.contains("lang")) {
      currentLanguage = SupportedLanguageDto.getOfCode(request.queryString("lang").head).getOrElse(SupportedLanguageDto.All.head)
    }

    val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)

    Ok(views.html.order.orderForConsultant(i18nMessages, currentLanguage, accountOpt, CruitedProductDto.getForConsultantOrderPage, ReductionDto.getAll, SupportedLanguageDto.All))
      .withSession(request.session + (SessionService.sessionKeyLanguageCode -> currentLanguage.ietfCode))
  }

  def orderStepAssessmentInfo() = Action { request =>
    val (accountOpt, linkedinProfile) = SessionService.getAccountId(request.session) match {
      case None => (None, JsNull)
      case Some(accountId) =>
        val account = AccountDto.getOfId(accountId).get
        val acc = if (AccountService.isTemporary(accountId)) {
          None
        } else {
          Some(account)
        }

        (acc, account.linkedinProfile)
    }

    val currentLanguage = SessionService.getCurrentLanguage(request.session)
    val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)

    Ok(views.html.order.orderStepAssessmentInfo(i18nMessages, currentLanguage, accountOpt, linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStepAssessmentInfo), linkedinProfile, None))
      .withHeaders(doNotCachePage: _*)
  }

  def orderStepAccountCreation() = Action { request =>
    val currentLanguage = SessionService.getCurrentLanguage(request.session)
    val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)

    SessionService.getAccountId(request.session) match {
      case None =>
        // We need to create the temp account at this point and store it in session, otherwise it will bite us in the ass further down the road
        val accountId = AccountService.generateTempAccountIdAndStoreAccount(request.session)

        // We also need to update any eventual temp order with that new account ID
        SessionService.getOrderId(request.session) match {
          case None => BadRequest("""You have uncovered a bug in the \"Account Creation\" page of our web application.
            We are really sorry for the inconvenience, and invite you to re-create your order from the beginning.
            Also, if you have the time, we would be grateful if you could send us an e-mail (to kontakt@cruited.com), explaining that you have experienced this bug,
            and that the account ID involved was '""" + accountId + """'.""")
            .withSession(request.session - SessionService.sessionKeyOrderId)

          case Some(orderId) =>
            val orderWithUpdatedAccountId = OrderDto.getOfId(orderId).get.copy(
              accountId = Some(accountId)
            )
            OrderDto.update(orderWithUpdatedAccountId)

            Ok(views.html.order.orderStepAccountCreation(i18nMessages, currentLanguage, None, linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStepAccountCreation), JsNull, None))
              .withHeaders(doNotCachePage: _*)
              .withSession(request.session + (SessionService.sessionKeyAccountId -> accountId.toString))
        }

      case Some(accountId) =>
        AccountDto.getOfId(accountId) match {
          case None =>
            Logger.error("Application.orderStepAccountCreation() > account ID " + accountId + " found in session, but not in database; resetting order process.")
            Redirect("/order").withNewSession

          case Some(account) =>
            SessionService.getOrderId(request.session) match {
              case None => BadRequest("""You have uncovered a bug in the \"Account Creation\" page of our web application.
            We are really sorry for the inconvenience, and invite you to re-create your order from the beginning.
            Also, if you have the time, we would be grateful if you could send us an e-mail (to kontakt@cruited.com), explaining that you have experienced this issue,
            and that the account ID involved was '""" + accountId + """'.""")
                .withSession(request.session - SessionService.sessionKeyOrderId)

              case Some(orderId) =>
                if (!AccountService.isTemporary(accountId)) {
                  if (!orderService.isTemporary(orderId)) {
                    // The order is already finalised. The user is probably navigating back to this page. We load the default page
                    Ok(views.html.order.orderStepAccountCreation(i18nMessages, currentLanguage, Some(account), linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStepAccountCreation), account.linkedinProfile, None))
                      .withHeaders(doNotCachePage: _*)
                  } else {
                    // we finalize the order
                    val order = OrderDto.getOfId(orderId).get.copy(
                      accountId = Some(accountId)
                    )
                    val finalisedOrderId = orderService.finaliseOrder(order)

                    // log the user in (if necessary) and then redirect to "/payment"
                    Redirect("/order/payment")
                      .withHeaders(doNotCachePage: _*)
                      .withSession(request.session + (SessionService.sessionKeyAccountId -> accountId.toString)
                        + (SessionService.sessionKeyOrderId -> finalisedOrderId.toString))
                  }
                } else {
                  // Temporary account
                  if (account.linkedinProfile == JsNull) {
                    // This means that the user was already on the page and hit "refresh". We load the default page
                    Ok(views.html.order.orderStepAccountCreation(i18nMessages, currentLanguage, Some(account), linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStepAccountCreation), account.linkedinProfile, None))
                      .withHeaders(doNotCachePage: _*)
                  } else {
                    // We arrive from a LI sign-in. We finalize the account
                    val finalisedAccountId = AccountService.finaliseAccount(account.emailAddress.get, account.firstName.get, account.password, account.linkedinProfile, request.session)

                    // finalise the order. The accountId is already the finalised account ID
                    val finalisedOrderId = orderService.finaliseOrder(OrderDto.getOfId(orderId).get)

                    // log the user in, then display the view. The JS controller should detect that the user is logged-in (= account final), and show the "You are now logged-in" view.
                    Ok(views.html.order.orderStepAccountCreation(i18nMessages, currentLanguage, AccountDto.getOfId(finalisedAccountId), linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStepAccountCreation), account.linkedinProfile, None))
                      .withHeaders(doNotCachePage: _*)
                      .withSession(request.session + (SessionService.sessionKeyAccountId -> finalisedAccountId.toString)
                        + (SessionService.sessionKeyOrderId -> finalisedOrderId.toString))
                  }
                }
            }
        }
    }
  }

  def orderStepPayment() = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Redirect("/order/assessment-info")
      case Some(accountId) =>
        AccountDto.getOfId(accountId) match {
          case None => throw new Exception("No account found in database for ID '" + accountId + "'")
          case Some(account) =>
            if (AccountService.isTemporary(account.id)) {
              BadRequest("The payment page should involve a finalised account")
            } else {
              val orderId = SessionService.getOrderId(request.session).get

              if (orderService.isTemporary(orderId)) {
                BadRequest("The payment page should involve a finalised order")
              } else {
                val currentLanguage = SessionService.getCurrentLanguage(request.session)
                val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)

                OrderDto.getOfId(orderId) match {
                  case None => BadRequest("""You have uncovered a bug in the \"Payment\" page of our web application.
                    We are really sorry for the inconvenience, and invite you to re-create your order from the beginning.
                    Also, if you have the time, we would be grateful if you could send us an e-mail (to kontakt@cruited.com), explaining that you have experienced this bug,
                    that the account ID involved was '""" + accountId + """' and the order ID involved was '""" + orderId + """'""")
                    .withSession(request.session - SessionService.sessionKeyOrderId)

                  case Some(order) =>
                    // If the cost is 0, we redirect to the dashboard
                    if (order.getCostAfterReductions == 0) {
                      emailService.sendFreeOrderCompleteEmail(account.emailAddress.get, account.firstName.get, order, currentLanguage.ietfCode, i18nMessages("email.orderComplete.free.subject"))
                      Redirect("/?action=orderCompleted")
                    } else {
                      // We display the payment page
                      Ok(views.html.order.orderStepPayment(i18nMessages, currentLanguage, Some(account), CruitedProductDto.getAll, ReductionDto.getAll, orderId))
                    }
                }
              }
            }
        }
    }
  }

  def editOrder() = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized(views.html.unauthorised())
      case Some(accountId) =>
        AccountDto.getOfId(accountId) match {
          case None => throw new Exception("No account found in database for ID '" + accountId + "'")
          case Some(account) =>
            if (!request.queryString.contains("id")) {
              BadRequest("'id' missing")
            } else {
              val id = request.queryString("id").head.toLong

              OrderDto.getOfIdForFrontend(id) match {
                case None => BadRequest("Couldn't find an order in DB for ID " + id)
                case Some(tuple) =>
                  val order = orderService.handleFrontendOrderForConsultant(tuple._1)

                  if (order.accountId.get == accountId || account.isAllowedToViewAllReportsAndEditOrders) {
                    val currentLanguage = SessionService.getCurrentLanguage(request.session)
                    val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)

                    Ok(views.html.order.editOrder(i18nMessages, currentLanguage, Some(account), order))
                  } else {
                    Forbidden("You are not allowed to edit orders which are not yours")
                  }
              }
            }
        }
    }
  }

  def completePayment() = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized(views.html.unauthorised())
      case Some(accountId) =>
        AccountDto.getOfId(accountId) match {
          case None => throw new Exception("No account found in database for ID '" + accountId + "'")
          case Some(account) =>
            if (!request.queryString.contains("orderId")) {
              BadRequest("'orderId' missing")
            } else {
              val orderId = request.queryString("orderId").head.toLong

              OrderDto.getOfIdForFrontend(orderId) match {
                case None => BadRequest("Couldn't find an order in DB for ID " + orderId)

                case Some(tuple) =>
                  val currentLanguage = SessionService.getCurrentLanguage(request.session)
                  val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)

                  Ok(views.html.order.completePayment(i18nMessages, currentLanguage, Some(account), CruitedProductDto.getAll, ReductionDto.getAll, tuple._1))
              }
            }
        }
    }
  }

  def report(orderId: Long) = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Redirect("/login?reportId=" + orderId)
      case Some(accountId) =>
        val selectedProductCode = if (request.queryString.contains("productCode")) {
          request.queryString("productCode").head
        } else {
          CruitedProduct.CodeCvReview
        }

        OrderDto.getOfIdForFrontend(orderId) match {
          case None => BadRequest("Couldn't find an order in DB for ID " + orderId)
          case Some(tuple) =>
            val account = AccountDto.getOfId(accountId).get

            if (tuple._1.accountId.get == accountId || account.isAllowedToViewAllReportsAndEditOrders) {
              ReportDto.getOfOrderId(orderId) match {
                case None => BadRequest("No report available for order ID " + orderId)
                case Some(assessmentReport) =>
                  val currentLanguage = SessionService.getCurrentLanguage(request.session)
                  val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)
                  val accountId = SessionService.getAccountId(request.session).get

                  val consultantAwareAssessmentReport = assessmentReport.copy(
                    order = orderService.handleFrontendOrderForConsultant(assessmentReport.order)
                  )

                  Ok(views.html.report(i18nMessages, currentLanguage, AccountDto.getOfId(accountId), consultantAwareAssessmentReport, ReportDto.getScoresOfOrderId(orderId), scoreAverageTasker.cvAverageScore, scoreAverageTasker.coverLetterAverageScore, scoreAverageTasker.linkedinProfileAverageScore, scoreAverageTasker.nbLastAssessmentsToTakeIntoAccount, selectedProductCode, dwsRootUrl))
              }
            } else {
              Forbidden("You are not allowed to view reports which are not yours")
            }
        }
    }
  }

  def linkedinCallbackSignIn() = Action { request =>
    if (request.queryString.contains("error")) {
      val currentLanguage = SessionService.getCurrentLanguage(request.session)
      val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)
      val isLinkedinAccountUnregistered = false

      Ok(views.html.signIn(i18nMessages, currentLanguage, linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriSignIn), Some("Error #" + request.queryString("error").head + ": " + request.queryString("error_description").head), isLinkedinAccountUnregistered))
    } else if (!request.queryString.contains("state") ||
      request.queryString("state").head != linkedinService.linkedinState) {
      BadRequest("Linkedin Auth returned wrong value for 'state'!")
    } else if (!request.queryString.contains("code")) {
      BadRequest("Linkedin Auth did not return any value for 'code'!")
    } else {
      linkedinService.authCode = Some(request.queryString("code").head)
      linkedinService.requestAccessToken(linkedinService.linkedinRedirectUriSignIn)

      val linkedinProfile = linkedinService.getProfile

      val accountId = AccountDto.getOfLinkedinAccountId((linkedinProfile \ "id").as[String]) match {
        case Some(account) => Some(account.id)
        case None => SessionService.getAccountId(request.session) match {
          case Some(id) => Some(id)
          case None =>
            AccountDto.getOfEmailAddress((linkedinProfile \ "emailAddress").as[String]) match {
              case Some(accountWithSameEmail) => Some(accountWithSameEmail.id)
              case None =>
                AccountDto.getOfLinkedinAccountId((linkedinProfile \ "id").as[String]) match {
                  case None => None
                  case Some(accountWithSameLinkedinId) => Some(accountWithSameLinkedinId.id)
                }
            }
        }
      }

      if (accountId.isEmpty || AccountService.isTemporary(accountId.get)) {
        val currentLanguage = SessionService.getCurrentLanguage(request.session)
        val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)
        val isLinkedinAccountUnregistered = true

        // We display the error that this user isn't registered
        Ok(views.html.signIn(i18nMessages, currentLanguage, linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriSignIn), None, isLinkedinAccountUnregistered))
      } else {
        // We update the LI fields in DB, except maybe the email and first name if they are already set
        AccountDto.getOfId(accountId.get) match {
          case None => throw new Exception("No account found in database for ID '" + accountId + "'")
          case Some(account) =>
            val updatedAccount = account.copy(
              firstName = Some(account.firstName.getOrElse((linkedinProfile \ "firstName").as[String])),
              lastName = Some((linkedinProfile \ "lastName").as[String]),
              emailAddress = Some(account.emailAddress.getOrElse((linkedinProfile \ "emailAddress").as[String])),
              linkedinProfile = linkedinProfile
            )

            AccountDto.update(updatedAccount)

            Redirect("/")
              .withSession(request.session + (SessionService.sessionKeyAccountId -> accountId.get.toString))
        }
      }
    }
  }

  def linkedinCallbackOrderStepAssessmentInfo() = Action { request =>
    val linkedinRedirectUri = linkedinService.linkedinRedirectUriOrderStepAssessmentInfo
    val appRedirectUri = "/order/assessment-info"

    if (request.queryString.contains("error")) {
      val currentLanguage = SessionService.getCurrentLanguage(request.session)
      val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)

      Ok(views.html.order.orderStepAssessmentInfo(i18nMessages, currentLanguage, None, linkedinService.getAuthCodeRequestUrl(linkedinRedirectUri), JsNull, Some("Error #" + request.queryString("error").head + ": " + request.queryString("error_description").head)))
    } else if (!request.queryString.contains("state") ||
      request.queryString("state").head != linkedinService.linkedinState) {
      BadRequest("Linkedin Auth returned wrong value for 'state'!")
    } else if (!request.queryString.contains("code")) {
      BadRequest("Linkedin Auth did not return any value for 'code'!")
    } else {
      linkedinService.authCode = Some(request.queryString("code").head)
      linkedinService.requestAccessToken(linkedinRedirectUri)

      val linkedinProfile = linkedinService.getProfile

      val accountId = SessionService.getAccountId(request.session) match {
        case Some(id) => id
        case None =>
          val linkedinAccountId = (linkedinProfile \ "id").as[String]

          AccountDto.getOfLinkedinAccountId(linkedinAccountId) match {
            case Some(account) => account.id
            case None =>
              val emailAddressFromLinkedin = (linkedinProfile \ "emailAddress").as[String]

              AccountDto.getOfEmailAddress(emailAddressFromLinkedin) match {
                case Some(existingAccount) => existingAccount.id
                case None => AccountService.generateTempAccountIdAndStoreAccount(request.session)
              }
          }
      }

      AccountDto.getOfId(accountId) match {
        case None => throw new Exception("No account found in database for ID '" + accountId + "'")
        case Some(account) =>
          val updatedAccount = account.copy(
            firstName = Some(account.firstName.getOrElse((linkedinProfile \ "firstName").as[String])),
            lastName = Some((linkedinProfile \ "lastName").as[String]),
            emailAddress = Some(account.emailAddress.getOrElse((linkedinProfile \ "emailAddress").as[String])),
            linkedinProfile = linkedinProfile
          )

          AccountDto.update(updatedAccount)

          Redirect(appRedirectUri)
            .withSession(request.session + (SessionService.sessionKeyAccountId -> accountId.toString))
      }
    }
  }

  def linkedinCallbackOrderStepAccountCreation() = Action { request =>
    val linkedinRedirectUri = linkedinService.linkedinRedirectUriOrderStepAccountCreation

    val currentLanguage = SessionService.getCurrentLanguage(request.session)
    val i18nMessages = SessionService.getI18nMessages(currentLanguage, messagesApi)

    if (request.queryString.contains("error")) {
      Ok(views.html.order.orderStepAccountCreation(i18nMessages, currentLanguage, None, linkedinService.getAuthCodeRequestUrl(linkedinRedirectUri), JsNull, Some("Error #" + request.queryString("error").head + ": " + request.queryString("error_description").head)))
    } else if (!request.queryString.contains("state") ||
      request.queryString("state").head != linkedinService.linkedinState) {
      BadRequest("Linkedin Auth returned wrong value for 'state'!")
    } else if (!request.queryString.contains("code")) {
      BadRequest("Linkedin Auth did not return any value for 'code'!")
    } else {
      linkedinService.authCode = Some(request.queryString("code").head)
      linkedinService.requestAccessToken(linkedinRedirectUri)

      val linkedinProfile = linkedinService.getProfile
      val emailAddressFromLinkedin = (linkedinProfile \ "emailAddress").as[String]

      val existingAccountOpt = AccountDto.getOfEmailAddress(emailAddressFromLinkedin) match {
        case Some(existingAccount) => Some(existingAccount)
        case None => AccountDto.getOfLinkedinAccountId((linkedinProfile \ "id").as[String])
      }

      existingAccountOpt match {
        // If no such account already exists in the DB
        case None =>
          // we update the temp account with the LI profile and save in DB
          val accountId = SessionService.getAccountId(request.session).get
          val account = AccountDto.getOfId(accountId).get

          val updatedAccount = account.copy(
            firstName = Some(account.firstName.getOrElse((linkedinProfile \ "firstName").as[String])),
            lastName = Some((linkedinProfile \ "lastName").as[String]),
            emailAddress = Some(account.emailAddress.getOrElse(emailAddressFromLinkedin)),
            linkedinProfile = linkedinProfile
          )

          AccountDto.update(updatedAccount)

          val finalisedAccountId = AccountService.finaliseAccount(updatedAccount.emailAddress.get, updatedAccount.firstName.get, updatedAccount.password, linkedinProfile, request.session)

          // finalize the order. The accountId is already the finalised account ID
          val orderId = SessionService.getOrderId(request.session).get
          val finalisedOrderId = orderService.finaliseOrder(OrderDto.getOfId(orderId).get)

          // sign the user in and redirect to "/payment"
          Redirect("/order/payment")
            .withHeaders(doNotCachePage: _*)
            .withSession(request.session + (SessionService.sessionKeyAccountId -> finalisedAccountId.toString)
              + (SessionService.sessionKeyOrderId -> finalisedOrderId.toString))

        // If an account with this LI profile already exists in the DB
        case Some(existingAccount) =>
          // we attach the order
          val orderId = SessionService.getOrderId(request.session).get

          OrderDto.getOfId(orderId) match {
            case None => BadRequest("""You have uncovered a bug in the \"Account Creation\" page of our web application.
              We are really sorry for the inconvenience, and invite you to re-create your order from the beginning.
              Also, if you have the time, we would be grateful if you could send us an e-mail (to kontakt@cruited.com), explaining that you have experienced this issue,
              and that the account ID involved was '""" + existingAccount.id + """'.""")
              .withSession(request.session - SessionService.sessionKeyOrderId)

            case Some(order) =>
              val attachedOrder = order.copy(
                accountId = Some(existingAccount.id)
              )

              val finalisedOrderId = orderService.finaliseOrder(attachedOrder)

              // log the user in and display the Account Creation view (no redirect).
              Ok(views.html.order.orderStepAccountCreation(i18nMessages, currentLanguage, Some(existingAccount), linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStepAccountCreation), linkedinProfile, None))
                .withHeaders(doNotCachePage: _*)
                .withSession(request.session + (SessionService.sessionKeyAccountId -> existingAccount.id.toString)
                  + (SessionService.sessionKeyOrderId -> finalisedOrderId.toString))
          }
      }
    }
  }
}
