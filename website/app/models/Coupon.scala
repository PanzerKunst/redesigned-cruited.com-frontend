package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class Coupon(id: Long,
                  code: String,
                  campaignName: String,
                  expirationTimestamp: Long,
                  discountPercentage: Option[Int],
                  discountPrice: Option[Price],
                  `type`: Int,
                  maxUseCount: Int)

object Coupon {
  implicit val writes: Writes[Coupon] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "code").write[String] and
      (JsPath \ "campaignName").write[String] and
      (JsPath \ "expirationTimestamp").write[Long] and
      (JsPath \ "discountPercentage").writeNullable[Int] and
      (JsPath \ "discountPrice").writeNullable[Price] and
      (JsPath \ "type").write[Int] and
      (JsPath \ "maxUseCount").write[Int]
    )(unlift(Coupon.unapply))

  val typeNoRestriction = 0
  val typeSingleUse = 1
  val typeTwoUses = 2
  val typeOncePerAccount = 3
  val typeNUsesPerAccount = 4
}
