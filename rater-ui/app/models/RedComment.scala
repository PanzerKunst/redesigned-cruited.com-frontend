package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class RedComment(defaultCommentId: Option[Long], // None when custom comment
                      categoryId: Long,
                      text: String,
                      points: Option[Int])  // None when custom comment

object RedComment {
  implicit val format: Format[RedComment] = (
    (JsPath \ "defaultCommentId").formatNullable[Long] and
      (JsPath \ "categoryId").format[Long] and
      (JsPath \ "text").format[String] and
      (JsPath \ "points").formatNullable[Int]
    )(RedComment.apply, unlift(RedComment.unapply))
}
