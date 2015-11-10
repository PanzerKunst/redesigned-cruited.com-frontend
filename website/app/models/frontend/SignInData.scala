package models.frontend

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Reads}

case class SignInData(emailAddress: String,
                      password: String)

object SignInData {
  implicit val reads: Reads[SignInData] = (
    (JsPath \ "emailAddress").read[String] and
      (JsPath \ "password").read[String]
    )(SignInData.apply _)
}
