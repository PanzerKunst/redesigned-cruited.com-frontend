package models.frontend

import models.{Coupon, Edition}
import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class FrontendOrder(id: Long,
                         idInBase64: String,
                         edition: Edition,
                         containedProductCodes: List[String],
                         coupon: Option[Coupon],
                         cvFileName: Option[String],
                         coverLetterFileName: Option[String],
                         positionSought: Option[String],
                         employerSought: Option[String],
                         jobAdUrl: Option[String],
                         customerComment: Option[String],
                         accountId: Option[Long],
                         status: Int,
                         languageCode: String,
                         creationTimestamp: Long,
                         paymentTimestamp: Option[Long])

object FrontendOrder {
  implicit val writes: Writes[FrontendOrder] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "idInBase64").write[String] and
      (JsPath \ "edition").write[Edition] and
      (JsPath \ "containedProductCodes").write[List[String]] and
      (JsPath \ "coupon").writeNullable[Coupon] and
      (JsPath \ "cvFileName").writeNullable[String] and
      (JsPath \ "coverLetterFileName").writeNullable[String] and
      (JsPath \ "positionSought").writeNullable[String] and
      (JsPath \ "employerSought").writeNullable[String] and
      (JsPath \ "jobAdUrl").writeNullable[String] and
      (JsPath \ "customerComment").writeNullable[String] and
      (JsPath \ "accountId").writeNullable[Long] and
      (JsPath \ "status").write[Int] and
      (JsPath \ "languageCode").write[String] and
      (JsPath \ "creationTimestamp").write[Long] and
      (JsPath \ "paymentTimestamp").writeNullable[Long]
    )(unlift(FrontendOrder.unapply))
}
