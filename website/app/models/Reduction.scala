package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class Reduction(id: Long,
                     code: String,
                     price: Price)

object Reduction {
  implicit val writes: Writes[Reduction] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "code").write[String] and
      (JsPath \ "price").write[Price]
    )(unlift(Reduction.unapply))

  val code2ProductsSameOrder = "2_PRODUCTS_SAME_ORDER"
  val code3ProductsSameOrder = "3_PRODUCTS_SAME_ORDER"
}
