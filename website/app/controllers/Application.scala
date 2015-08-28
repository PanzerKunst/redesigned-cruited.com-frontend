package controllers

import javax.inject.Inject

import play.api.i18n.{I18nSupport, Lang, MessagesApi}
import play.api.mvc._
import play.api.Play.current

class Application @Inject()(val messagesApi: MessagesApi) extends Controller with I18nSupport {
  val doNotCachePage = Array(CACHE_CONTROL -> "no-cache, no-store")

  def index = Action { implicit request =>
    val lang = if (isIpAddressLocatedInSweden) {
      Lang.apply("sv")
    } else {
      Lang.preferred(request.acceptLanguages)
    }

    Ok(views.html.index()).withLang(lang)
  }

  private def isIpAddressLocatedInSweden: Boolean = {
    false
  }

  def create = Action { implicit request =>
    Ok
  }
}
