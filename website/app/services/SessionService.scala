package services

import play.api.libs.json.{JsNull, JsValue, Json}
import play.api.mvc.{AnyContent, Request, Session}

object SessionService {
  def getAccountId(session: Session): Option[Long] = {
    session.get("accountId") match {
      case None => None
      case Some(accountId) => Some(accountId.toLong)
    }
  }

  def isSignedIn(request: Request[AnyContent]): Boolean = {
    val accountId = getAccountId(request.session)

    accountId.isDefined && !AccountService.isTemporary(accountId.get)
  }
}
