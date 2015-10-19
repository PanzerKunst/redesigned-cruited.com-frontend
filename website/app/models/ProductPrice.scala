package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class ProductPrice(id: Long,
                        productId: Long,
                        amount: Double,
                        currencyCode: String)

object ProductPrice {
  implicit val writes: Writes[ProductPrice] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "productId").write[Long] and
      (JsPath \ "amount").write[Double] and
      (JsPath \ "currencyCode").write[String]
    )(unlift(ProductPrice.unapply))
}
