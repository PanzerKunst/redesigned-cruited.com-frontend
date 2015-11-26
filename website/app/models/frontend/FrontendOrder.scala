package models.frontend

import models.Edition
import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class FrontendOrder(id: Long,
                         edition: Edition,
                         containedProductCodes: List[String],
                         couponId: Option[Long],
                         cvFileName: Option[String],
                         coverLetterFileName: Option[String],
                         linkedinProfileFileName: Option[String],
                         positionSought: Option[String],
                         employerSought: Option[String],
                         jobAdUrl: Option[String],
                         accountId: Option[Long],
                         status: Int,
                         creationTimestamp: Long)

object FrontendOrder {
  implicit val writes: Writes[FrontendOrder] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "edition").write[Edition] and
      (JsPath \ "containedProductCodes").write[List[String]] and
      (JsPath \ "couponId").writeNullable[Long] and
      (JsPath \ "cvFileName").writeNullable[String] and
      (JsPath \ "coverLetterFileName").writeNullable[String] and
      (JsPath \ "linkedinProfileFileName").writeNullable[String] and
      (JsPath \ "positionSought").writeNullable[String] and
      (JsPath \ "employerSought").writeNullable[String] and
      (JsPath \ "jobAdUrl").writeNullable[String] and
      (JsPath \ "accountId").writeNullable[Long] and
      (JsPath \ "status").write[Int] and
      (JsPath \ "creationTimestamp").write[Long]
    )(unlift(FrontendOrder.unapply))
}