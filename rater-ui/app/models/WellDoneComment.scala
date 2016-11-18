package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class WellDoneComment(categoryId: Long,
                           text: String)

object WellDoneComment {
  implicit val format: Format[WellDoneComment] = (
      (JsPath \ "categoryId").format[Long] and
      (JsPath \ "text").format[String]
    )(WellDoneComment.apply, unlift(WellDoneComment.unapply))
}
