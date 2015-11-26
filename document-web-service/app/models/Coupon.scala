package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class Coupon(id: Long,
                  code: String,
                  campaignName: String,
                  expirationTimestamp: Long,
                  discountPercentage: Option[Int],
                  discountPrice: Option[Price])

object Coupon {
  implicit val writes: Writes[Coupon] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "code").write[String] and
      (JsPath \ "campaignName").write[String] and
      (JsPath \ "expirationTimestamp").write[Long] and
      (JsPath \ "discountPercentage").writeNullable[Int] and
      (JsPath \ "discountPrice").writeNullable[Price]
    )(unlift(Coupon.unapply))
}
