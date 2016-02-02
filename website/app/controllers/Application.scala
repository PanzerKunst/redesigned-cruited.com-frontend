package controllers

import java.util.{Date, Timer}
import javax.inject.Inject

import db._
import models.{CruitedProduct, Order}
import play.api.Play.current
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.libs.json.JsNull
import play.api.mvc._
import play.api.{Logger, Play}
import services._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Application @Inject()(val messagesApi: MessagesApi, val linkedinService: LinkedinService, val orderService: OrderService, val emailsToSendTasker: EmailsToSendTasker, val emailService: EmailService, val scoreAverageTasker: ScoreAverageTasker) extends Controller with I18nSupport {
  val dwsRootUrl = Play.configuration.getString("dws.rootUrl").get
  val doNotCachePage = Array(CACHE_CONTROL -> "no-cache, no-store")
  val i18nMessages = GlobalConfig.getI18nMessages(messagesApi)

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
          val frontendOrders = OrderDto.getOfAccountIdForFrontend(accountId) map { tuple => tuple._1}
          Ok(views.html.dashboard(i18nMessages, AccountDto.getOfId(accountId), frontendOrders))
        }
    }
  }

  def signOut() = Action { request =>
    linkedinService.invalidateAccessToken()
    Redirect("/").withNewSession
  }

  def signIn() = Action { request =>
    val isLinkedinAccountUnregistered = false
    Ok(views.html.signIn(i18nMessages, linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriSignIn), None, isLinkedinAccountUnregistered))
  }

  def myAccount() = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized(views.html.unauthorised())
      case Some(accountId) =>
        if (AccountService.isTemporary(accountId)) {
          Unauthorized(views.html.unauthorised())
        } else {
          val account = AccountDto.getOfId(accountId).get
          val isSaveSuccessful = SessionService.isAccountSaveSuccessful(request.session)

          Ok(views.html.myAccount(i18nMessages, account, isSaveSuccessful))
            .withSession(request.session - SessionService.sessionKeyAccountSaveSuccessful)
        }
    }
  }

  def resetPassword() = Action { request =>
    Ok(views.html.resetPassword(i18nMessages))
  }

  def confirmResetPassword() = Action { request =>
    if (request.queryString.contains("token")) {
      val token = request.queryString.get("token").get.head

      AccountService.resetPasswordTokens.get(token) match {
        case None => BadRequest("This token has already been used, or is incorrect")
        case Some(accountId) =>
          val account = AccountDto.getOfId(accountId).get

          Ok(views.html.newPassword(i18nMessages, account))
            .withSession(request.session + (SessionService.sessionKeyResetPasswordToken -> token))
      }
    } else {
      Unauthorized(views.html.unauthorised())
    }
  }

  def orderStepProductSelection() = Action { request =>
    val accountOpt = SessionService.getAccountId(request.session) match {
      case None => None
      case Some(accountId) =>
        if (AccountService.isTemporary(accountId)) {
          None
        } else {
          AccountDto.getOfId(accountId)
        }
    }

    Ok(views.html.order.orderStepProductSelection(i18nMessages, accountOpt, CruitedProductDto.getAll, ReductionDto.getAll, EditionDto.all))
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

    Ok(views.html.order.orderStepAssessmentInfo(i18nMessages, accountOpt, linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStepAssessmentInfo), linkedinProfile, None))
      .withHeaders(doNotCachePage: _*)
  }

  def orderStepAccountCreation() = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None =>
        Ok(views.html.order.orderStepAccountCreation(i18nMessages, None, linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStepAccountCreation), JsNull, None))
          .withHeaders(doNotCachePage: _*)

      case Some(accountId) =>
        if (!AccountDto.getOfId(accountId).isDefined) {
          throw new Exception("No account found in database for ID '" + accountId + "'")
        }
        if (!AccountService.isTemporary(accountId)) {
          Redirect("/order/payment")
        } else {
          val (accountOpt, linkedinProfile) = AccountDto.getOfId(accountId) match {
            case None => (None, JsNull)
            case Some(existingAccount) => (Some(existingAccount), existingAccount.linkedinProfile)
          }

          Ok(views.html.order.orderStepAccountCreation(i18nMessages, accountOpt, linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStepAccountCreation), linkedinProfile, None))
            .withHeaders(doNotCachePage: _*)
        }
    }
  }

  def orderStepPayment() = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Redirect("/order/assessment-info")
      case Some(accountId) =>
        AccountDto.getOfId(accountId) match {
          case None => InternalServerError("No account found in database for ID '" + accountId + "'")
          case Some(account) =>
            if (AccountService.isTemporary(account.id)) {
              BadRequest("Impossible to upgrade a temp order for a temporary account")
            } else {
              OrderDto.getOfAccountId(accountId).find(order => order.id.get < 0) match {
                // If finalised order, we display the dashboard
                case None => Redirect("/")

                // Else (temp order), we finalize the order
                case Some(tempOrder) =>
                  val costAfterReductions = tempOrder.getCostAfterReductions

                  // If the cost is 0, we set the status to paid
                  val orderToBeFinalised = if (costAfterReductions == 0) {
                    tempOrder.copy(
                      status = Order.statusIdPaid,
                      paymentTimestamp = Some(new Date().getTime)
                    )
                  } else {
                    tempOrder.copy()
                  }

                  // Create finalised order, with data from the old one
                  val finalisedOrderId = OrderDto.createFinalised(orderToBeFinalised).get
                  val finalisedOrder = OrderDto.getOfId(finalisedOrderId).get

                  // Delete old order
                  OrderDto.deleteOfId(tempOrder.id.get)

                  Future {
                    orderService.finaliseFileNames(finalisedOrder, tempOrder.id.get)
                    val finalisedOrderWithPdfFileNames = orderService.convertDocsToPdf(finalisedOrder)
                    orderService.generateDocThumbnails(finalisedOrderWithPdfFileNames)
                  } onFailure {
                    case e => Logger.error(e.getMessage, e)
                  }

                  // If the cost is 0, we redirect to the dashboard
                  if (costAfterReductions == 0) {
                    emailService.sendFreeOrderCompleteEmail(account.emailAddress.get, account.firstName.get, i18nMessages("email.orderComplete.free.subject"))
                    Redirect("/?action=orderCompleted")
                  } else {
                    // We display the payment page
                    Ok(views.html.order.orderStepPayment(i18nMessages, Some(account), CruitedProductDto.getAll, ReductionDto.getAll, finalisedOrderId))
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
          case None => InternalServerError("No account found in database for ID '" + accountId + "'")
          case Some(account) =>
            if (!request.queryString.contains("id")) {
              BadRequest("'id' missing")
            } else {
              val id = request.queryString.get("id").get.head.toLong

              OrderDto.getOfIdForFrontend(id) match {
                case None => BadRequest("Couldn't find an order in DB for ID " + id)
                case Some(tuple) =>
                  val order = tuple._1

                  if (order.accountId.get == accountId || account.isAllowedToViewAllReportsAndEditOrders) {
                    Ok(views.html.order.editOrder(i18nMessages, Some(account), order))
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
          case None => InternalServerError("No account found in database for ID '" + accountId + "'")
          case Some(account) =>
            if (!request.queryString.contains("orderId")) {
              BadRequest("'orderId' missing")
            } else {
              val orderId = request.queryString.get("orderId").get.head.toLong

              OrderDto.getOfIdForFrontend(orderId) match {
                case None => BadRequest("Couldn't find an order in DB for ID " + orderId)
                case Some(tuple) => Ok(views.html.order.completePayment(i18nMessages, Some(account), CruitedProductDto.getAll, ReductionDto.getAll, tuple._1))
              }
            }
        }
    }
  }

  def report(orderId: Long) = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized(views.html.unauthorised())
      case Some(accountId) =>
        val selectedProductCode = if (request.queryString.contains("productCode")) {
          request.queryString.get("productCode").get.head
        } else {
          CruitedProduct.codeCvReview
        }

        OrderDto.getOfIdForFrontend(orderId) match {
          case None => BadRequest("Couldn't find an order in DB for ID " + orderId)
          case Some(tuple) =>
            val account = AccountDto.getOfId(accountId).get

            // TODO if (tuple._1.accountId.get == accountId || account.isAllowedToViewAllReportsAndEditOrders) {
            ReportDto.getOfOrderId(orderId) match {
              case None => BadRequest("No report available for order ID " + orderId)
              case Some(assessmentReport) =>
                val accountId = SessionService.getAccountId(request.session).get

                Ok(views.html.report(i18nMessages, AccountDto.getOfId(accountId), assessmentReport, ReportDto.getScoresOfOrderId(orderId), scoreAverageTasker.cvAverageScore, scoreAverageTasker.coverLetterAverageScore, scoreAverageTasker.linkedinProfileAverageScore, scoreAverageTasker.nbLastAssessmentsToTakeIntoAccount, selectedProductCode, dwsRootUrl))
            }
          /*} else {
            Forbidden("You are not allowed to view reports which are not yours")
          }*/
        }
    }
  }

  def linkedinCallbackSignIn() = Action { request =>
    if (request.queryString.contains("error")) {
      val isLinkedinAccountUnregistered = false
      Ok(views.html.signIn(i18nMessages, linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriSignIn), Some("Error #" + request.queryString.get("error").get.head + ": " + request.queryString.get("error_description").get.head), isLinkedinAccountUnregistered))
    } else if (!request.queryString.contains("state") ||
      request.queryString.get("state").get.head != linkedinService.linkedinState) {
      BadRequest("Linkedin Auth returned wrong value for 'state'!")
    } else if (!request.queryString.contains("code")) {
      BadRequest("Linkedin Auth did not return any value for 'code'!")
    } else {
      linkedinService.authCode = Some(request.queryString.get("code").get.head)
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

      if (!accountId.isDefined || AccountService.isTemporary(accountId.get)) {
        val isLinkedinAccountUnregistered = true

        // We display the error that this user isn't registered
        Ok(views.html.signIn(i18nMessages, linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriSignIn), None, isLinkedinAccountUnregistered))
      } else {
        // We update the LI fields in DB, except maybe the email and first name if they are already set
        AccountDto.getOfId(accountId.get) match {
          case None => InternalServerError("No account found in database for ID '" + accountId + "'")
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
    linkedinCallbackOrder(request, linkedinService.linkedinRedirectUriOrderStepAssessmentInfo, "/order/assessment-info")
  }

  def linkedinCallbackOrderStepAccountCreation() = Action { request =>
    linkedinCallbackOrder(request, linkedinService.linkedinRedirectUriOrderStepAccountCreation, "/order/create-account")
  }

  private def linkedinCallbackOrder(request: Request[AnyContent], linkedinRedirectUri: String, appRedirectUri: String) = {
    if (request.queryString.contains("error")) {
      if (linkedinRedirectUri == linkedinService.linkedinRedirectUriOrderStepAssessmentInfo) {
        Ok(views.html.order.orderStepAssessmentInfo(i18nMessages, None, linkedinService.getAuthCodeRequestUrl(linkedinRedirectUri), JsNull, Some("Error #" + request.queryString.get("error").get.head + ": " + request.queryString.get("error_description").get.head)))
      } else {
        Ok(views.html.order.orderStepAccountCreation(i18nMessages, None, linkedinService.getAuthCodeRequestUrl(linkedinRedirectUri), JsNull, Some("Error #" + request.queryString.get("error").get.head + ": " + request.queryString.get("error_description").get.head)))
      }
    } else if (!request.queryString.contains("state") ||
      request.queryString.get("state").get.head != linkedinService.linkedinState) {
      BadRequest("Linkedin Auth returned wrong value for 'state'!")
    } else if (!request.queryString.contains("code")) {
      BadRequest("Linkedin Auth did not return any value for 'code'!")
    } else {
      linkedinService.authCode = Some(request.queryString.get("code").get.head)
      linkedinService.requestAccessToken(linkedinRedirectUri)

      val linkedinProfile = linkedinService.getProfile

      val accountId = SessionService.getAccountId(request.session) match {
        case Some(id) => id
        case None => AccountService.generateTempAccountIdAndStoreAccount(request.session)
      }

      AccountDto.getOfId(accountId) match {
        case None => InternalServerError("No account found in database for ID '" + accountId + "'")
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
}
