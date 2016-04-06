package services

import javax.inject.{Inject, Singleton}

import db.SupportedLanguageDto
import models.SupportedLanguage
import play.api.i18n.{Lang, MessagesApi}

@Singleton
class I18nService @Inject()(val messagesApi: MessagesApi) {
  var currentLanguage = SupportedLanguageDto.all.head
  var messages = getMessages(messagesApi)

  def getMessages(messagesApi: MessagesApi): Map[String, String] = {
    messagesApi.messages(new Lang(currentLanguage.ietfCode).language)
  }
}
