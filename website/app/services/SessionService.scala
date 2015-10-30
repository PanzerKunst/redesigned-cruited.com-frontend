package services

import play.api.libs.json.{JsNull, JsValue, Json}
import play.api.mvc.Session

object SessionService {
  def getAccountId(session: Session): Option[Long] = {
    session.get("accountId") match {
      case None => None
      case Some(accountId) => Some(accountId.toLong)
    }
  }

  def getLinkedinProfile(session: Session): JsValue = {
    session.get("linkedinProfile") match {
      case None => JsNull
      case Some(linkedinProfile) => Json.parse(linkedinProfile)
    }
  }

  def isSignedIn(session: Session): Boolean = {
    val accountId = getAccountId(session: Session)

    accountId.isDefined && !AccountService.isTemporary(accountId.get)
  }
}
