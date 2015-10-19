package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class CruitedProduct(id: Long,
                          code: String,
                          price: Price)

object CruitedProduct {
  implicit val writes: Writes[CruitedProduct] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "code").write[String] and
      (JsPath \ "price").write[Price]
    )(unlift(CruitedProduct.unapply))
}
