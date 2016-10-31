package models

import play.api.libs.functional.syntax._
import play.api.libs.json._

case class Account(id: Long,
                   firstName: String,
                   lastName: Option[String],
                   emailAddress: String,
                   linkedinProfile: JsValue,
                   `type`: Int,
                   languageCode: String,
                   creationTimestamp: Long)

object Account {
  implicit val format: Format[Account] = (
    (JsPath \ "id").format[Long] and
      (JsPath \ "firstName").format[String] and
      (JsPath \ "lastName").formatNullable[String] and
      (JsPath \ "emailAddress").format[String] and
      (JsPath \ "linkedinProfile").format[JsValue] and
      (JsPath \ "type").format[Int] and
      (JsPath \ "languageCode").format[String] and
      (JsPath \ "creationTimestamp").format[Long]
    )(Account.apply, unlift(Account.unapply))

  val typeCustomer = 2
  val typeRater = 3
  val typeAdmin = 1

  val showActive = 1
  val showDeleted = 2
}
