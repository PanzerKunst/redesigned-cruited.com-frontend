package controllers

import javax.inject.Inject

import controllers.api.LinkedinApi
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.libs.json.JsNull
import play.api.mvc._

class Application @Inject()(val messagesApi: MessagesApi, val linkedinApi: LinkedinApi) extends Controller with I18nSupport {
  val doNotCachePage = Array(CACHE_CONTROL -> "no-cache, no-store")

  def index = Action {
    Ok(views.html.index(linkedinApi.linkedinAuthCodeRequestUrl))
  }

  def linkedinCallback = Action { request =>
    if (request.queryString.contains("error")) {
      Ok(views.html.dashboard(Some("Error #" + request.queryString.get("error").get.head + ": " + request.queryString.get("error_description").get.head), JsNull))
    } else if (!request.queryString.contains("state") ||
      request.queryString.get("state").get.head != linkedinApi.linkedinState) {
      BadRequest("Linkedin Auth returned wrong value for 'state'!")
    } else if (!request.queryString.contains("code")) {
      BadRequest("Linkedin Auth did not return any value for 'code'!")
    } else {
      linkedinApi.authCode = Some(request.queryString.get("code").get.head)
      linkedinApi.requestAccessToken()
      Ok(views.html.dashboard(None, linkedinApi.getProfile))
    }
  }
}
