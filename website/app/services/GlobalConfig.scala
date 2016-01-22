package services

import play.api.Play
import play.api.Play.current
import play.api.i18n.{MessagesApi, Lang}
import play.api.mvc.{Request, AnyContent}

object GlobalConfig {
  val applicationSecret = Play.configuration.getString("play.crypto.secret").get
  val currencyCode = Play.configuration.getString("currencyCode").get
  val supportedLanguages = Play.configuration.getStringList("play.i18n.langs").get

  def getI18nMessages(messagesApi: MessagesApi): Map[String, String] = {
    messagesApi.messages(new Lang(supportedLanguages.get(0)).language)
  }
}
