package models.frontend

import models.{Account, Coupon}
import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

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
                         paymentTimestamp: Long,
                         dueTimestamp: Long)

object FrontendOrder {
  implicit val format: Format[FrontendOrder] = (
    (JsPath \ "id").format[Long] and
      (JsPath \ "idInBase64").format[String] and
      (JsPath \ "tags").format[List[String]] and
      (JsPath \ "containedProductCodes").format[List[String]] and
      (JsPath \ "coupon").formatNullable[Coupon] and
      (JsPath \ "cvFileName").formatNullable[String] and
      (JsPath \ "coverLetterFileName").formatNullable[String] and
      (JsPath \ "linkedinProfileFileName").formatNullable[String] and
      (JsPath \ "positionSought").formatNullable[String] and
      (JsPath \ "employerSought").formatNullable[String] and
      (JsPath \ "jobAdUrl").formatNullable[String] and
      (JsPath \ "customerComment").formatNullable[String] and
      (JsPath \ "customer").format[Account] and
      (JsPath \ "rater").formatNullable[Account] and
      (JsPath \ "status").format[Int] and
      (JsPath \ "languageCode").format[String] and
      (JsPath \ "creationTimestamp").format[Long] and
      (JsPath \ "paymentTimestamp").format[Long] and
      (JsPath \ "dueTimestamp").format[Long]
    )(FrontendOrder.apply, unlift(FrontendOrder.unapply))
}
