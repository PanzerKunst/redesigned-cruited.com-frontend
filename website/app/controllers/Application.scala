package controllers

import javax.inject.Inject

import db._
import play.api.Play.current
import play.api.i18n.{I18nSupport, Lang, MessagesApi}
import play.api.libs.json.JsNull
import play.api.mvc._
import services._

class Application @Inject()(val messagesApi: MessagesApi, val linkedinService: LinkedinService) extends Controller with I18nSupport {
  val doNotCachePage = Array(CACHE_CONTROL -> "no-cache, no-store")

  def index = Action { request =>
    // TODO: display the dashboard if signed in, else redirect order step 1
    Redirect("/order")
  }

  def signOut = Action { request =>
    linkedinService.invalidateAccessToken()
    Redirect("/").withNewSession
  }

  def orderStepProductSelection = Action { request =>
    Ok(views.html.orderStepProductSelection(getI18nMessages(request), SessionService.isSignedIn(request), CruitedProductDto.getAll, ReductionDto.getAll, EditionDto.all))
  }

  def orderStepAssessmentInfo = Action { request =>
    val linkedinProfile = SessionService.getAccountId(request.session) match {
      case None => JsNull
      case Some(accountId) => AccountDto.getOfId(accountId) match {
        case None => JsNull
        case Some(account) => account.linkedinProfile.getOrElse(JsNull)
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
              Redirect("/") // TODO: reditect instead to Step Payment once payment is coded
            } else {
              val linkedinProfile = AccountDto.getOfId(accountId) match {
                case None => JsNull
                case Some(existingAccount) => existingAccount.linkedinProfile.getOrElse(JsNull)
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
            // TODO: only upgrade order to real order after payment is completed
            if (AccountService.isTemporary(account.id)) {
              throw new Exception("Impossible to upgrade a temp order for a temporary account")
            } else {
              for (tempOrder <- OrderDto.getTemporaryOrdersForAccountId(account.id)) {
                // 1. Create new order, with data from the old one
                val finalisedOrderId = OrderDto.create(tempOrder).get

                // 2. Delete old order
                OrderDto.deleteOfId(tempOrder.id.get)

                OrderService.finaliseFileNames(finalisedOrderId)
              }

              Redirect("/")
            }
        }
    }
  }

  def linkedinCallbackOrderStepAssessmentInfo = Action { request =>
    linkedinCallback(request, linkedinService.linkedinRedirectUriOrderStepAssessmentInfo, "/order/assessment-info")
  }

  def linkedinCallbackOrderStepAccountCreation = Action { request =>
    linkedinCallback(request, linkedinService.linkedinRedirectUriOrderStepAccountCreation, "/order/create-account")
  }

  private def linkedinCallback(request: Request[AnyContent], linkedinRedirectUri: String, appRedirectUri: String) = {
    if (request.queryString.contains("error")) {
      Ok(views.html.orderStepAccountCreation(getI18nMessages(request), SessionService.isSignedIn(request), linkedinService.getAuthCodeRequestUrl(linkedinRedirectUri), JsNull, Some("Error #" + request.queryString.get("error").get.head + ": " + request.queryString.get("error_description").get.head)))
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
            firstName = Some((linkedinProfile \ "firstName").as[String]),
            lastName = Some((linkedinProfile \ "lastName").as[String]),
            emailAddress = Some((linkedinProfile \ "emailAddress").as[String]),
            linkedinProfile = Some(linkedinProfile)
          )

          AccountDto.update(updatedAccount)

          Redirect(appRedirectUri)
            .withSession(request.session + (SessionService.SESSION_KEY_ACCOUNT_ID -> accountId.toString))
      }
    }
  }

  private def getI18nMessages(request: Request[AnyContent]): Map[String, String] = {
    messagesApi.messages(Lang.preferred(request.acceptLanguages).language)
  }
}
