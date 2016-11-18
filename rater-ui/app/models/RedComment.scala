package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class RedComment(id: Option[Long], // None when custom comment coming from frontend
                      categoryId: Long,
                      text: String,
                      points: Option[Int])  // None when custom comment coming from frontend

object RedComment {
  implicit val format: Format[RedComment] = (
    (JsPath \ "id").formatNullable[Long] and
      (JsPath \ "categoryId").format[Long] and
      (JsPath \ "text").format[String] and
      (JsPath \ "points").formatNullable[Int]
    )(RedComment.apply, unlift(RedComment.unapply))
}
