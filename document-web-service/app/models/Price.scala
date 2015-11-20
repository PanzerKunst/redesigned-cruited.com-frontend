package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class Price(amount: Double,
                 currencyCode: String)

object Price {
  implicit val writes: Writes[Price] = (
    (JsPath \ "amount").write[Double] and
      (JsPath \ "currencyCode").write[String]
    )(unlift(Price.unapply))
}
