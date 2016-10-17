package models

import play.api.libs.functional.syntax._
import play.api.libs.json._

case class Account(id: Long,
                   firstName: String,
                   lastName: Option[String],
                   emailAddress: String,
                   password: Option[String],
                   linkedinProfile: JsValue,
                   `type`: Int,
                   languageCode: String,
                   creationTimestamp: Long)

object Account {
  implicit val writes: Writes[Account] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "firstName").write[String] and
      (JsPath \ "lastName").writeNullable[String] and
      (JsPath \ "emailAddress").write[String] and
      (JsPath \ "password").writeNullable[String] and
      (JsPath \ "linkedinProfile").write[JsValue] and
      (JsPath \ "type").write[Int] and
      (JsPath \ "languageCode").write[String] and
      (JsPath \ "creationTimestamp").write[Long]
    )(unlift(Account.unapply))

  val typeCustomer = 2
  val typeRater = 3
  val typeAdmin = 1
}
