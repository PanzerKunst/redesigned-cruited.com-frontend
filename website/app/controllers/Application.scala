package controllers

import javax.inject.Inject

import db.{AccountDto, CruitedProductDto, EditionDto, ReductionDto}
import play.api.Play.current
import play.api.i18n.{I18nSupport, Lang, MessagesApi}
import play.api.libs.json.JsNull
import play.api.mvc._
import services.{AccountService, DocumentService, LinkedinService, SessionService}

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
    Ok(views.html.orderStepProductSelection(getI18nMessages(request), SessionService.isSignedIn(request.session), CruitedProductDto.getAll, ReductionDto.getAll, EditionDto.all))
  }

  def orderStepAssessmentInfo = Action { request =>
    var newSession = request.session

    val accountId = SessionService.getAccountId(request.session) match {
      case None => AccountService.generateTempAccountIdAndInitialiseTables(request.session)

      case Some(id) =>
        AccountDto.getOfId(id) match {
          case Some(account) => id

          case None =>
            AccountDto.createTemporary(id)
            id
        }
    }

    newSession = newSession + ("accountId" -> accountId.toString)

    DocumentService.createAccountRootDir(accountId)

    val linkedinBasicProfile = AccountDto.getOfId(accountId) match {
      case None => JsNull
      case Some(account) => account.linkedinBasicProfile.getOrElse(JsNull)
    }

    Ok(views.html.orderStepAssessmentInfo(getI18nMessages(request), SessionService.isSignedIn(request.session), linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStepAssessmentInfo), linkedinBasicProfile, None))
      .withSession(newSession)
      .withHeaders(doNotCachePage: _*)
  }

  def orderStepAccountCreation = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Redirect("/order/assessment-info")
      case Some(accountId) =>
        AccountDto.getOfId(accountId) match {
          case None => throw new Exception("No account found in database for ID '" + accountId + "'")
          case Some(account) =>
            if (AccountService.isTemporary(accountId)) {
              // TODO: upgrade the account to non-temp, then retrieve order details from query parameters and save it

            }
            Redirect("/") // TODO: reditect instead to Step 4 once payment is coded
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
            Ok
        }
    }
  }

  def linkedinCallbackOrderStepAssessmentInfo = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => BadRequest("linkedinCallbackOrderStepAssessmentInfo without account ID in session")
      case Some(accountId) =>
        if (request.queryString.contains("error")) {
          Ok(views.html.orderStepAssessmentInfo(getI18nMessages(request), SessionService.isSignedIn(request.session), linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStepAssessmentInfo), JsNull, Some("Error #" + request.queryString.get("error").get.head + ": " + request.queryString.get("error_description").get.head)))
        } else if (!request.queryString.contains("state") ||
          request.queryString.get("state").get.head != linkedinService.linkedinState) {
          BadRequest("Linkedin Auth returned wrong value for 'state'!")
        } else if (!request.queryString.contains("code")) {
          BadRequest("Linkedin Auth did not return any value for 'code'!")
        } else {
          linkedinService.authCode = Some(request.queryString.get("code").get.head)
          linkedinService.requestAccessToken(linkedinService.linkedinRedirectUriOrderStepAssessmentInfo)

          val linkedinProfile = linkedinService.getProfile

          AccountDto.getOfId(accountId) match {
            case None => throw new Exception("No account found in database for ID '" + accountId + "'")
            case Some(account) =>
              val updatedAccount = account.copy(
                firstName = Some((linkedinProfile \ "firstName").as[String]),
                lastName = Some((linkedinProfile \ "lastName").as[String]),
                emailAddress = Some((linkedinProfile \ "emailAddress").as[String]),
                pictureUrl = Some((linkedinProfile \ "pictureUrl").as[String]),
                linkedinAccountId = Some((linkedinProfile \ "id").as[String]),
                linkedinBasicProfile = Some(linkedinProfile)
              )

              AccountDto.update(updatedAccount)

              Redirect("/order/assessment-info")
          }
        }
    }
  }

  def linkedinCallbackOrderStepAccountCreation = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => BadRequest("linkedinCallbackOrderStepAccountCreation without account ID in session")
      case Some(accountId) =>
        if (request.queryString.contains("error")) {
          Ok(views.html.orderStepAccountCreation(getI18nMessages(request), SessionService.isSignedIn(request.session), linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStepAssessmentInfo), JsNull, Some("Error #" + request.queryString.get("error").get.head + ": " + request.queryString.get("error_description").get.head)))
        } else if (!request.queryString.contains("state") ||
          request.queryString.get("state").get.head != linkedinService.linkedinState) {
          BadRequest("Linkedin Auth returned wrong value for 'state'!")
        } else if (!request.queryString.contains("code")) {
          BadRequest("Linkedin Auth did not return any value for 'code'!")
        } else {
          linkedinService.authCode = Some(request.queryString.get("code").get.head)
          linkedinService.requestAccessToken(linkedinService.linkedinRedirectUriOrderStepAssessmentInfo)

          val linkedinProfile = linkedinService.getProfile

          AccountDto.getOfId(accountId) match {
            case None => throw new Exception("No account found in database for ID '" + accountId + "'")
            case Some(account) =>
              val updatedAccount = account.copy(
                firstName = Some((linkedinProfile \ "firstName").as[String]),
                lastName = Some((linkedinProfile \ "lastName").as[String]),
                emailAddress = Some((linkedinProfile \ "emailAddress").as[String]),
                pictureUrl = Some((linkedinProfile \ "pictureUrl").as[String]),
                linkedinAccountId = Some((linkedinProfile \ "id").as[String]),
                linkedinBasicProfile = Some(linkedinProfile)
              )

              AccountDto.update(updatedAccount)

              Redirect("/order/assessment-info")
          }
        }
    }
  }

  private def getI18nMessages(request: Request[AnyContent]): Map[String, String] = {
    messagesApi.messages(Lang.preferred(request.acceptLanguages).language)
  }
}
