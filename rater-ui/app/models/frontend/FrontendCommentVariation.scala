package models.frontend

import models.{Edition, DefaultComment}
import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class FrontendCommentVariation(id: Long,
                            defaultComment: DefaultComment,
                            text: String,
                            edition: Option[Edition])

object FrontendCommentVariation {
  implicit val format: Format[FrontendCommentVariation] = (
    (JsPath \ "id").format[Long] and
      (JsPath \ "defaultComment").format[DefaultComment] and
      (JsPath \ "text").format[String] and
      (JsPath \ "edition").formatNullable[Edition]
    )(FrontendCommentVariation.apply, unlift(FrontendCommentVariation.unapply))
}
