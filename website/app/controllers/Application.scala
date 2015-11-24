package controllers

import javax.inject.Inject

import db._
import play.api.Logger
import play.api.Play.current
import play.api.i18n.{I18nSupport, Lang, MessagesApi}
import play.api.libs.json.{JsUndefined, JsValue, JsNull}
import play.api.mvc._
import services._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Application @Inject()(val messagesApi: MessagesApi, val linkedinService: LinkedinService, val orderService: OrderService) extends Controller with I18nSupport {
  val doNotCachePage = Array(CACHE_CONTROL -> "no-cache, no-store")

  def index = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Redirect("/order")
      case Some(accountId) =>
        if (AccountService.isTemporary(accountId)) {
          Redirect("/order")
        } else {
          val account = AccountDto.getOfId(accountId).get
          val accountOrders = OrderDto.getOfAccountIdForFrontend(accountId)

          Ok(views.html.dashboard(getI18nMessages(request), SessionService.isSignedIn(request), account, accountOrders))
        }
    }
  }

  def signOut = Action { request =>
    linkedinService.invalidateAccessToken()
    Redirect("/").withNewSession
  }

  def signIn = Action { request =>
    val isLinkedinAccountUnregistered = false
    Ok(views.html.signIn(getI18nMessages(request), SessionService.isSignedIn(request), linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriSignIn), None, isLinkedinAccountUnregistered))
  }

  def orderStepProductSelection = Action { request =>
    Ok(views.html.orderStepProductSelection(getI18nMessages(request), SessionService.isSignedIn(request), CruitedProductDto.getAll, ReductionDto.getAll, EditionDto.all))
  }

  def orderStepAssessmentInfo = Action { request =>
    val linkedinProfile = SessionService.getAccountId(request.session) match {
      case None => JsNull
      case Some(accountId) => AccountDto.getOfId(accountId) match {
        case None => JsNull
        case Some(account) => account.linkedinProfile
      }
    }

    Ok(views.html.orderStepAssessmentInfo(getI18nMessages(request), SessionService.isSignedIn(request), linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStepAssessmentInfo), linkedinProfile, None))
      .withHeaders(doNotCachePage: _*)
  }

  def orderStepAccountCreation = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None =>
        Ok(views.html.orderStepAccountCreation(getI18nMessages(request), SessionService.isSignedIn(request), linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStepAccountCreation), JsNull, None))
          .withHeaders(doNotCachePage: _*)

      case Some(accountId) =>
        AccountDto.getOfId(accountId) match {
          case None => throw new Exception("No account found in database for ID '" + accountId + "'")
          case Some(account) =>
            if (!AccountService.isTemporary(accountId)) {
              Redirect("/order/pay")
            } else {
              val linkedinProfile = AccountDto.getOfId(accountId) match {
                case None => JsNull
                case Some(existingAccount) => existingAccount.linkedinProfile
              }

              Ok(views.html.orderStepAccountCreation(getI18nMessages(request), SessionService.isSignedIn(request), linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStepAccountCreation), linkedinProfile, None))
                .withHeaders(doNotCachePage: _*)
            }
        }
    }
  }

  def orderStepPayment = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Redirect("/order/assessment-info")
      case Some(accountId) =>
        AccountDto.getOfId(accountId) match {
          case None => throw new Exception("No account found in database for ID '" + accountId + "'")
          case Some(account) =>
            if (AccountService.isTemporary(account.id)) {
              throw new Exception("Impossible to upgrade a temp order for a temporary account")
            } else {
              val tempOrders = OrderDto.getOfAccountId(account.id).filter(order => order.id.get < 0)

              for (tempOrder <- tempOrders) {
                // 1. Create finalised order, with data from the old one
                val finalisedOrderId = OrderDto.createFinalised(tempOrder).get

                // 2. Delete old order
                OrderDto.deleteOfId(tempOrder.id.get)

                Future {
                  orderService.finaliseFileNames(finalisedOrderId)
                  orderService.convertDocsToPdf(finalisedOrderId)
                  orderService.generateDocThumbnails(finalisedOrderId)
                }
              }
              Redirect("/")
            }
        }
    }
  }

  def linkedinCallbackSignIn = Action { request =>
    if (request.queryString.contains("error")) {
      val isLinkedinAccountUnregistered = false
      Ok(views.html.signIn(getI18nMessages(request), SessionService.isSignedIn(request), linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriSignIn), Some("Error #" + request.queryString.get("error").get.head + ": " + request.queryString.get("error_description").get.head), isLinkedinAccountUnregistered))
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
        case Some(account) =>

          // TODO: remove
          Logger.info("linkedinCallbackSignIn > Some(account.id)")

          Some(account.id)
        case None => SessionService.getAccountId(request.session) match {
          case Some(id) =>

            // TODO: remove
            Logger.info("linkedinCallbackSignIn > Some(id)")

            Some(id)
          case None =>

            // TODO: remove
            Logger.info("linkedinCallbackSignIn > None 1")

            AccountDto.getOfEmailAddress((linkedinProfile \ "emailAddress").as[String]) match {
              case Some(accountWithSameEmail) =>

                // TODO: remove
                Logger.info("linkedinCallbackSignIn > Some(accountWithSameEmail.id)")

                Some(accountWithSameEmail.id)
              case None =>

                // TODO: remove
                Logger.info("linkedinCallbackSignIn > None 2")

                AccountDto.getOfLinkedinAccountId((linkedinProfile \ "id").as[String]) match {
                  case None =>

                    // TODO: remove
                    Logger.info("linkedinCallbackSignIn > None 3")

                    None
                  case Some(accountWithSameLinkedinId) =>

                    // TODO: remove
                    Logger.info("linkedinCallbackSignIn > Some(accountWithSameLinkedinId.id)")

                    Some(accountWithSameLinkedinId.id)
                }
            }
        }
      }

      // TODO: remove
      Logger.info("linkedinCallbackSignIn > request.session: " + request.session)

      if (!accountId.isDefined || AccountService.isTemporary(accountId.get)) {
        val isLinkedinAccountUnregistered = true

        // We display the error that this user isn't registered
        Ok(views.html.signIn(getI18nMessages(request), SessionService.isSignedIn(request), linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriSignIn), None, isLinkedinAccountUnregistered))
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
              .withSession(request.session + (SessionService.SESSION_KEY_ACCOUNT_ID -> accountId.get.toString))
        }
      }
    }
  }

  private def getI18nMessages(request: Request[AnyContent]): Map[String, String] = {
    messagesApi.messages(Lang.preferred(request.acceptLanguages).language)
  }

  def linkedinCallbackOrderStepAssessmentInfo = Action { request =>
    linkedinCallbackOrder(request, linkedinService.linkedinRedirectUriOrderStepAssessmentInfo, "/order/assessment-info")
  }

  def linkedinCallbackOrderStepAccountCreation = Action { request =>
    linkedinCallbackOrder(request, linkedinService.linkedinRedirectUriOrderStepAccountCreation, "/order/create-account")
  }

  private def linkedinCallbackOrder(request: Request[AnyContent], linkedinRedirectUri: String, appRedirectUri: String) = {
    if (request.queryString.contains("error")) {
      Ok(views.html.orderStepAssessmentInfo(getI18nMessages(request), SessionService.isSignedIn(request), linkedinService.getAuthCodeRequestUrl(linkedinRedirectUri), JsNull, Some("Error #" + request.queryString.get("error").get.head + ": " + request.queryString.get("error_description").get.head)))
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
            .withSession(request.session + (SessionService.SESSION_KEY_ACCOUNT_ID -> accountId.toString))
      }
    }
  }
}
