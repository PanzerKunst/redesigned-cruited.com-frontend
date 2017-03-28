package services

import db.SupportedLanguageDto
import models.SupportedLanguage
import play.api.i18n.MessagesApi
import play.api.mvc.{AnyContent, Request, Session}

object SessionService {
  val sessionKeyAccountId = "accountId"
  val sessionKeyOrderId = "orderId"
  val sessionKeyAccountSaveSuccessful = "accountSaveSuccessful"
  val sessionKeyResetPasswordToken = "resetPasswordToken"
  val sessionKeyLanguageCode = "languageCode"

  private val defaultLanguage = SupportedLanguageDto.All.head
  private var i18nMessagesSv = Map[String, String]()
  private var i18nMessagesEn = Map[String, String]()

  def getOrderId(session: Session): Option[Long] = {
    session.get(sessionKeyOrderId) match {
      case None => None
      case Some(orderId) => Some(orderId.toLong)
    }
  }

  def isSignedIn(request: Request[AnyContent]): Boolean = {
    val accountId = getAccountId(request.session)

    accountId.isDefined && !AccountService.isTemporary(accountId.get)
  }

  def getAccountId(session: Session): Option[Long] = {
    session.get(sessionKeyAccountId) match {
      case None => None
      case Some(accountId) => Some(accountId.toLong)
    }
  }

  def isAccountSaveSuccessful(session: Session): Boolean = {
    session.get(sessionKeyAccountSaveSuccessful) match {
      case None => false
      case Some(str) => str.toBoolean
    }
  }

  def getCurrentLanguage(session: Session): SupportedLanguage = {
    session.get(sessionKeyLanguageCode) match {
      case None => defaultLanguage
      case Some(languageCode) => SupportedLanguageDto.getOfCode(languageCode).get
    }
  }

  def getI18nMessages(language: SupportedLanguage, messagesApi: MessagesApi): Map[String, String] = {
    getI18nMessagesFromCode(language.ietfCode, messagesApi)
  }

  private def getI18nMessagesFromCode(languageCode: String, messagesApi: MessagesApi): Map[String, String] = {
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
