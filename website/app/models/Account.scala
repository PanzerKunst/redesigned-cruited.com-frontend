package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, JsValue, Writes}

case class Account(id: Long,
                   firstName: Option[String],
                   lastName: Option[String],
                   emailAddress: Option[String],
                   password: Option[String],
                   linkedinProfile: JsValue,
                   `type`: Int,
                   creationTimestamp: Long) {

  def isAllowedToViewAllReportsAndEditOrders: Boolean = {
    `type` != Account.typeCustomer
  }
}

object Account {
  val typeCustomer = 2
  val typeRater = 3
  val typeAdmin = 1

  implicit val writes: Writes[Account] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "firstName").writeNullable[String] and
      (JsPath \ "lastName").writeNullable[String] and
      (JsPath \ "emailAddress").writeNullable[String] and
      (JsPath \ "password").writeNullable[String] and
      (JsPath \ "linkedinProfile").write[JsValue] and
      (JsPath \ "type").write[Int] and
      (JsPath \ "creationTimestamp").write[Long]
    )(unlift(Account.unapply))
}
