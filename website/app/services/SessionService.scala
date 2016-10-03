package services

import db.SupportedLanguageDto
import models.SupportedLanguage
import play.api.Logger
import play.api.i18n.MessagesApi
import play.api.mvc.{AnyContent, Request, Session}

object SessionService {
  val sessionKeyAccountId = "accountId"
  val sessionKeyOrderId = "orderId"
  val sessionKeyAccountSaveSuccessful = "accountSaveSuccessful"
  val sessionKeyResetPasswordToken = "resetPasswordToken"
  val sessionKeyLanguageCode = "languageCode"

  private val defaultLanguage = SupportedLanguageDto.all.head
  private var languageCodeOnLastCheck = defaultLanguage.ietfCode
  private var i18nMessagesOnLastCheck = Map[String, String]()

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
    if (i18nMessagesOnLastCheck.size == 0 || languageCode != languageCodeOnLastCheck) {
      languageCodeOnLastCheck = languageCode
      i18nMessagesOnLastCheck = I18nService.getMessages(messagesApi, languageCode)
    }

    i18nMessagesOnLastCheck
  }
}
