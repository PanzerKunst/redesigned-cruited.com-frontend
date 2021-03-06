package services

import play.api.i18n.{Lang, MessagesApi}

object I18nService {
  val languageCodeSv = "sv"
  val languageCodeEn = "en"

  def getMessages(messagesApi: MessagesApi, languageCode: String): Map[String, String] = {
    messagesApi.messages(new Lang(languageCode).language)
  }
}
