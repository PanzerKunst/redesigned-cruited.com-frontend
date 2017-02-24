package services

import db.SupportedLanguageDto
import models.SupportedLanguage
import play.api.i18n.MessagesApi
import play.api.mvc.{AnyContent, Request, Session}

object SessionService {
  val SessionKeyAccountId = "accountId"
  val SessionKeyOrderId = "orderId"
  val SessionKeyAccountSaveSuccessful = "accountSaveSuccessful"
  val SessionKeyResetPasswordToken = "resetPasswordToken"
  val SessionKeyLanguageCode = "languageCode"

  private val DefaultLanguage = SupportedLanguageDto.all.head
  private var I18nMessagesSv = Map[String, String]()
  private var I18nMessagesEn = Map[String, String]()

  def getOrderId(session: Session): Option[Long] = {
    session.get(SessionKeyOrderId) match {
      case None => None
      case Some(orderId) => Some(orderId.toLong)
    }
  }

  def isSignedIn(request: Request[AnyContent]): Boolean = {
    val accountId = getAccountId(request.session)

    accountId.isDefined && !AccountService.isTemporary(accountId.get)
  }

  def getAccountId(session: Session): Option[Long] = {
    session.get(SessionKeyAccountId) match {
      case None => None
      case Some(accountId) => Some(accountId.toLong)
    }
  }

  def isAccountSaveSuccessful(session: Session): Boolean = {
    session.get(SessionKeyAccountSaveSuccessful) match {
      case None => false
      case Some(str) => str.toBoolean
    }
  }

  def getCurrentLanguage(session: Session): SupportedLanguage = {
    session.get(SessionKeyLanguageCode) match {
      case None => DefaultLanguage
      case Some(languageCode) => SupportedLanguageDto.getOfCode(languageCode).get
    }
  }

  def getI18nMessages(language: SupportedLanguage, messagesApi: MessagesApi): Map[String, String] = {
    getI18nMessagesFromCode(language.ietfCode, messagesApi)
  }

  private def getI18nMessagesFromCode(languageCode: String, messagesApi: MessagesApi): Map[String, String] = {
    if (I18nMessagesSv.isEmpty) {
      I18nMessagesSv = I18nService.getMessages(messagesApi, I18nService.languageCodeSv)
    }
    if (I18nMessagesEn.isEmpty) {
      I18nMessagesEn = I18nService.getMessages(messagesApi, I18nService.languageCodeEn)
    }

    if (languageCode == I18nService.languageCodeEn) {
      I18nMessagesEn
    } else {
      I18nMessagesSv
    }
  }
}
