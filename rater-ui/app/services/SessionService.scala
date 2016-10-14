package services

import play.api.mvc.{AnyContent, Request, Session}

object SessionService {
  val sessionKeyAccountId = "accountId"

  def isSignedIn(request: Request[AnyContent]): Boolean = {
    getAccountId(request.session).isDefined
  }

  def getAccountId(session: Session): Option[Long] = {
    session.get(sessionKeyAccountId) match {
      case None => None
      case Some(accountId) => Some(accountId.toLong)
    }
  }
}
