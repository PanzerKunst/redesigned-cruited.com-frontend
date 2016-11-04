package models.frontend

import models.DefaultComment
import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class FrontendCommentVariation(id: Long,
                            defaultComment: DefaultComment,
                            text: String,
                            editionId: Option[Long])

object FrontendCommentVariation {
  implicit val format: Format[FrontendCommentVariation] = (
    (JsPath \ "id").format[Long] and
      (JsPath \ "defaultComment").format[DefaultComment] and
      (JsPath \ "text").format[String] and
      (JsPath \ "editionId").formatNullable[Long]
    )(FrontendCommentVariation.apply, unlift(FrontendCommentVariation.unapply))
}
