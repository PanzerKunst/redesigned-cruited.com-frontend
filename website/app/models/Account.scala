package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, JsValue, Writes}

case class Account(id: Long,
                   emailAddress: String,
                   password: Option[String],
                   linkedinAccountId: Option[String],
                   linkedinBasicProfile: Option[JsValue],
                   creationTimestamp: Long)

object Account {
  implicit val writes: Writes[Account] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "emailAddress").write[String] and
      (JsPath \ "password").writeNullable[String] and
      (JsPath \ "linkedinAccountId").writeNullable[String] and
      (JsPath \ "linkedinBasicProfile").writeNullable[JsValue] and
      (JsPath \ "creationTimestamp").write[Long]
    )(unlift(Account.unapply))
}
