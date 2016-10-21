package models.frontend

import models.{Account, Coupon}
import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class FrontendOrder(id: Long,
                         idInBase64: String,
                         tags: List[String],
                         containedProductCodes: List[String],
                         coupon: Option[Coupon],
                         cvFileName: Option[String],
                         coverLetterFileName: Option[String],
                         linkedinProfileFileName: Option[String],
                         positionSought: Option[String],
                         employerSought: Option[String],
                         jobAdUrl: Option[String],
                         customerComment: Option[String],
                         customer: Account,
                         rater: Option[Account],
                         status: Int,
                         languageCode: String,
                         creationTimestamp: Long,
                         paymentTimestamp: Long)

object FrontendOrder {
  implicit val writes: Writes[FrontendOrder] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "idInBase64").write[String] and
      (JsPath \ "tags").write[List[String]] and
      (JsPath \ "containedProductCodes").write[List[String]] and
      (JsPath \ "coupon").writeNullable[Coupon] and
      (JsPath \ "cvFileName").writeNullable[String] and
      (JsPath \ "coverLetterFileName").writeNullable[String] and
      (JsPath \ "linkedinProfileFileName").writeNullable[String] and
      (JsPath \ "positionSought").writeNullable[String] and
      (JsPath \ "employerSought").writeNullable[String] and
      (JsPath \ "jobAdUrl").writeNullable[String] and
      (JsPath \ "customerComment").writeNullable[String] and
      (JsPath \ "customer").write[Account] and
      (JsPath \ "rater").writeNullable[Account] and
      (JsPath \ "status").write[Int] and
      (JsPath \ "languageCode").write[String] and
      (JsPath \ "creationTimestamp").write[Long] and
      (JsPath \ "paymentTimestamp").write[Long]
    )(unlift(FrontendOrder.unapply))
}
