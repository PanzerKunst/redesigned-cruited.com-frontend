package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class Coupon(id: Long,
                  code: String,
                  campaignName: String,
                  expirationTimestamp: Long,
                  discountPercentage: Option[Int],
                  discountPrice: Option[Price],
                  `type`: Int,
                  maxUseCount: Int,
                  couponExpiredMsg: Option[String])

object Coupon {
  implicit val format: Format[Coupon] = (
    (JsPath \ "id").format[Long] and
      (JsPath \ "code").format[String] and
      (JsPath \ "campaignName").format[String] and
      (JsPath \ "expirationTimestamp").format[Long] and
      (JsPath \ "discountPercentage").formatNullable[Int] and
      (JsPath \ "discountPrice").formatNullable[Price] and
      (JsPath \ "type").format[Int] and
      (JsPath \ "maxUseCount").format[Int] and
      (JsPath \ "couponExpiredMsg").formatNullable[String]
    )(Coupon.apply, unlift(Coupon.unapply))

  val typeNoRestriction = 0
  val typeSingleUse = 1
  val typeTwoUses = 2
  val typeOncePerAccount = 3
  val typeNUsesPerAccount = 4
}
