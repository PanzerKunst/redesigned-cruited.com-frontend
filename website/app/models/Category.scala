package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class Category(id: Long,
                    productCode: String)

object Category {
  implicit val writes: Writes[Category] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "productCode").write[String]
    )(unlift(Category.unapply))
}
