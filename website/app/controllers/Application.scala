package controllers

import javax.inject.Inject

import db.{AccountDto, CruitedProductDto, EditionDto, ReductionDto}
import play.api.Play.current
import play.api.i18n.{I18nSupport, Lang, MessagesApi}
import play.api.libs.json.JsNull
import play.api.mvc._
import services.{DocumentService, LinkedinService, SessionService}

import scala.util.Random

class Application @Inject()(val messagesApi: MessagesApi, val linkedinService: LinkedinService) extends Controller with I18nSupport {
  val doNotCachePage = Array(CACHE_CONTROL -> "no-cache, no-store")

  def index = Action { request =>
    val headerData = getHeaderData(request.session)

    /* TODO
    if (headerData.isSignedIn) {
      Ok(views.html.dashboard(headerData, None, JsNull))
    } else {
      Ok(views.html.orderStep1(getI18nMessages(request), headerData, CruitedProductDto.getAll, ReductionDto.getAll, EditionDto.all))
    } */

    Redirect("/order")
  }

  def orderStep1 = Action { request =>
    Ok(views.html.orderStep1(getI18nMessages(request), getHeaderData(request.session), CruitedProductDto.getAll, ReductionDto.getAll, EditionDto.all))
  }

  def orderStep2 = Action { request =>
    var newSession = request.session

    val accountId = SessionService.getAccountId(request.session) match {
      case None => generateTempAccountIdAndInitialiseTables(request.session)

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

    Ok(views.html.orderStep2(getI18nMessages(request), getHeaderData(request.session), linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStep2), linkedinBasicProfile, None))
      .withSession(newSession)
      .withHeaders(doNotCachePage: _*)
  }

  def linkedinCallbackOrderStep2 = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => BadRequest("linkedinCallbackOrderStep2 without account ID in session")
      case Some(accountId) =>
        if (request.queryString.contains("error")) {
          Ok(views.html.orderStep2(getI18nMessages(request), getHeaderData(request.session), linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStep2), JsNull, Some("Error #" + request.queryString.get("error").get.head + ": " + request.queryString.get("error_description").get.head)))
        } else if (!request.queryString.contains("state") ||
          request.queryString.get("state").get.head != linkedinService.linkedinState) {
          BadRequest("Linkedin Auth returned wrong value for 'state'!")
        } else if (!request.queryString.contains("code")) {
          BadRequest("Linkedin Auth did not return any value for 'code'!")
        } else {
          linkedinService.authCode = Some(request.queryString.get("code").get.head)
          linkedinService.requestAccessToken(linkedinService.linkedinRedirectUriOrderStep2)

          val linkedinProfile = linkedinService.getProfile

          AccountDto.getOfId(accountId) match {
            case None => throw new Exception("No account found in session for ID '" + accountId + "'")
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

              Redirect("/order/2")
          }
        }
    }
  }

  // TODO: remove
  def signOut = Action { request =>
    linkedinService.invalidateAccessToken()
    Redirect("/").withNewSession
  }

  private def getHeaderData(session: Session): HeaderData = {
    HeaderData(SessionService.getAccountId(session).isDefined, linkedinService.getAuthCodeRequestUrl(linkedinService.linkedinRedirectUriOrderStep2))
  }

  private def getI18nMessages(request: Request[AnyContent]): Map[String, String] = {
    messagesApi.messages(Lang.preferred(request.acceptLanguages).language)
  }

  private def generateTempAccountIdAndInitialiseTables(session: Session): Long = {
    val rand = Random.nextLong()

    // We only want to generate negative IDs, because positive ones are for non-temp accounts
    val tempAccoundId = if (rand >= 0) {
      -rand
    } else {
      rand
    }

    AccountDto.createTemporary(tempAccoundId)

    tempAccoundId
  }
}
