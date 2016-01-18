package services

import play.api.mvc.{AnyContent, Request, Session}

object SessionService {
  val sessionKeyAccountId = "accountId"
  val sessionKeyOrderId = "orderId"
  val sessionKeyAccountSaveSuccessful = "accountSaveSuccessful"
  val sessionKeyResetPasswordToken = "resetPasswordToken"

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
}
