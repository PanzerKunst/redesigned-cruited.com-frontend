package models.frontend

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, JsValue, Reads}

case class AccountReceivedFromFrontend(emailAddress: String,
                                       firstName: String,
                                       password: Option[String],
                                       languageCode: String,
                                       linkedinProfile: JsValue)

object AccountReceivedFromFrontend {
  implicit val reads: Reads[AccountReceivedFromFrontend] = (
    (JsPath \ "emailAddress").read[String] and
      (JsPath \ "firstName").read[String] and
      (JsPath \ "password").readNullable[String] and
      (JsPath \ "languageCode").read[String] and
      (JsPath \ "linkedinProfile").read[JsValue]
    )(AccountReceivedFromFrontend.apply _)
}
