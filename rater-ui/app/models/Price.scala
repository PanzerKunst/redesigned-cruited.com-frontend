package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class Price(amount: Double,
                 currencyCode: String)

object Price {
  implicit val format: Format[Price] = (
    (JsPath \ "amount").format[Double] and
      (JsPath \ "currencyCode").format[String]
    )(Price.apply, unlift(Price.unapply))
}
