package services

import play.api.i18n.MessagesApi
import play.api.mvc.{AnyContent, Request, Session}

object SessionService {
  val sessionKeyAccountId = "accountId"

  private var i18nMessagesSv = Map[String, String]()
  private var i18nMessagesEn = Map[String, String]()

  def isSignedIn(request: Request[AnyContent]): Boolean = {
    getAccountId(request.session).isDefined
  }

  def getAccountId(session: Session): Option[Long] = {
    session.get(sessionKeyAccountId) match {
      case None => None
      case Some(accountId) => Some(accountId.toLong)
    }
  }

  def getI18nMessagesFromCode(languageCode: String, messagesApi: MessagesApi): Map[String, String] = {
    if (i18nMessagesSv.isEmpty) {
      i18nMessagesSv = I18nService.getMessages(messagesApi, I18nService.languageCodeSv)
    }
    if (i18nMessagesEn.isEmpty) {
      i18nMessagesEn = I18nService.getMessages(messagesApi, I18nService.languageCodeEn)
    }

    if (languageCode == I18nService.languageCodeEn) {
      i18nMessagesEn
    } else {
      i18nMessagesSv
    }
  }
}
