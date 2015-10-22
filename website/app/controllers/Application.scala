package controllers

import javax.inject.Inject

import controllers.api.LinkedinApi
import db.{EditionDto, ReductionDto, AccountDto, CruitedProductDto}
import play.api.Play.current
import play.api.i18n.{I18nSupport, Lang, MessagesApi}
import play.api.libs.json.JsNull
import play.api.mvc._

class Application @Inject()(val messagesApi: MessagesApi, val linkedinApi: LinkedinApi) extends Controller with I18nSupport {
  val doNotCachePage = Array(CACHE_CONTROL -> "no-cache, no-store")

  def index = Action { request =>
    val headerData = getHeaderData(request.session)

    if (headerData.isSignedIn) {
      Ok(views.html.dashboard(headerData, None, JsNull))
    } else {
      Ok(views.html.productSelection(getI18nMessages(request), headerData, CruitedProductDto.all, ReductionDto.getAll, EditionDto.all))
    }
  }

  def productSelection = Action { request =>
    Ok(views.html.productSelection(getI18nMessages(request), getHeaderData(request.session), CruitedProductDto.all, ReductionDto.getAll, EditionDto.all))
  }

  def linkedinCallback = Action { request =>
    if (request.queryString.contains("error")) {
      Ok(views.html.dashboard(getHeaderData(request.session), Some("Error #" + request.queryString.get("error").get.head + ": " + request.queryString.get("error_description").get.head), JsNull))
    } else if (!request.queryString.contains("state") ||
      request.queryString.get("state").get.head != linkedinApi.linkedinState) {
      BadRequest("Linkedin Auth returned wrong value for 'state'!")
    } else if (!request.queryString.contains("code")) {
      BadRequest("Linkedin Auth did not return any value for 'code'!")
    } else {
      linkedinApi.authCode = Some(request.queryString.get("code").get.head)
      linkedinApi.requestAccessToken()
      val linkedinProfile = linkedinApi.getProfile

      val linkedinAccountId = (linkedinProfile \ "id").as[String]

      val newSession = AccountDto.getOfLinkedinAccountId(linkedinAccountId) match {
        // If profile exists in DB, retrieve it and store its ID in session
        case Some(account) => request.session + ("accountId" -> account.id.toString)

        // If it doesn't exist in DB, save it as a new profile and store its ID in session
        case None =>
          val linkedinEmailAddress = (linkedinProfile \ "emailAddress").as[String]
          val idOfNewAccount = AccountDto.create(linkedinEmailAddress, None, Some(linkedinProfile))
          request.session + ("accountId" -> idOfNewAccount.toString)
      }

      Redirect("/").withSession(newSession)
    }
  }

  private def getAccountId(session: Session): Option[Long] = {
    session.get("accountId") match {
      case None => None
      case Some(accountId) => Some(accountId.toLong)
    }
  }

  private def isSignedIn(session: Session): Boolean = {
    session.get("accountId").isDefined
  }

  private def getHeaderData(session: Session): HeaderData = {
    HeaderData(isSignedIn(session), linkedinApi.linkedinAuthCodeRequestUrl)
  }

  private def getI18nMessages(request: Request[AnyContent]): Map[String, String] = {
    messagesApi.messages(Lang.preferred(request.acceptLanguages).language)
  }
}
