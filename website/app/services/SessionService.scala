package services

import play.api.libs.json.{JsNull, JsValue, Json}
import play.api.mvc.{AnyContent, Request, Session}

object SessionService {
  val SESSION_KEY_ACCOUNT_ID = "accountId"
  val SESSION_KEY_ORDER_ID = "orderId"

  def getAccountId(session: Session): Option[Long] = {
    session.get(SESSION_KEY_ACCOUNT_ID) match {
      case None => None
      case Some(accountId) => Some(accountId.toLong)
    }
  }

  def getOrderId(session: Session): Option[Long] = {
    session.get(SESSION_KEY_ORDER_ID) match {
      case None => None
      case Some(orderId) => Some(orderId.toLong)
    }
  }

  def isSignedIn(request: Request[AnyContent]): Boolean = {
    val accountId = getAccountId(request.session)

    accountId.isDefined && !AccountService.isTemporary(accountId.get)
  }
}
