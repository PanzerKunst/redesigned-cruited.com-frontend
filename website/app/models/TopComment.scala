package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class TopComment(id: Long,
                      category: Category,
                      text: String)

object TopComment {
  implicit val writes: Writes[TopComment] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "category").write[Category] and
      (JsPath \ "text").write[String]
    )(unlift(TopComment.unapply))
}
