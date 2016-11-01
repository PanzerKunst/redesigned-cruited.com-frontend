package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class DefaultComment(id: Long,
                          categoryId: Long,
                          greenText: String,
                          redText: String,
                          points: Int,
                          isGrouped: Boolean)

object DefaultComment {
  implicit val format: Format[DefaultComment] = (
    (JsPath \ "id").format[Long] and
      (JsPath \ "categoryId").format[Long] and
      (JsPath \ "greenText").format[String] and
      (JsPath \ "redText").format[String] and
      (JsPath \ "points").format[Int] and
      (JsPath \ "isGrouped").format[Boolean]
    )(DefaultComment.apply, unlift(DefaultComment.unapply))

  val dbGroupedFalse = 0
  val dbGroupedTrue = 1
}
