package models.frontend

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, JsValue, Reads}

case class AccountReceivedFromFrontend(emailAddress: String,
                                       firstName: String,
                                       password: Option[String],
                                       linkedinProfile: Option[JsValue])

object AccountReceivedFromFrontend {
  implicit val reads: Reads[AccountReceivedFromFrontend] = (
    (JsPath \ "emailAddress").read[String] and
      (JsPath \ "firstName").read[String] and
      (JsPath \ "password").readNullable[String] and
      (JsPath \ "linkedinProfile").readNullable[JsValue]
    )(AccountReceivedFromFrontend.apply _)
}
