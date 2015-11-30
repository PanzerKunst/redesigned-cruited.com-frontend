package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class RedComment(id: Long,
                      category: Category,
                      text: String,
                      weight: Int)

object RedComment {
  implicit val writes: Writes[RedComment] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "category").write[Category] and
      (JsPath \ "text").write[String] and
      (JsPath \ "weight").write[Int]
    )(unlift(RedComment.unapply))
}
