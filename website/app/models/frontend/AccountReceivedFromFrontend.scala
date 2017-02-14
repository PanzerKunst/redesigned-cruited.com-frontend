package models.frontend

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Reads}

case class AccountReceivedFromFrontend(emailAddress: String,
                                       firstName: String,
                                       password: Option[String],
                                       languageCode: Option[String])

object AccountReceivedFromFrontend {
  implicit val reads: Reads[AccountReceivedFromFrontend] = (
    (JsPath \ "emailAddress").read[String] and
      (JsPath \ "firstName").read[String] and
      (JsPath \ "password").readNullable[String] and
      (JsPath \ "languageCode").readNullable[String]
    )(AccountReceivedFromFrontend.apply _)
}
